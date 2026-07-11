#!/usr/bin/env node
// Ollama-based PR review script.
// Uses OpenAI-compatible Chat Completions endpoint exposed by the tunnel.
// Reads pr.diff (created by the workflow) and posts a single review comment
// to the PR, with a summary plus inline comments on lines that the model
// points at (when the line is present in the diff).
//
// Required env:
//   OLLAMA_BASE_URL   e.g. https://r4l626d.abc-tunnel.us/v1
//   OLLAMA_API_KEY    e.g. sk-...
//   OLLAMA_MODEL      e.g. ollama/minimax-m3
//   GITHUB_TOKEN      for posting comments
//   PR_NUMBER
//   PR_REPO           owner/repo
//   PR_TITLE
//   PR_AUTHOR

import { readFile, writeFile } from "node:fs/promises";
import { argv, env, exit } from "node:process";

const ARGS = new Set(argv.slice(2));
const DRY_RUN = ARGS.has("--dry-run");
const DIFF_FLAG = (argv.find((a) => a.startsWith("--diff=")) || "").slice(7);
const DIFF_PATH = DIFF_FLAG || (await (async () => {
  for (const p of ["pr.diff", "../pr.diff"]) {
    try { await readFile(p, "utf8"); return p; } catch {}
  }
  return "pr.diff";
})());
const OUT_PATH = (argv.find((a) => a.startsWith("--out=")) || "").slice(6) || "review-output.md";

const BASE_URL = (env.OLLAMA_BASE_URL || "").replace(/\/+$/, "");
const API_KEY = env.OLLAMA_API_KEY || "";
const MODEL = env.OLLAMA_MODEL || "ollama/minimax-m3";
const TOKEN = env.GITHUB_TOKEN || "";
const PR_NUMBER = env.PR_NUMBER || "";
const PR_REPO = env.PR_REPO || "";
const PR_TITLE = env.PR_TITLE || "";
const PR_AUTHOR = env.PR_AUTHOR || "";

const MAX_DIFF_CHARS = 60_000; // keep prompt under context window

function log(...a) { console.log("[ollama-review]", ...a); }

function summarizeDiff(diff) {
  const files = new Map();
  for (const line of diff.split("\n")) {
    if (line.startsWith("diff --git ")) {
      const m = line.match(/^diff --git a\/(.+?) b\/(.+?)$/);
      if (m) files.set(m[2], { added: 0, removed: 0 });
    } else if (line.startsWith("+") && !line.startsWith("+++")) {
      const last = [...files.values()].at(-1);
      if (last) last.added++;
    } else if (line.startsWith("-") && !line.startsWith("---")) {
      const last = [...files.values()].at(-1);
      if (last) last.removed++;
    }
  }
  return [...files.entries()].map(([f, c]) => `- \`${f}\` +${c.added}/-${c.removed}`).join("\n");
}

function buildPrompt(diff) {
  const summary = summarizeDiff(diff);
  const truncated = diff.length > MAX_DIFF_CHARS
    ? diff.slice(0, MAX_DIFF_CHARS) + "\n... (diff truncated)"
    : diff;
  return `You are a strict senior code reviewer. Review the following pull request and return STRICT JSON only.

PR Title: ${PR_TITLE}
PR Author: ${PR_AUTHOR}
Repository: ${PR_REPO}

Files changed (with +/- line counts):
${summary}

--- DIFF (unified) ---
${truncated}
--- END DIFF ---

Return JSON in EXACTLY this shape, no markdown fences, no extra text:
{
  "summary": "string, 2-4 sentences, in Vietnamese",
  "risk": "low" | "medium" | "high",
  "findings": [
    {
      "path": "string, file path as it appears in the diff",
      "line": 123,                       // line number in the NEW file (right side)
      "severity": "info" | "warning" | "blocking",
      "title": "short title",
      "comment": "markdown body, in Vietnamese, <= 6 lines"
    }
  ],
  "praise": ["string, brief positive observation"]
}

Rules:
- Only include findings that are HIGH CONFIDENCE. Skip style/nitpicks.
- For each finding, line MUST appear in the diff (use the right-hand side number after +).
- If there are no real issues, return findings: [].
- Keep total findings <= 10.
- Be concise and concrete. Reference variable/function names from the diff.`;
}

async function callOllama(prompt) {
  const url = `${BASE_URL}/chat/completions`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.2,
      stream: false,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You are a meticulous code reviewer. Output only valid JSON." },
        { role: "user", content: prompt },
      ],
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Ollama API ${res.status}: ${body.slice(0, 500)}`);
  }
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response from Ollama");
  return content;
}

function tryParseJson(text) {
  // Model sometimes wraps in ```json ... ```
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();
  try { return JSON.parse(cleaned); }
  catch {
    const m = cleaned.match(/\{[\s\S]*\}/);
    if (m) return JSON.parse(m[0]);
    throw new Error("Model response is not valid JSON: " + cleaned.slice(0, 200));
  }
}

function buildReviewBody(review) {
  const riskEmoji = { low: "🟢", medium: "🟡", high: "🔴" }[review.risk] || "⚪";
  const findings = review.findings || [];
  const counts = findings.reduce((a, f) => { a[f.severity] = (a[f.severity] || 0) + 1; return a; }, {});
  let body = `### 🤖 Ollama Code Review\n\n`;
  body += `**Risk:** ${riskEmoji} \`${review.risk}\`  `;
  body += `• 🔴 blocking: ${counts.blocking || 0}  `;
  body += `🟡 warning: ${counts.warning || 0}  `;
  body += `🔵 info: ${counts.info || 0}\n\n`;
  body += `${review.summary}\n\n`;
  if (findings.length) {
    body += `#### Findings\n\n`;
    for (const f of findings) {
      const icon = { info: "🔵", warning: "🟡", blocking: "🔴" }[f.severity] || "•";
      body += `- ${icon} **${f.title}** — \`${f.path}:${f.line}\`\n`;
      body += `  ${f.comment.replace(/\n/g, "\n  ")}\n`;
    }
    body += "\n";
  }
  if (review.praise?.length) {
    body += `#### 👍 Điểm tốt\n\n`;
    for (const p of review.praise) body += `- ${p}\n`;
    body += "\n";
  }
  body += `---\n<sub>Reviewed by \`${MODEL}\` · <a href="#">via CI</a></sub>`;
  return body;
}

async function postIssueComment(body) {
  const url = `https://api.github.com/repos/${PR_REPO}/issues/${PR_NUMBER}/comments`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${TOKEN}`,
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ body }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to post comment: ${res.status} ${text.slice(0, 300)}`);
  }
  return res.json();
}

async function postReviewWithInline(review) {
  // Each inline comment needs a valid line in the PR's diff position.
  // We only post inline comments the API accepts; the rest go in the summary body.
  const validComments = [];
  for (const f of review.findings || []) {
    if (!f.path || !Number.isInteger(f.line)) continue;
    validComments.push({
      path: f.path,
      line: f.line,
      side: "RIGHT",
      body: `**${f.severity.toUpperCase()} — ${f.title}**\n\n${f.comment}`,
    });
  }
  if (!validComments.length) return null;
  const url = `https://api.github.com/repos/${PR_REPO}/pulls/${PR_NUMBER}/reviews`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${TOKEN}`,
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event: "COMMENT",
      body: buildReviewBody({ ...review, findings: [] }), // summary only
      comments: validComments,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    log("Inline review failed, falling back to issue comment:", res.status, text.slice(0, 200));
    return null;
  }
  return res.json();
}

async function main() {
  if (!BASE_URL || !API_KEY) {
    log("Missing OLLAMA_BASE_URL or OLLAMA_API_KEY");
    exit(1);
  }
  if (!PR_NUMBER || !PR_REPO) {
    log("Missing PR_NUMBER or PR_REPO");
    exit(1);
  }

  const diff = await readFile(DIFF_PATH, "utf8").catch(() => "");
  if (!diff.trim()) {
    log("Empty diff, nothing to review");
    return;
  }
  log(`Model: ${MODEL}`);
  log(`Diff size: ${diff.length} chars, files summary:\n${summarizeDiff(diff)}`);

  const prompt = buildPrompt(diff);
  const raw = await callOllama(prompt);
  const review = tryParseJson(raw);
  log(`Review parsed. risk=${review.risk} findings=${review.findings?.length || 0}`);

  const body = buildReviewBody(review);
  await writeFile(OUT_PATH, body, "utf8");
  log(`Wrote review to ${OUT_PATH}`);

  if (DRY_RUN) {
    log("--dry-run: skipping GitHub post");
    return;
  }
  if (!TOKEN) {
    log("No GITHUB_TOKEN, skipping post");
    return;
  }

  const inline = await postReviewWithInline(review);
  if (!inline) {
    await postIssueComment(body);
    log("Posted summary as issue comment");
  } else {
    log(`Posted review with ${inline.body?.length} inline comments`);
  }
}

main().catch((e) => {
  console.error("[ollama-review] FAILED:", e);
  exit(1);
});

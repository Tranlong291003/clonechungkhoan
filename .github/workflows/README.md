# 🤖 Ollama PR Review

Tự động review Pull Request bằng **Ollama** (qua OpenAI-compatible API tunnel) thay vì GitHub Copilot code review. Mỗi khi có PR mới/update, bot sẽ:

1. Lấy diff của PR
2. Gửi cho model `ollama/minimax-m3` kèm prompt review
3. Đăng 1 **review comment** trên PR (kèm inline comments nếu model trỏ đúng dòng)

---

## 🔐 Cấu hình Secrets (Settings → Secrets and variables → Actions)

| Secret | Bắt buộc | Giá trị mẫu |
|---|---|---|
| `OLLAMA_BASE_URL` | ✅ | `https://r4l626d.abc-tunnel.us/v1` |
| `OLLAMA_API_KEY` | ✅ | `sk-73fc943c07438cb0-...` |
| `OLLAMA_MODEL` | ⬜ (mặc định `ollama/minimax-m3`) | `ollama/minimax-m3` |
| `GITHUB_TOKEN` | ✅ | Tự động cấp bởi GitHub Actions (mặc định) |

> Quyền của `GITHUB_TOKEN` đã được khai báo trong workflow:
> - `contents: read`
> - `pull-requests: write` (để post review)
> - `checks: write` (để tạo status check)

---

## 📁 Files đã thêm

- **`.github/workflows/ollama-pr-review.yml`** — workflow trigger khi PR open/sync/reopen/ready_for_review
- **`scripts/ollama-review.mjs`** — Node script gọi Ollama API, parse JSON, post review
- **`scripts/fixtures/sample.diff`** — diff mẫu để test
- **`scripts/.gitignore`** — bỏ qua artifact tạm

---

## 🧪 Test local

```bash
# 1. Set biến môi trường
export OLLAMA_BASE_URL="https://r4l626d.abc-tunnel.us/v1"
export OLLAMA_API_KEY="sk-..."
export OLLAMA_MODEL="ollama/minimax-m3"
export PR_NUMBER="1"
export PR_REPO="Tranlong291003/clonechungkhoan"
export PR_TITLE="Test"
export PR_AUTHOR="me"

# 2. Đặt diff test vào pr.diff (hoặc dùng flag --diff=...)
cp scripts/fixtures/sample.diff pr.diff

# 3. Chạy dry-run
node scripts/ollama-review.mjs --dry-run
# → sinh review-output.md, không post lên GitHub
```

Nếu thấy `Review parsed. risk=medium findings=N` → API hoạt động ổn.

---

## 🚀 Kích hoạt

Workflow đã tự động chạy khi:
- Mở PR mới
- Push thêm commit vào PR
- Reopen hoặc đánh dấu ready_for_review

Nếu muốn chạy tay: **Actions → Ollama PR Review → Run workflow** → nhập `pr_number`.

---

## 📋 Format output

Model được ép trả JSON nghiêm ngặt:

```json
{
  "summary": "Tóm tắt 2-4 câu tiếng Việt",
  "risk": "low | medium | high",
  "findings": [
    {
      "path": "src/foo.ts",
      "line": 42,
      "severity": "info | warning | blocking",
      "title": "Tiêu đề ngắn",
      "comment": "Markdown giải thích"
    }
  ],
  "praise": ["Điểm tốt 1", "Điểm tốt 2"]
}
```

Bot sẽ:
- **Inline comments** được post cho mỗi finding có `line` tồn tại trong diff
- **Summary comment** post riêng nếu inline review fail
- Không spam nếu không có finding đáng kể

---

## 🛠️ Tùy chỉnh

- **Đổi model**: sửa secret `OLLAMA_MODEL` (không cần push code)
- **Tăng/giảm findings tối đa**: sửa rule trong prompt của `ollama-review.mjs` dòng `Keep total findings <= 10`
- **Tắt review cho PR draft**: workflow đã skip khi PR là draft (GitHub mặc định không trigger)
- **Đổi ngôn ngữ review**: sửa system prompt trong `scripts/ollama-review.mjs`

---

## ❓ Troubleshooting

| Vấn đề | Nguyên nhân | Fix |
|---|---|---|
| `Empty diff` | Workflow không tìm thấy `pr.diff` | Kiểm tra step "Fetch PR diff" |
| `Ollama API 401` | Sai API key | Cập nhật secret `OLLAMA_API_KEY` |
| `Model response is not valid JSON` | Model output thêm text ngoài JSON | Xem lại prompt, model có thể cần `response_format: { type: "json_object" }` (đã bật) |
| Comment không xuất hiện | `GITHUB_TOKEN` thiếu `pull-requests: write` | Đã khai báo trong workflow |
| Inline comments fail | Model trỏ sai line | Bot tự động fallback sang summary comment |

---

## 📝 License

Nội bộ.

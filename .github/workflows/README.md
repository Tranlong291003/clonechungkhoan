# 🤖 Ollama PR Review

Tự động review Pull Request bằng **Ollama** (qua OpenAI-compatible API tunnel) thay vì GitHub Copilot code review. Mỗi khi có PR mới/update, bot sẽ:

1. Lấy diff của PR
2. Gửi cho model `ollama/minimax-m3` kèm prompt review
3. Submit một **PR review** (không phải issue comment) → bot tự động xuất hiện trong **Reviewers** với nút **"Re-request review"** giống Copilot

Bot đăng nhập qua **GitHub App** riêng (`Ollama PR Review`) thay vì `github-actions[bot]`, nên:
- Avatar/tên hiển thị đúng brand
- Review không bị gộp vào activity của user tạo workflow
- Có thể xin quyền riêng (chỉ `Pull requests: write`)

---

## 🔐 Cấu hình Secrets (Settings → Secrets and variables → Actions)

| Secret | Bắt buộc | Mô tả |
|---|---|---|
| `OLLAMA_BASE_URL` | ✅ | `https://r4l626d.abc-tunnel.us/v1` |
| `OLLAMA_API_KEY` | ✅ | API key của tunnel |
| `OLLAMA_MODEL` | ⬜ | Mặc định `ollama/minimax-m3` |
| `OLLAMA_APP_CLIENT_ID` | ✅ | App Client ID (vd: `4274454`) |
| `OLLAMA_APP_PRIVATE_KEY` | ✅ | Nội dung file `.pem` (PKCS#8) khi tạo App |

> `GITHUB_TOKEN` mặc định **không** dùng để post review nữa — token của GitHub App được tạo runtime bằng `actions/create-github-app-token@v1`.

### 🛠️ Setup GitHub App (1 lần)

1. Vào https://github.com/settings/apps/new
2. **GitHub App name**: `Ollama PR Review` (hoặc tên bạn thích)
3. **Homepage URL**: trang repo của bạn
4. Bỏ chọn **Active** ở Webhook (không cần)
5. **Repository permissions**:
   - `Contents`: Read-only
   - `Pull requests`: Read & Write
   - `Metadata`: Read-only (mặc định)
6. Sau khi tạo:
   - Copy **App ID** → secret `OLLAMA_APP_ID`
   - **Generate a private key** → download `.pem` → paste nội dung vào secret `OLLAMA_APP_PRIVATE_KEY`
   - Vào **Install App** → cài vào repo

> **Quan trọng**: nếu secrets chưa có, workflow sẽ fail với `Missing OLLAMA_BASE_URL or OLLAMA_API_KEY`. Cần add secrets **trước khi merge** (hoặc trước khi re-run CI).

---

## 📁 Files đã thêm

- **`.github/workflows/ollama-pr-review.yml`** — workflow trigger khi PR open/sync/reopen/ready_for_review
- **`scripts/ollama-review.mjs`** — Node script gọi Ollama API, parse JSON, post review
- **`scripts/fixtures/sample.diff`** — diff mẫu để test
- **`scripts/.gitignore`** — bỏ qua artifact tạm

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

## 🚀 Cách hoạt động

Workflow tự động chạy khi:
- **Mở PR mới** (auto)
- **Push thêm commit** vào PR (auto)
- **Reopen** hoặc **ready_for_review** (auto)
- **Comment chứa `@ollama-review re-run`** hoặc `re-request review` (manual)
- **Actions → Run workflow** với `pr_number` (manual từ UI)

### 🤖 Bot làm gì?

Mỗi lần review, bot sẽ:
1. Lấy diff của PR
2. Gọi Ollama API để sinh review (JSON nghiêm ngặt)
3. **Submit một PR Review** (không phải issue comment) → bot tự động xuất hiện trong **Reviewers** với nút **"Re-request review"** giống Copilot
4. Chọn `event` thông minh:
   - Có `blocking` finding → `REQUEST_CHANGES`
   - Không có → `COMMENT` (bot **không tự approve** để giữ human-in-the-loop)
5. Inline comments tại đúng dòng trong diff

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

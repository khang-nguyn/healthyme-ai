# HealthyMe AI - Health Care Report Dashboard

Frontend app de nhap thong tin benh nhan, goi LLM API de tao health report, va hien thi ket qua bang table + charts + timeline.

## 1) Tech Stack

- React 19 + TypeScript
- Vite 8
- Redux Toolkit + React Redux
- Ant Design + Ant Design Charts
- Fetch API (wrapper in src/services/api.ts)
- ESLint

## 2) Yeu cau moi truong

- Node.js >= 20
- npm >= 10

Kiem tra version:

```bash
node -v
npm -v
```

## 3) Setup env

Tao file `.env` tai root project:

```env
VITE_LLM_API_URL=http://localhost:3000/api/llm
VITE_LLM_API_KEY=your_base_llm_api_key
VITE_OPENAI_API_URL=https://api.openai.com/v1/chat/completions
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_OPENAI_MODEL=gpt-4o-mini
VITE_GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/models
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_GEMINI_MODEL=gemini-2.0-flash
```

Ghi chu:

- `VITE_LLM_*` dung cho service generic trong [src/services/llmService/llmService.ts](src/services/llmService/llmService.ts).
- `VITE_OPENAI_*` dung cho [src/services/llmService/openaiService.ts](src/services/llmService/openaiService.ts), goi truc tiep OpenAI API server.
- `VITE_GEMINI_*` dung cho [src/services/llmService/geminiService.ts](src/services/llmService/geminiService.ts), goi truc tiep Gemini API server.

## 4) Cach chay project

### Cai dependency

```bash
npm install
```

### Chay local

```bash
npm run dev
```

Mac dinh app chay o dia chi hien trong terminal (thuong la `http://localhost:5173`).

### Build production

```bash
npm run build
```

### Preview ban build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## 5) Data Flow chinh

1. User submit form tai FormPage.
2. Form dispatch thunk `generateHealthReport`.
3. Thunk goi API qua `llmService` va parse JSON.
4. Reducer luu vao Redux state:
   - `loading`
   - `reportData`
   - `error`
5. ReportPage lay data tu Redux, sanitize/transform va render Summary/Table/Charts/Timeline.

## 6) Clean Code convention

- Tach layer ro rang:
  - `services`: API call, parse response
  - `store`: state management (slice, thunk, selector)
  - `pages`: page-level layout va flow
  - `components`: UI blocks co the tai su dung
  - `types`: TypeScript interfaces
  - `utils`: transform/sanitize data
- Truoc khi render chart, luon transform data ve dung format (`label/value`, `x/y`).
- Luon co fallback cho null/undefined de tranh crash UI.
- Khong hardcode secret trong source code. Dung `.env`.
- Chay `npm run lint` va `npm run build` truoc khi push.

## 7) Cau truc thu muc (rut gon)

```text
src/
  components/
  pages/
  services/
  store/
  types/
  utils/
```

## 8) Push len GitHub

Neu repo chua co remote:

```bash
git init
git add .
git commit -m "feat: health report app with redux and llm flow"
git branch -M main
git remote add origin https://github.com/<your-user>/<your-repo>.git
git push -u origin main
```

Neu da co remote:

```bash
git add .
git commit -m "docs: update README with run/env/stack/clean-code guide"
git push
```

## 9) Ghi chu van hanh

- Neu goi truc tiep Gemini API tu frontend, can cau hinh CORS phu hop o phia API va bao mat API key.
- Neu API fail hoac JSON invalid, app se hien error state va khong crash.

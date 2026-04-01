# HealthyMe AI - Health Care Report Dashboard

HealthyMe AI is a frontend dashboard for collecting patient input, generating an LLM-based health report, and visualizing results with tables, charts, and timeline blocks.

## 1) Tech Stack

- React 19 + TypeScript
- Vite 8
- Redux Toolkit + React Redux
- Ant Design + Ant Design Charts
- Fetch API (shared wrapper in [src/services/api.ts](src/services/api.ts))
- ESLint

## 2) Requirements

- Node.js >= 20
- npm >= 10

Check installed versions:

```bash
node -v
npm -v
```

## 3) Environment Setup

Create a `.env` file in the project root:

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

Variable usage:

- `VITE_LLM_*`: generic LLM service in [src/services/llmService/llmService.ts](src/services/llmService/llmService.ts)
- `VITE_OPENAI_*`: OpenAI service in [src/services/llmService/openaiService.ts](src/services/llmService/openaiService.ts)
- `VITE_GEMINI_*`: Gemini service in [src/services/llmService/geminiService.ts](src/services/llmService/geminiService.ts)

If you need an API key, contact: **khangdev2813@gmail.com**

## 4) Run the Project

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Lint:

```bash
npm run lint
```

## 5) Main Data Flow

1. User submits the form on `FormPage`.
2. The app dispatches `generateHealthReport` thunk.
3. The thunk calls an LLM service and parses JSON output.
4. Redux stores result states: `loading`, `reportData`, `error`.
5. `ReportPage` reads state, sanitizes/transforms data, and renders Summary/Table/Charts/Timeline.

## 6) Code Conventions

- Keep layers separated:
  - `services`: API calls and response parsing
  - `store`: Redux slices/thunks/selectors
  - `pages`: page-level flow and composition
  - `components`: reusable UI blocks
  - `types`: TypeScript contracts
  - `utils`: sanitization and data transform logic
- Always transform chart data to expected shape before rendering.
- Always provide null/undefined fallbacks to avoid UI crashes.
- Never hardcode secrets; use `.env`.
- Run `npm run lint` and `npm run build` before pushing changes.

## 7) Project Structure (Simplified)

```text
src/
  components/
  pages/
  services/
  store/
  types/
  utils/
```

## 8) Git Push Guide

If no remote exists yet:

```bash
git init
git add .
git commit -m "feat: health report app with redux and llm flow"
git branch -M main
git remote add origin https://github.com/<your-user>/<your-repo>.git
git push -u origin main
```

If remote is already configured:

```bash
git add .
git commit -m "docs: rewrite README in English"
git push
```

## 9) Operational Notes

- If calling Gemini directly from frontend, ensure proper CORS and API key protection.
- If API fails or returns invalid JSON, the app shows an error state instead of crashing.

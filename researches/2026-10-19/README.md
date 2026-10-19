# 2026-10-19

브리핑: `researches/2026-10-19-ai-web-dev-briefing.md` (Obsidian)

## 01-claude-haiku-5-5
`claude-haiku-5-5` + `browser_toolset_20260801` raw 툴 루프. 모델이 보낸 `navigate`/`screenshot`/`left_click`/`type` tool_use를 Playwright로 실행해 tool_result로 돌려준다. `output_config.effort: "low"`, 허용 도메인(`example.com`) 제한 포함.

```bash
npx playwright install chromium
pnpm example researches/2026-10-19/01-claude-haiku-5-5/browser-loop.ts   # ANTHROPIC_API_KEY 필요
```

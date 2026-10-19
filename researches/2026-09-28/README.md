# 2026-09-28 — GPT-6 Sol/Luna · Vercel Sandbox Drives · Transformers.js v4

원문: Obsidian `researches/2026-09-28-ai-web-dev-briefing.md` / Notion "AI Web Dev Researches" DB

## 오늘 다룬 3가지

1. **GPT-6 Sol & Luna** (`01-gpt6-sol-luna/`) — OpenAI가 9/22 출시한 저가 reasoning+vision 모델. effort를 바꿔도 캐시가 깨지지 않는 특성을 이용해 Luna(low)→Sol(high)로 세션을 승격시키는 예제.
2. **Vercel Sandbox Drives** (`02-vercel-sandbox-drives/`) — 세션 사이에 파일을 영속시키는 Vercel Sandbox의 새 기능. 의존성 캐시를 드라이브에 한 번만 쓰고 이후 샌드박스는 재설치 없이 읽기만 하는 예제.
3. **Transformers.js v4** (`03-transformersjs-v4/`) — WebGPU 런타임을 새로 짠 브라우저/Node 겸용 온디바이스 추론 라이브러리. 로컬 임베딩으로 미니 시맨틱 검색을 만드는 예제.

## 실행 전 체크리스트

- [ ] `pnpm install` (루트에서 한 번)
- [ ] `.env`에 필요한 키 채우기 (`01`은 `OPENAI_API_KEY`, `02`는 `VERCEL_TOKEN` 등, `03`은 키 불필요 — 완전 로컬 실행)
- [ ] 각 폴더의 코드 상단 주석에 적힌 "실습 핵심"을 먼저 읽고 무엇을 확인하려는 실습인지 파악
- [ ] 실행 결과(성공/실패, 관찰한 값)를 이 README 하단 "실행 기록"에 남기기

## 실행 기록

<!-- 실제로 돌려본 뒤 여기에 날짜/결과/특이사항을 기록해주세요.
예: 2026-09-29 @ianhsyoo — 01번 실행, cached_tokens 정상 확인. 02번은 Vercel 계정 권한 이슈로 보류.
-->

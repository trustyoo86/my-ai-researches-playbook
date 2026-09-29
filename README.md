# my-ai-researches-playbook

매일 자동으로 작성되는 "AI Web Dev Briefing"에서 소개하는 코드 예제를 실제로 실행하고 검증해보기 위한 플레이그라운드 저장소입니다.

브리핑은 Obsidian(`researches/{YYYY-MM-DD}-ai-web-dev-briefing.md`)과 Notion "AI Web Dev Researches" DB에 텍스트로 먼저 쌓이고, 그중 실제로 손으로 돌려볼 만한 코드는 이 저장소의 `researches/{YYYY-MM-DD}/`에 옮겨져 브랜치·PR로 관리됩니다.

## 구조

```
researches/
  2026-09-28/
    README.md                 # 그날 브리핑 요약 + 각 예제 설명/실행 방법
    01-<주제-슬러그>/
      *.ts                    # 미니 실습 코드 (브리핑 원문 코드를 그대로 또는 실행 가능하게 다듬은 버전)
    02-<주제-슬러그>/
      ...
```

- 폴더 번호(`01-`, `02-`...)는 그날 브리핑에서 다룬 주제 순서와 동일합니다.
- 각 예제는 독립적으로 실행 가능한 것을 원칙으로 하되, 필요한 API 키는 `.env`에 채워야 합니다(`.env.example` 참고).

## 워크플로

1. 매일 아침 "AI 웹 개발 데일리 브리핑" 자동화가 그날의 기술 브리핑을 작성하고 Obsidian/Notion에 저장합니다.
2. 브리핑에 포함된 실습 코드 중 이 저장소에 남길 만한 것을, `main`에서 분기한 `researches/{YYYY-MM-DD}` 브랜치에 추가합니다.
3. 해당 브랜치에서 `main`으로 Pull Request를 엽니다. PR 설명에는 그날 브리핑 링크(Notion/Obsidian)와 각 예제가 무엇을 검증하는지 요약이 들어갑니다.
4. 실제로 돌려보고 문제가 없으면 머지합니다 — 머지 전 리뷰/수정 지점으로 PR을 활용합니다.

## 실행 방법

```bash
pnpm install   # 또는 npm install / yarn install
cp .env.example .env   # 실제 키 채우기

# 예: 2026-09-28의 첫 번째 예제 실행
pnpm example researches/2026-09-28/01-gpt6-sol-luna/escalate-effort.ts
```

`example` 스크립트는 [`tsx`](https://github.com/privatenumber/tsx)로 TypeScript 파일을 바로 실행합니다.

## 주의

- 예제 코드는 브리핑 시점(리서치 당일)의 공식 문서·발표를 기반으로 작성된 것이라, 이후 API가 바뀌면 그대로 동작하지 않을 수 있습니다. 실패하면 먼저 공식 문서 변경 여부를 확인하세요.
- Vercel Sandbox, Gemini, OpenAI 등 실제 과금이 발생하는 API가 포함되어 있습니다. 실행 전 가격 정책을 확인하세요.

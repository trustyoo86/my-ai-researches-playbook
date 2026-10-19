/**
 * escalate-effort.ts
 *
 * 브리핑: 2026-09-28 — "GPT-6 Sol & Luna"
 *
 * 같은 대화를 Luna(low effort)로 시작해 Sol(high effort)로 승격시키면서,
 * reasoning effort/모델을 바꿔도 프롬프트 캐시(cached_tokens)가 유지되는지 관찰합니다.
 *
 * 실행:
 *   OPENAI_API_KEY=sk-... pnpm example researches/2026-09-28/01-gpt6-sol-luna/escalate-effort.ts
 *
 * 실습 핵심: 2턴 호출에서 cached_tokens가 0이 아닌지 확인하는 것.
 * 시간이 남으면 Luna만으로 effort를 low→max까지 단계별로 올려가며
 * "모델은 고정 + effort만 변경"과 "모델까지 변경"의 캐시 재사용률 차이를 비교해보세요.
 */
import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI();

const SYSTEM = "너는 친절한 프론트엔드 코드 리뷰어다. 항상 한국어로 답한다.";

type Effort = "low" | "high";

async function ask(model: string, effort: Effort, previousResponseId?: string) {
  const response = await client.responses.create({
    model,
    reasoning: { effort },
    previous_response_id: previousResponseId,
    input: previousResponseId
      ? "그럼 이 컴포넌트에 memo를 적용하는 게 맞을지도 같이 판단해줘."
      : `${SYSTEM}\n\n다음 React 컴포넌트를 리뷰해줘:\n\nfunction UserCard({ user }) {\n  return <div>{user.name} - {user.email}</div>;\n}`,
  });

  const cached = response.usage?.input_tokens_details?.cached_tokens ?? 0;
  const total = response.usage?.input_tokens ?? 0;
  console.log(`[${model} / effort=${effort}] cached=${cached} total_input=${total}`);

  return response.id;
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY가 설정되어 있지 않습니다. .env를 확인하세요.");
    process.exit(1);
  }

  const firstId = await ask("gpt-6-luna", "low");
  await ask("gpt-6-sol", "high", firstId);
}

main().catch((err) => {
  console.error("실행 실패:", err);
  process.exit(1);
});

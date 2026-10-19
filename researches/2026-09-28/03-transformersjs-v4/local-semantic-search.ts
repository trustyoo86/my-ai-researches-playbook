/**
 * local-semantic-search.ts
 *
 * 브리핑: 2026-09-28 — "Transformers.js v4"
 *
 * 서버 API 호출 없이 로컬(Node 또는 브라우저)에서 문장 임베딩을 만들고
 * 코사인 유사도로 미니 시맨틱 검색을 해봅니다. API 키가 필요 없습니다.
 *
 * 실행:
 *   pnpm example researches/2026-09-28/03-transformersjs-v4/local-semantic-search.ts
 */
import { pipeline, cos_sim } from "@huggingface/transformers";

const DOCS = [
  "Next.js App Router는 서버 컴포넌트를 기본값으로 사용한다.",
  "WebGPU는 브라우저에서 GPU 가속 연산을 가능하게 하는 API다.",
  "프롬프트 캐싱은 반복되는 시스템 프롬프트의 비용을 크게 줄여준다.",
  "React의 useEffect는 렌더링 이후 부수 효과를 실행하기 위한 훅이다.",
];

async function main() {
  const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", {
    device: "webgpu",
  });

  const docEmbeddings = await Promise.all(
    DOCS.map(async (doc) => {
      const output = await extractor(doc, { pooling: "mean", normalize: true });
      return { doc, vector: Array.from(output.data as Float32Array) };
    }),
  );

  async function search(query: string, topK = 2) {
    const queryOutput = await extractor(query, { pooling: "mean", normalize: true });
    const queryVector = Array.from(queryOutput.data as Float32Array);

    return docEmbeddings
      .map(({ doc, vector }) => ({ doc, score: cos_sim(queryVector, vector) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  const results = await search("GPU로 브라우저에서 연산하는 방법");
  console.log(results);
}

main().catch((err) => {
  console.error("실행 실패:", err);
  process.exit(1);
});

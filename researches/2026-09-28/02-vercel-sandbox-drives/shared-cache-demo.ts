/**
 * shared-cache-demo.ts
 *
 * 브리핑: 2026-09-28 — "Vercel Sandbox Drives"
 *
 * 의존성 캐시를 Drive에 한 번만 쓰고, 두 번째 샌드박스는 같은 드라이브를
 * 읽기 전용 스냅샷으로 마운트해 재설치 없이 뜨는지 확인합니다.
 *
 * 실행:
 *   VERCEL_TOKEN=... pnpm example researches/2026-09-28/02-vercel-sandbox-drives/shared-cache-demo.ts
 *
 * 실습 핵심: console.time으로 찍은 두 설치 시간을 비교해
 * 두 번째 실행이 실제로 눈에 띄게 빨라지는지 확인하는 것.
 */
import "dotenv/config";
import { Sandbox, Drive } from "@vercel/sandbox";

async function main() {
  const cache = await Drive.getOrCreate({ name: "blog-demo-deps" });

  console.time("first install");
  const writer = await Sandbox.create({ mounts: { "/cache": cache } });
  await writer.runCommand("pnpm", [
    "install",
    "--store-dir",
    "/cache/pnpm-store",
    "--prefix",
    "/tmp/demo-app",
  ]);
  console.timeEnd("first install");
  await writer.stop();

  console.time("second install (cached)");
  const reader = await Sandbox.create({ mounts: { "/cache": cache.snapshot() } });
  await reader.runCommand("pnpm", [
    "install",
    "--store-dir",
    "/cache/pnpm-store",
    "--prefix",
    "/tmp/demo-app",
  ]);
  console.timeEnd("second install (cached)");
  await reader.stop();
}

main().catch((err) => {
  console.error("실행 실패:", err);
  process.exit(1);
});

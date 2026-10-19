// Haiku 5.5 + browser_toolset_20260801 raw 툴 루프.
// 브라우저는 Anthropic이 실행해주지 않는다 — tool_use를 받으면 Playwright로 직접 실행하고 tool_result로 돌려준다.
import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { chromium, type Page } from "playwright";

const client = new Anthropic();
const MODEL = "claude-haiku-5-5";
const ALLOWED_HOSTS = ["example.com"]; // url_policy 대용: 허용 도메인만 navigate

async function run(page: Page, name: string, input: any) {
  let text: string;
  if (name === "navigate") {
    const url = new URL(/^https?:/.test(input.url) ? input.url : `https://${input.url}`);
    if (!ALLOWED_HOSTS.includes(url.hostname)) return [{ type: "text" as const, text: `거부: ${url.hostname}` }];
    await page.goto(url.href);
    text = `Navigated ${page.url()}`;
  } else if (name === "screenshot") {
    const png = await page.screenshot({ type: "png" });
    return [{ type: "image" as const, source: { type: "base64" as const, media_type: "image/png" as const, data: png.toString("base64") } }];
  } else if (name === "get_page_text" || name === "read_page") {
    text = (await page.innerText("body")).slice(0, 4000);
  } else if (name === "left_click" && input.target?.type === "coordinate") {
    await page.mouse.click(input.target.x, input.target.y);
    text = "Clicked.";
  } else if (name === "type") {
    await page.keyboard.type(input.text);
    text = "Typed.";
  } else {
    text = `(미구현 액션: ${name})`; // ponytail: 31개 중 5개만 구현, 필요할 때 추가
  }
  return [
    { type: "text" as const, text },
    { type: "browser_state" as const, tabs: [{ tab_id: "tab-1", title: await page.title(), url: page.url(), active: true }] },
  ];
}

const browser = await chromium.launch();
const page = await browser.newPage();
const messages: Anthropic.MessageParam[] = [
  { role: "user", content: "example.com을 열어서 메인 제목이 뭔지 알려줘." },
];

for (let turn = 0; turn < 10; turn++) { // 무한 루프 방지
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    tools: [{ type: "browser_toolset_20260801" }],
    output_config: { effort: "low" }, // 싸고 빠르게
    messages,
  });
  messages.push({ role: "assistant", content: res.content });
  if (res.stop_reason !== "tool_use") {
    console.log(res.content.filter((b) => b.type === "text").map((b: any) => b.text).join("\n"));
    console.log("usage:", res.usage);
    break;
  }
  const results: any[] = [];
  for (const b of res.content) {
    if (b.type !== "tool_use") continue;
    results.push({
      type: "tool_result",
      tool_use_id: b.id,
      toolset_name: (b as any).toolset_name,
      content: await run(page, b.name, b.input),
    });
  }
  messages.push({ role: "user", content: results });
}
await browser.close();

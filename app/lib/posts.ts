/**
 * 内容站数据层（W2 流式渲染演示用）
 *
 * 为什么用本地 mock 数据而不是真实 API？
 * 1. 中文友好：JSONPlaceholder 返回的是英文 lorem 文案，本地数据可以做真正的中文内容站
 * 2. 流式演示可控：人为制造不同长度的延迟，让 Suspense 的"渐进渲染"肉眼可见
 *    （快的数据 0.8s 到达先渲染，慢的数据 2.5s 到达后"流入"页面）
 * 3. 构建不依赖外网：断网环境 build/dev 都能正常跑
 */

/** 文章类型定义：TS 类型即文档，调用方有完整类型提示 */
export type Post = {
  id: number;
  title: string;
  summary: string; // 列表页摘要
  body: string[]; // 详情页正文（按段落拆分，渲染更真实）
  tags: string[];
  author: string;
  publishDate: string; // ISO 日期字符串
  readingMinutes: number; // 预计阅读时长（分钟）
};

/** 模拟数据库里的文章表（10 篇中文前端技术文章） */
const posts: Post[] = [
  {
    id: 1,
    title: "React Server Components：服务端组件到底解决了什么问题",
    summary:
      "从「组件为什么要在客户端跑」讲起，理解 RSC 把数据获取和渲染搬回服务端的本质动机。",
    body: [
      "传统 SPA 的问题：所有组件都在浏览器里执行，首屏需要先下载完整的 JS bundle，再执行取数，用户面对的是白屏等待。",
      "Server Components 在服务端执行，可以直接访问数据库和内网 API，渲染结果以序列化的 UI 树流式发给浏览器，不占用客户端 bundle 体积。",
      "关键边界：需要交互（useState / useEffect / 浏览器 API）的组件必须加 'use client'，其余组件默认就是 Server Component。",
      "在 Next.js App Router 中，page.tsx / layout.tsx 默认都是 Server Component，这和 Nuxt2 的 asyncData 心智非常接近。",
    ],
    tags: ["React", "RSC", "Next.js"],
    author: "前端学习者",
    publishDate: "2026-08-18",
    readingMinutes: 8,
  },
  {
    id: 2,
    title: "Suspense 与流式渲染：让页面像瀑布一样渐进出现",
    summary:
      "React 18 的 Suspense + Next.js 流式 SSR，可以把慢的部分先占位、快的内容先上屏。",
    body: [
      "传统 SSR 的痛点：服务器必须等所有数据取完才能返回第一个字节（TTFB 被最慢的接口拖累）。",
      "流式渲染的思路：先发送页面外壳（shell）和骨架屏，哪个数据块先就绪就把哪块 HTML「流」给浏览器。",
      "Suspense 的 fallback 就是这个占位的骨架屏，数据到达后 React 自动替换为真实内容。",
      "在 Next.js 里，除了手动 Suspense，还有路由级的 loading.tsx 约定文件，导航切换时自动展示。",
    ],
    tags: ["Suspense", "Streaming", "SSR"],
    author: "前端学习者",
    publishDate: "2026-08-19",
    readingMinutes: 6,
  },
  {
    id: 3,
    title: "Next.js 缓存全景：fetch 的 revalidate 与 no-store",
    summary:
      "一篇详情页同时玩转 SSG 预渲染、ISR 增量再生、SSR 实时渲染，说清三者的取舍。",
    body: [
      "SSG（静态生成）：构建时渲染成 HTML，访问最快，适合热门内容。用 generateStaticParams 声明要预渲染的参数。",
      "ISR（增量静态再生）：fetch 加 next: { revalidate: 60 }，静态页在后台按周期重新生成，兼顾性能和新鲜度。",
      "SSR（实时渲染）：fetch 加 cache: 'no-store'，每次请求都重新取数，适合强实时场景。",
      "本站详情页的策略：热门文章（id ≤ 5）走 SSG + ISR，冷门文章按需 SSR —— 同一个页面组件，两种渲染模式。",
    ],
    tags: ["缓存", "SSG", "ISR"],
    author: "前端学习者",
    publishDate: "2026-08-20",
    readingMinutes: 7,
  },
  {
    id: 4,
    title: "从 Nuxt2 到 Next.js：一份迁移者视角的对照笔记",
    summary:
      "pages 目录 vs app 目录、asyncData vs Server Components、nuxt.config vs next.config，逐项对照。",
    body: [
      "路由：Nuxt 的文件路由基于 pages/ 下的 .vue 文件；Next App Router 基于 app/ 下的文件夹约定（page.tsx / layout.tsx / loading.tsx）。",
      "取数：Nuxt2 的 asyncData / fetch 对应 Next 的 Server Component 里直接 async/await，组件本身就是数据层。",
      "布局：layouts/default.vue 对应 app/layout.tsx；嵌套布局 Next 用文件夹层级天然表达。",
      "中间件：Nuxt 的 router middleware 对应 Next 的 proxy.ts（旧名 middleware.ts，Next 16 已更名），都在请求进入页面前拦截。",
    ],
    tags: ["Nuxt", "迁移", "对照"],
    author: "前端学习者",
    publishDate: "2026-08-21",
    readingMinutes: 5,
  },
  {
    id: 5,
    title: "手写一个 Edge 兼容的 JWT：Web Crypto 实战",
    summary:
      "不用 jsonwebtoken 依赖，用 SubtleCrypto 实现 HS256 签名与校验，让鉴权代码能跑在 Edge Runtime。",
    body: [
      "为什么手写：jsonwebtoken 依赖 Node 内置模块，无法在 Edge Runtime（proxy.ts 运行环境）使用；SubtleCrypto 是跨运行时的标准 API。",
      "JWT 结构：header.payload.signature 三段 base64url，签名部分用 HMAC-SHA256 对前两段签名。",
      "校验要点：必须自己校验 exp 过期时间，签名比对要避免时序攻击（虽然 demo 里用简单比对演示）。",
      "落地方式：token 放进 httpOnly cookie，proxy.ts 每次请求读 cookie 校验，未登录重定向到登录页。",
    ],
    tags: ["JWT", "鉴权", "Edge"],
    author: "前端学习者",
    publishDate: "2026-08-22",
    readingMinutes: 9,
  },
  {
    id: 6,
    title: "error.tsx 与 not-found.tsx：给流式页面配上兜底 UI",
    summary:
      "路由级错误边界怎么接住渲染期异常，404 页面如何用 notFound() 主动触发。",
    body: [
      "error.tsx 必须是 Client Component（要用 reset 回调重试渲染），它会捕获子组件在渲染期的异常。",
      "根布局之外的每个路由段都可以有自己的 error.tsx，实现「局部出错、页面其他区域不受影响」。",
      "notFound() 函数：在 Server Component 里主动抛出 404，由最近的 not-found.tsx 接住渲染。",
      "注意：error.tsx 不接住布局自身的错误，布局的兜底要靠上一层 error.tsx 或 global-error.tsx。",
    ],
    tags: ["错误处理", "404", "边界"],
    author: "前端学习者",
    publishDate: "2026-08-23",
    readingMinutes: 4,
  },
  {
    id: 7,
    title: "next/image 与图片性能优化清单",
    summary:
      "自动 WebP/AVIF 转换、尺寸自适应、懒加载，一张图看懂 Next.js 的图片优化管线。",
    body: [
      "next/image 默认按需优化：服务端自动转码现代格式 + 按设备宽度生成多尺寸，避免移动端下载桌面大图。",
      "远程图片必须在 next.config.ts 的 images.remotePatterns 里显式声明域名，属于安全白名单机制。",
      "loading='lazy' 是默认行为，首屏关键图可加 priority 提升 LCP。",
      "对比原生 img：省流量、防布局抖动（需提供 width/height 占位）、CDN 友好。",
    ],
    tags: ["性能", "图片", "优化"],
    author: "前端学习者",
    publishDate: "2026-08-24",
    readingMinutes: 5,
  },
  {
    id: 8,
    title: "Server Action 实战：不用写 API 就能提交表单",
    summary:
      "form 的 action 直接指向服务端函数，登录、登出、增删改全在一个文件里搞定。",
    body: [
      "Server Action = 一个加了 'use server' 的异步函数，可以从 Server Component 的 form action 直接调用。",
      "执行环境在服务端：可以安全地操作数据库、读写 cookie，天然规避了「前端暴露接口」的问题。",
      "本站的登录就用它：校验表单 → 签发 JWT → 写入 httpOnly cookie → redirect，全程无需单独的 /api/login。",
      "配合 revalidatePath 可以在数据变更后精准刷新缓存，替代传统的手动重拉列表。",
    ],
    tags: ["Server Action", "表单", "全栈"],
    author: "前端学习者",
    publishDate: "2026-08-25",
    readingMinutes: 6,
  },
  {
    id: 9,
    title: "Edge Runtime vs Node Runtime：一张决策表",
    summary:
      "启动速度、API 支持、冷启动成本……什么场景把代码放到 Edge，什么场景必须留在 Node。",
    body: [
      "Edge Runtime：基于 Web 标准 API（fetch / SubtleCrypto / streams），启动极快，适合轻量拦截逻辑 —— proxy.ts 就跑在这里。",
      "Node Runtime：完整 Node API 和 npm 生态（文件系统、重型 SDK），适合真正的业务服务端逻辑。",
      "决策表：纯转发/鉴权/改 header → Edge；读写数据库、跑 ORM、调 Node 专有库 → Node。",
      "坑：Edge 环境不支持 Node 内置模块，所以 jsonwebtoken 这类依赖在 proxy.ts 里会直接报错。",
    ],
    tags: ["Edge", "Runtime", "架构"],
    author: "前端学习者",
    publishDate: "2026-08-26",
    readingMinutes: 7,
  },
  {
    id: 10,
    title: "作品集复盘：从跨端工程师到 AI 前端的三个月",
    summary:
      "W1 到 W12 的产出如何串成一条「跨端工程化 + AI 落地」的叙事线，写给未来的自己。",
    body: [
      "叙事主线不是「学了很多框架」，而是「用已有的跨端深度，补齐 React 服务端与 AI 集成两块拼图」。",
      "每个项目都要能一句话讲清价值：SSR 落地页证明服务端能力，流式内容站证明 RSC 深度，微前端证明架构掌控。",
      "AI 阶段的核心资产是「流式」：LLM 的 SSE 流式输出和本周学的 Suspense 流式渲染，在前端是同一套心智模型。",
      "投递策略：跨端架构岗求稳，AI 前端/FDE 岗冲溢价，不卷初级 CRUD。",
    ],
    tags: ["复盘", "职业", "AI"],
    author: "前端学习者",
    publishDate: "2026-08-27",
    readingMinutes: 8,
  },
];

/** 模拟网络延迟的小工具：真实项目里这个延迟来自外部 API 的响应时间 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 获取文章列表（快数据：0.8s 到达）
 * 列表是首屏主内容，故意给较短延迟，让骨架屏短暂出现后内容"流入"
 */
export async function getPosts(): Promise<Post[]> {
  await delay(800);
  return posts;
}

/**
 * 获取编辑推荐（慢数据：2.5s 到达）
 * 延迟故意拉长，用于演示「页面外壳先上屏，慢块渐进流入」的流式效果。
 * 打开 DevTools 的 Network 面板查看文档响应，能看到 HTML 是分块传输的。
 */
export async function getFeaturedPosts(): Promise<Post[]> {
  await delay(2500);
  // 「编辑推荐」= 阅读时长最长的 3 篇（随便选个规则，重点是演示慢加载）
  return [...posts].sort((a, b) => b.readingMinutes - a.readingMinutes).slice(0, 3);
}

/**
 * 按 id 获取单篇文章（详情页用，0.6s 延迟）
 * 返回 null 表示文章不存在，由调用方决定走 404 还是空态
 */
export async function getPostById(id: number): Promise<Post | null> {
  await delay(600);
  return posts.find((p) => p.id === id) ?? null;
}

/** 学习统计（dashboard 流式块用：1.5s 到达） */
export async function getStudyStats(): Promise<{
  postsRead: number;
  minutes: number;
  streakDays: number;
}> {
  await delay(1500);
  return { postsRead: posts.length, minutes: 65, streakDays: 7 };
}

/** 最近更新（dashboard 流式块用：3s 到达，最慢的一块，最后流入） */
export async function getRecentPosts(): Promise<Post[]> {
  await delay(3000);
  return [...posts]
    .sort((a, b) => (a.publishDate < b.publishDate ? 1 : -1))
    .slice(0, 4);
}

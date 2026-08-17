export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">关于</h1>
      <p className="mt-4 leading-8 text-zinc-600">
        这是一个用 Next.js 16（App Router）搭建的学习项目，对标已有的 Nuxt 2 SSR
        经验。目标是 3 个月内补齐 React 服务端 / AI 前端方向的能力。
      </p>
      <ul className="mt-6 list-disc space-y-2 pl-6 text-zinc-700">
        <li>App Router：文件夹即路由</li>
        <li>Server Components：服务端直接 async 取数</li>
        <li>Route Handlers：后续调大模型 API 的服务端入口</li>
      </ul>
    </div>
  );
}

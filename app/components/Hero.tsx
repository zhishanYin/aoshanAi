export default function Hero() {
  return (
    <section className="border-b border-zinc-200 bg-white">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-sm font-medium text-zinc-400">Next.js · App Router</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          跨端工程师的 React 服务端起点
        </h1>
        <p className="mt-6 text-lg leading-8 text-zinc-600">
          用 Nuxt2 SSR 的已有心智，平移到 Next.js。本周目标：一个能跑、能部署的
          SSR 落地页。
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="/list"
            className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          >
            看能力列表
          </a>
          <a
            href="/about"
            className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium transition-colors hover:border-zinc-900"
          >
            了解更多
          </a>
        </div>
      </div>
    </section>
  );
}

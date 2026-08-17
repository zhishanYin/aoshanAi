const features = [
  {
    title: "App Router",
    desc: "文件夹即路由，layout 嵌套布局，对标 Nuxt 的 pages + layouts。",
  },
  {
    title: "Server Components",
    desc: "服务端直接 async 取数，对标 Nuxt 的 asyncData / useFetch。",
  },
  {
    title: "Route Handlers",
    desc: "app/api 下写服务端接口，后续调大模型 API 的入口。",
  },
  {
    title: "SSR / SSG 一体",
    desc: "dynamic / generateStaticParams 灵活切换渲染策略。",
  },
];

export default function Features() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h2 className="text-2xl font-semibold tracking-tight">核心能力</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-zinc-200 bg-white p-6"
          >
            <h3 className="font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm leading-7 text-zinc-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

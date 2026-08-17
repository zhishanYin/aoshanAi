// 路由分组演示：(auth) 是一个 Route Group，不影响 URL —— 本页最终路径仍是 /login
// 对应 Nuxt 中没有直接对等概念，分组常用于按"布局/权限"组织文件而不污染路由
export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-sm px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">登录</h1>
      <p className="mt-2 text-sm text-zinc-500">
        这是 (auth) 路由分组下的页面，URL 依然是 /login。
      </p>
      <form className="mt-6 space-y-4">
        <input
          type="email"
          placeholder="邮箱"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
        />
        <input
          type="password"
          placeholder="密码"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
        />
        <button
          type="submit"
          className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
        >
          登录
        </button>
      </form>
    </div>
  );
}

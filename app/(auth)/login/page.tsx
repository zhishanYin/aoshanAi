import { login } from "../actions";

/**
 * 登录页 —— 配合 proxy.ts 完成鉴权闭环（W2 Day 4）
 *
 * 鉴权全链路：
 * 1. 访问 /dashboard → proxy.ts 发现没有有效 session → 302 到本页（带上 ?next=/dashboard）
 * 2. 在本页提交表单 → Server Action login() 校验并签发 JWT → 写入 httpOnly cookie
 * 3. redirect 回 /dashboard → proxy.ts 再次校验 → 通过 → 正常渲染
 *
 * 本页仍是 Server Component：
 * 表单的"提交"动作由服务端的 login 函数处理（渐进增强：JS 未加载也能提交）
 */
export default async function LoginPage({
  searchParams,
}: {
  // Next 15+：searchParams 也是 Promise
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-16">
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">登录内容站</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-500">
          demo 账号规则：任意邮箱 + 任意 6 位以上密码。
        </p>

        {/* 登录失败的错误提示：由 Server Action 重定向回来时通过 ?error=1 携带 */}
        {error && (
          <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            登录失败：请检查邮箱格式，密码至少 6 位。
          </div>
        )}

        {/* action 直接指向服务端函数：无需 onSubmit、无需 fetch（渐进增强表单） */}
        <form action={login} className="mt-6 space-y-4">
          {/* 隐藏字段：记住 proxy.ts 拦截时带过来的目标路径，登录后原路返回 */}
          <input type="hidden" name="next" value={next ?? "/dashboard"} />

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-zinc-700"
            >
              邮箱
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-zinc-700"
            >
              密码
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="至少 6 位"
              autoComplete="current-password"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 active:bg-zinc-800"
          >
            登录
          </button>
        </form>

        <p className="mt-5 text-center text-xs leading-5 text-zinc-400">
          登录成功后 token 以 httpOnly cookie 存储（有效期 7 天），
          <br />
          由 proxy.ts 在每次请求进入 /dashboard 前校验。
        </p>
      </div>
    </div>
  );
}

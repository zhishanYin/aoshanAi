import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifyToken } from "./app/lib/auth";

/**
 * Proxy —— 请求拦截器（W2 Day 4：中间件 & 鉴权前置）
 *
 * ⚠️ Next.js 16 重要变化：原来的 middleware.ts 已更名为 proxy.ts（middleware 写法已废弃）。
 * 两者的心智模型不变：在「请求进入页面渲染之前」执行，适合做鉴权、重定向、改 header。
 *
 * 运行环境：Edge Runtime
 * - 只支持 Web 标准 API（fetch / crypto.subtle / URL ...）
 * - 这就是为什么 lib/auth.ts 用 SubtleCrypto 手写 JWT 而不是 jsonwebtoken
 *   （后者依赖 Node 内置模块，在 Edge 里直接报错）
 *
 * 本文件的职责（鉴权前置三步）：
 * 1. 只拦截 /dashboard 开头的请求（matcher 配置，静态资源不经过这里）
 * 2. 读取 session cookie 并校验 JWT 签名 + 过期时间
 * 3. 无效 → 302 到 /login，并把目标路径带上（登录成功后跳回来）
 */
export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  // 校验 token：签名被篡改 / 过期 / 不存在 都视为未登录
  const session = token ? await verifyToken(token) : null;

  if (!session) {
    // 记住用户原本想去的页面，登录成功后原路返回（体验细节）
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 校验通过：把用户信息塞进 request header 传给后续的页面/接口
  // （proxy 与渲染代码不共享内存，header 是官方推荐的传值通道）
  // ⚠️ 坑：HTTP header 值只能是 ByteString（每字符 ≤ 255），
  // 中文名等非 ASCII 字符必须先 encodeURIComponent 编码，否则直接抛 TypeError
  const headers = new Headers(request.headers);
  headers.set("x-user-email", session.email);
  headers.set("x-user-name", encodeURIComponent(session.name));

  return NextResponse.next({ request: { headers } });
}

/**
 * matcher：只对 /dashboard 生效。
 * 不写 matcher 的话每个请求（包括 JS/CSS/图片）都会跑一遍鉴权，白白浪费 Edge 计算资源。
 */
export const config = {
  matcher: ["/dashboard/:path*"],
};

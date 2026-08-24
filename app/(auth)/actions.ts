"use server";

/**
 * 认证相关的 Server Actions（W2 Day 4）
 *
 * Server Action 是什么：加了 'use server' 的服务端函数，
 * 可以直接作为 <form action={...}> 的处理器 —— 表单提交后由服务端执行，
 * 全程不需要手写 /api/login 接口、不需要客户端 fetch。
 *
 * 安全要点：
 * 1. 密码校验、JWT 签发都在服务端完成，浏览器拿不到密钥
 * 2. token 写入 httpOnly cookie：JS 读不到，天然防 XSS 窃取
 * 3. redirect() 是 Next 提供的服务端重定向，会中断当前执行流
 */
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, signToken } from "../lib/auth";

/**
 * 登录 action
 * demo 规则：任意邮箱 + 密码 ≥ 6 位即登录成功（学习项目不做真实账号体系）
 */
export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  // 登录成功后要跳回的目标路径（由 proxy.ts 在拦截时带上）
  const next = String(formData.get("next") ?? "/dashboard");

  // ── 服务端校验：永远不要相信客户端提交的数据 ──
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk || password.length < 6) {
    // 校验失败：带 error 参数重定向回登录页（比抛异常对用户更友好）
    // redirect() 支持相对路径；next 参数原样带回，登录成功后仍能跳回目标页
    const query = new URLSearchParams({ error: "1" });
    if (next) query.set("next", next);
    redirect(`/login?${query.toString()}`);
  }

  // ── 签发 JWT 并写入 httpOnly cookie ──
  const name = email.split("@")[0]; // demo：取邮箱前缀当昵称
  const token = await signToken({ email, name });

  // Next 15+ cookies() 返回 Promise，需要 await；
  // 只有 Server Action / Route Handler 里才能写 cookie（页面组件里只读）
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true, // 禁止 JS 读取，防 XSS 窃取 token
    sameSite: "lax", // 防 CSRF 的基础配置
    path: "/", // 全站生效
    maxAge: 7 * 24 * 60 * 60, // 7 天，与 JWT exp 保持一致
  });

  // 登录成功：跳回原目标页（默认 /dashboard）
  redirect(next || "/dashboard");
}

/** 登出 action：清掉 cookie 即视为退出登录 */
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/login");
}

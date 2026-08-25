/**
 * 手写 JWT（HS256）鉴权工具 —— W2 Day 4 演示用
 *
 * 为什么不用 jsonwebtoken 库？
 * 1. proxy.ts（原 middleware.ts）运行在 Edge Runtime，只支持 Web 标准 API，
 *    jsonwebtoken 依赖 Node 内置模块（crypto），在 Edge 环境会直接报错。
 * 2. SubtleCrypto（Web Crypto API）在 Edge / Node / 浏览器三端都有实现，
 *    是跨运行时签名校验的正确选择 —— 这也是 W2「Edge vs Node Runtime」知识点的活教材。
 *
 * JWT 结构回顾：header.payload.signature
 * - header:  {"alg":"HS256","typ":"JWT"}
 * - payload: 自定义数据（这里是用户信息 + 过期时间）
 * - signature: base64url(header) + "." + base64url(payload) 的 HMAC-SHA256 签名
 */

/** 会话 cookie 的名字（proxy.ts 和 Server Action 都通过它存取 token） */
export const SESSION_COOKIE = "session";

/** 签名密钥：真实项目必须放环境变量（.env.local 的 AUTH_SECRET），这里给个开发兜底值 */
const SECRET = process.env.AUTH_SECRET ?? "dev-only-secret-do-not-use-in-prod";

/** payload 类型：谁登录了、什么时候过期 */
export type SessionPayload = {
  email: string;
  name: string;
  /** 过期时间戳（秒）。JWT 惯例用秒而不是毫秒 */
  exp: number;
};

/** 文本 → Uint8Array（SubtleCrypto 的输入要求） */
const encoder = new TextEncoder();

/** Uint8Array → base64url（JWT 规范使用 URL 安全的 base64：+ 变 -、/ 变 _、去掉 = 填充） */
function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  // 逐字节拼二进制字符串（避免大数组 spread 导致栈溢出）
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** base64url → 文本 */
function fromBase64Url(value: string): string {
  // 先把 base64url 还原成标准 base64（补回填充符），再 atob 解码
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64 + "=".repeat((4 - (base64.length % 4)) % 4));
  // 手动按 UTF-8 解码（atob 输出的是 latin1 字符串，直接用会有中文乱码问题）
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** 用 HMAC-SHA256 对任意字符串签名，返回 base64url 结果 */
async function hmacSign(data: string): Promise<string> {
  // 1. 导入密钥：raw bytes + 算法标识，usage 只授权 sign
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  // 2. 计算签名（返回 ArrayBuffer）
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return toBase64Url(new Uint8Array(signature));
}

/**
 * 签发 token：登录成功后调用
 * @param payload 用户信息（不含 exp，函数内部会补上 7 天有效期）
 */
export async function signToken(
  payload: Omit<SessionPayload, "exp">
): Promise<string> {
  const header = toBase64Url(encoder.encode(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  // 7 天后过期（单位统一成秒）
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
  const body = toBase64Url(
    encoder.encode(JSON.stringify({ ...payload, exp }))
  );
  const signature = await hmacSign(`${header}.${body}`);
  return `${header}.${body}.${signature}`;
}

/**
 * 校验 token：proxy.ts 每次请求都会调用
 * @returns 合法则返回 payload（含用户信息），非法/过期返回 null
 */
export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const [header, body, signature] = token.split(".");
    if (!header || !body || !signature) return null;

    // 1. 验签：用同样算法重算签名，必须与 token 里携带的一致
    const expected = await hmacSign(`${header}.${body}`);
    if (expected !== signature) return null;

    // 2. 验期：解析 payload，检查 exp 是否已过期
    const payload = JSON.parse(fromBase64Url(body)) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp * 1000 < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    // token 被篡改 / 格式错误都视为未登录，统一走 null 分支
    return null;
  }
}

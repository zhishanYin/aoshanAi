import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "./components/SiteFooter";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "a-react-next",
  description: "Next.js (App Router) 学习项目 · 对标 Nuxt2 SSR",
};

const nav = [
  { href: "/", label: "首页" },
  { href: "/list", label: "内容站" },
  { href: "/posts/1", label: "文章详情" },
  { href: "/live", label: "实时" },
  { href: "/about", label: "关于" },
  { href: "/dashboard", label: "控制台" },
  { href: "/search", label: "搜索" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900">
        <header className="border-b border-zinc-200 bg-white">
          <nav className="mx-auto flex max-w-3xl items-center gap-6 px-6 py-4 text-sm font-medium">
            <span className="font-semibold">a-react-next</span>
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-zinc-600 transition-colors hover:text-zinc-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="flex flex-1 flex-col">
          {children}
          <SiteFooter />
        </main>
      </body>
    </html>
  );
}

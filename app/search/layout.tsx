import type { ReactNode } from "react";
import styles from "./search.module.css";

export default async function SearchLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.wrapper}>
      {/* 搜索页专属的公共部分，例如标题栏 */}
      <header className={styles.header}>
        <h1 className={styles.title}>搜索</h1>
        <p className={styles.subtitle}>输入关键词，查找你感兴趣的内容</p>
      </header>
      {/* children 就是 search/page.tsx 的内容 */}
      <div className={styles.content}>{children}</div>
    </div>
  );
}

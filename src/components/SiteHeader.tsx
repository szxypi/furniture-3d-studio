import Link from 'next/link';
import styles from './SiteHeader.module.css';

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>
        3D 家具设计
      </Link>
      <nav aria-label="主导航" className={styles.nav}>
        <Link href="/">家具目录</Link>
        <Link href="/vanilla">原生 Three.js 示例</Link>
      </nav>
    </header>
  );
}

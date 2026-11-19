import Link from 'next/link';
import { CatalogPreview } from '@/components/CatalogPreview';
import { FURNITURE_CATALOG } from '@/lib/furniture/catalog';
import { formatPrice } from '@/lib/furniture/price';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>选一件家具，开始配置</h1>
      <p className={styles.lead}>
        每件家具都由基础几何体在浏览器里生成。进入配置器后，可以换材质、调颜色、改尺寸。
      </p>
      <ul className={styles.grid}>
        {FURNITURE_CATALOG.map((item) => (
          <li key={item.id}>
            <Link href={`/configurator/${item.id}`} className={styles.card}>
              <CatalogPreview item={item} />
              <h2 className={styles.name}>{item.name}</h2>
              <p className={styles.description}>{item.description}</p>
              <p className={styles.meta}>
                {item.defaults.width} × {item.defaults.depth} × {item.defaults.height} cm
                <span className={styles.price}>{formatPrice(item.basePrice)} 起（示例价格）</span>
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

'use client';

import dynamic from 'next/dynamic';
import type { FurnitureItem } from '@/lib/furniture/catalog';
import styles from './CatalogPreview.module.css';

const PreviewCanvas = dynamic(() => import('./PreviewCanvas'), {
  ssr: false,
  loading: () => <div className={styles.skeleton} aria-hidden="true" />,
});

interface CatalogPreviewProps {
  item: FurnitureItem;
}

/** 目录卡片里的实时 3D 预览。Canvas 只在浏览器端加载。 */
export function CatalogPreview({ item }: CatalogPreviewProps) {
  return (
    <div className={styles.frame} role="img" aria-label={`${item.name}的 3D 预览`}>
      <PreviewCanvas item={item} />
    </div>
  );
}

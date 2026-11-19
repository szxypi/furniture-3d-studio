'use client';

import dynamic from 'next/dynamic';
import styles from './VanillaViewer.module.css';

const VanillaViewer = dynamic(() => import('./VanillaViewer'), {
  ssr: false,
  loading: () => <div className={styles.viewer} aria-hidden="true" />,
});

export function VanillaLoader() {
  return <VanillaViewer />;
}

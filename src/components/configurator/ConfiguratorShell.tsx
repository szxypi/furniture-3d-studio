'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';
import type { Dimensions, FurnitureItem } from '@/lib/furniture/catalog';
import { getDefaultColor, type MaterialId } from '@/lib/furniture/materials';
import { estimatePrice } from '@/lib/furniture/price';
import { CanvasBoundary } from './CanvasBoundary';
import type { CaptureFn } from './ConfiguratorCanvas';
import { ControlPanel } from './ControlPanel';
import styles from './ConfiguratorShell.module.css';

const ConfiguratorCanvas = dynamic(() => import('./ConfiguratorCanvas'), {
  ssr: false,
  loading: () => (
    <div className={styles.skeleton} role="status">
      正在加载 3D 场景
    </div>
  ),
});

interface ConfiguratorShellProps {
  item: FurnitureItem;
}

export function ConfiguratorShell({ item }: ConfiguratorShellProps) {
  const [material, setMaterial] = useState<MaterialId>(item.defaultMaterial);
  const [color, setColor] = useState<string>(() => getDefaultColor(item.defaultMaterial));
  const [dims, setDims] = useState<Dimensions>(item.defaults);
  const [message, setMessage] = useState<string | null>(null);
  const captureRef = useRef<CaptureFn | null>(null);

  const handleMaterialChange = useCallback((next: MaterialId) => {
    setMaterial(next);
    setColor(getDefaultColor(next));
  }, []);

  const handleDimChange = useCallback((key: keyof Dimensions, value: number) => {
    setDims((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setDims(item.defaults);
  }, [item.defaults]);

  const handleExport = useCallback(() => {
    const capture = captureRef.current;
    if (!capture) {
      setMessage('场景还没有准备好，请稍后重试。');
      return;
    }
    try {
      const dataUrl = capture();
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${item.id}-${material}.png`;
      link.click();
      setMessage('截图已导出。');
    } catch (error) {
      console.error('导出截图失败', error);
      setMessage('导出失败，请重试。');
    }
  }, [item.id, material]);

  return (
    <main className={styles.layout}>
      <section className={styles.stage} aria-label={`${item.name}的 3D 视图`}>
        <Link href="/" className={styles.back}>
          ← 返回目录
        </Link>
        <CanvasBoundary>
          <ConfiguratorCanvas
            item={item}
            dims={dims}
            material={material}
            color={color}
            captureRef={captureRef}
          />
        </CanvasBoundary>
      </section>
      <ControlPanel
        item={item}
        material={material}
        color={color}
        dims={dims}
        price={estimatePrice(item, material, dims)}
        message={message}
        onMaterialChange={handleMaterialChange}
        onColorChange={setColor}
        onDimChange={handleDimChange}
        onReset={handleReset}
        onExport={handleExport}
      />
    </main>
  );
}

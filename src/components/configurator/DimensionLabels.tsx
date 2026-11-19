'use client';

import { Html, Line } from '@react-three/drei';
import type { ReactNode } from 'react';
import type { Dimensions } from '@/lib/furniture/catalog';
import styles from './ConfiguratorShell.module.css';

type Point = [number, number, number];

const LINE_COLOR = '#2f5d50';
const OFFSET = 0.1;
const LIFT = 0.004;

function Label({ position, children }: { position: Point; children: ReactNode }) {
  return (
    <Html position={position} center zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
      <span className={styles.label}>{children}</span>
    </Html>
  );
}

function Dimension({ from, to, text }: { from: Point; to: Point; text: string }) {
  const middle: Point = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, (from[2] + to[2]) / 2];
  return (
    <>
      <Line points={[from, to]} color={LINE_COLOR} lineWidth={1.5} />
      <Label position={middle}>{text}</Label>
    </>
  );
}

interface DimensionLabelsProps {
  dims: Dimensions;
}

/** 在家具旁绘制宽、深、高三条标注线，并用 Html 显示 cm 数值。 */
export function DimensionLabels({ dims }: DimensionLabelsProps) {
  const w = dims.width / 100;
  const d = dims.depth / 100;
  const h = dims.height / 100;
  return (
    <group>
      <Dimension
        from={[-w / 2, LIFT, d / 2 + OFFSET]}
        to={[w / 2, LIFT, d / 2 + OFFSET]}
        text={`宽 ${dims.width} cm`}
      />
      <Dimension
        from={[w / 2 + OFFSET, LIFT, -d / 2]}
        to={[w / 2 + OFFSET, LIFT, d / 2]}
        text={`深 ${dims.depth} cm`}
      />
      <Dimension
        from={[-w / 2 - OFFSET, 0, d / 2 + OFFSET]}
        to={[-w / 2 - OFFSET, h, d / 2 + OFFSET]}
        text={`高 ${dims.height} cm`}
      />
    </group>
  );
}

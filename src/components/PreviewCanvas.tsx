'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import type { Group } from 'three';
import type { FurnitureItem } from '@/lib/furniture/catalog';
import { getDefaultColor } from '@/lib/furniture/materials';
import { FurnitureModel } from './furniture/FurnitureModel';
import { StudioLights } from './furniture/StudioLights';

interface PreviewCanvasProps {
  item: FurnitureItem;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

function SpinningModel({ item, spin }: { item: FurnitureItem; spin: boolean }) {
  const groupRef = useRef<Group>(null);
  const { width, depth, height } = item.defaults;
  // 缩放到统一的可视大小，并把模型中心移到原点。
  const scale = 1.5 / (Math.max(width, depth, height) / 100);

  useFrame((_, delta) => {
    if (spin && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef} scale={scale} rotation-y={Math.PI / 5}>
      <group position={[0, -height / 200, 0]}>
        <FurnitureModel
          kind={item.id}
          dims={item.defaults}
          material={item.defaultMaterial}
          color={getDefaultColor(item.defaultMaterial)}
        />
      </group>
    </group>
  );
}

export default function PreviewCanvas({ item }: PreviewCanvasProps) {
  const reducedMotion = usePrefersReducedMotion();
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.9, 3.2], fov: 35 }}>
      <StudioLights resolution={64} />
      <SpinningModel item={item} spin={!reducedMotion} />
    </Canvas>
  );
}

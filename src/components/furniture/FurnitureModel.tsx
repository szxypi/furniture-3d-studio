'use client';

import { RoundedBox } from '@react-three/drei';
import { useMemo } from 'react';
import type { Dimensions, FurnitureKind } from '@/lib/furniture/catalog';
import { ACCENT_SURFACE, primarySurface, type MaterialId } from '@/lib/furniture/materials';
import { buildParts, type Part } from '@/lib/furniture/parts';

interface FurnitureModelProps {
  kind: FurnitureKind;
  dims: Dimensions;
  material: MaterialId;
  color: string;
}

/** 按尺寸与材质声明式渲染家具。尺寸变化时部件列表重建，R3F 释放旧几何体。 */
export function FurnitureModel({ kind, dims, material, color }: FurnitureModelProps) {
  const { width, depth, height } = dims;
  const parts = useMemo(
    () => buildParts(kind, { width, depth, height }),
    [kind, width, depth, height],
  );
  const primary = useMemo(() => primarySurface(material, color), [material, color]);

  return (
    <group>
      {parts.map((part) => (
        <PartMesh key={part.id} part={part} surface={part.role === 'primary' ? primary : ACCENT_SURFACE} />
      ))}
    </group>
  );
}

interface PartMeshProps {
  part: Part;
  surface: ReturnType<typeof primarySurface>;
}

function PartMesh({ part, surface }: PartMeshProps) {
  const material = <meshPhysicalMaterial {...surface} />;

  if (part.shape === 'cylinder') {
    return (
      <mesh position={part.position}>
        <cylinderGeometry args={[part.radius, part.radius, part.height, 24]} />
        {material}
      </mesh>
    );
  }
  if (part.bevel > 0.002) {
    return (
      <RoundedBox args={part.size} radius={part.bevel} smoothness={3} position={part.position}>
        {material}
      </RoundedBox>
    );
  }
  return (
    <mesh position={part.position}>
      <boxGeometry args={part.size} />
      {material}
    </mesh>
  );
}

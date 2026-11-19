import {
  BoxGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  type BufferGeometry,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import type { Dimensions, FurnitureKind } from './catalog';
import { ACCENT_SURFACE, primarySurface, type MaterialId } from './materials';
import { buildParts, type Part } from './parts';

/** 命令式创建部件几何体。原生 Three.js 示例使用，R3F 版本用 JSX 声明同样的几何体。 */
export function createPartGeometry(part: Part): BufferGeometry {
  if (part.shape === 'cylinder') {
    return new CylinderGeometry(part.radius, part.radius, part.height, 24);
  }
  const [w, h, d] = part.size;
  if (part.bevel > 0.002) {
    return new RoundedBoxGeometry(w, h, d, 3, part.bevel);
  }
  return new BoxGeometry(w, h, d);
}

/** 命令式创建整件家具。调用方负责在卸载时调用 disposeFurniture。 */
export function createFurnitureGroup(
  kind: FurnitureKind,
  dims: Dimensions,
  material: MaterialId,
  color: string,
): Group {
  const group = new Group();
  const primary = new MeshPhysicalMaterial(primarySurface(material, color));
  const accent = new MeshPhysicalMaterial(ACCENT_SURFACE);
  for (const part of buildParts(kind, dims)) {
    const mesh = new Mesh(createPartGeometry(part), part.role === 'primary' ? primary : accent);
    mesh.position.set(...part.position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  }
  return group;
}

/** 释放 group 内所有几何体与材质。 */
export function disposeFurniture(group: Group): void {
  const materials = new Set<MeshPhysicalMaterial>();
  group.traverse((object) => {
    if (object instanceof Mesh) {
      object.geometry.dispose();
      materials.add(object.material as MeshPhysicalMaterial);
    }
  });
  materials.forEach((material) => material.dispose());
  group.clear();
}

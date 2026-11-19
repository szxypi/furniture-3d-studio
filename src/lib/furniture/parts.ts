import type { Dimensions, FurnitureKind } from './catalog';

/** 三维向量，单位米。 */
export type Vec3 = [number, number, number];

/** primary 使用用户选择的材质与颜色，accent 使用固定的深色金属。 */
export type PartRole = 'primary' | 'accent';

interface PartBase {
  id: string;
  role: PartRole;
  /** 部件中心，单位米。家具底面位于 y = 0，宽沿 x，深沿 z，高沿 y。 */
  position: Vec3;
}

export interface BoxPart extends PartBase {
  shape: 'box';
  /** 宽、高、深。 */
  size: Vec3;
  /** 倒角半径，0 表示直角。 */
  bevel: number;
}

export interface CylinderPart extends PartBase {
  shape: 'cylinder';
  radius: number;
  height: number;
}

export type Part = BoxPart | CylinderPart;

const CM = 0.01;

function box(id: string, role: PartRole, position: Vec3, size: Vec3, bevel: number): BoxPart {
  const maxBevel = (Math.min(...size) / 2) * 0.9;
  return { id, shape: 'box', role, position, size, bevel: Math.max(0, Math.min(bevel, maxBevel)) };
}

function cylinder(id: string, role: PartRole, position: Vec3, radius: number, height: number): CylinderPart {
  return { id, shape: 'cylinder', role, position, radius, height };
}

function cornerLegs(
  prefix: string,
  role: PartRole,
  halfX: number,
  halfZ: number,
  radius: number,
  height: number,
): CylinderPart[] {
  const corners: ReadonlyArray<readonly [string, number, number]> = [
    ['fl', -1, 1],
    ['fr', 1, 1],
    ['bl', -1, -1],
    ['br', 1, -1],
  ];
  return corners.map(([name, sx, sz]) =>
    cylinder(`${prefix}-${name}`, role, [sx * halfX, height / 2, sz * halfZ], radius, height),
  );
}

function sofaParts(w: number, d: number, h: number): Part[] {
  const legH = 0.1;
  const baseH = 0.22;
  const armW = 0.16;
  const backT = 0.2;
  const armTop = h * 0.7;
  const innerW = w - armW * 2;
  const seatT = 0.12;
  return [
    box('base', 'primary', [0, legH + baseH / 2, 0], [innerW, baseH, d], 0.03),
    box('seat', 'primary', [0, legH + baseH + seatT / 2, backT / 2], [innerW, seatT, d - backT - 0.02], 0.04),
    box('back', 'primary', [0, legH + (h - legH) / 2, -(d / 2 - backT / 2)], [innerW, h - legH, backT], 0.05),
    box('arm-left', 'primary', [-(w / 2 - armW / 2), legH + (armTop - legH) / 2, 0], [armW, armTop - legH, d], 0.05),
    box('arm-right', 'primary', [w / 2 - armW / 2, legH + (armTop - legH) / 2, 0], [armW, armTop - legH, d], 0.05),
    ...cornerLegs('leg', 'accent', w / 2 - 0.1, d / 2 - 0.1, 0.03, legH),
  ];
}

function chairParts(w: number, d: number, h: number): Part[] {
  const seatY = Math.min(0.45, h * 0.5);
  const seatT = 0.06;
  const legH = seatY - seatT;
  const backT = 0.05;
  return [
    box('seat', 'primary', [0, legH + seatT / 2, 0], [w, seatT, d], 0.015),
    box('back', 'primary', [0, seatY + (h - seatY) / 2, -(d / 2 - backT / 2)], [w, h - seatY, backT], 0.015),
    ...cornerLegs('leg', 'accent', w / 2 - 0.035, d / 2 - 0.035, 0.018, legH),
  ];
}

function tableParts(w: number, d: number, h: number): Part[] {
  const topT = 0.04;
  return [
    box('top', 'primary', [0, h - topT / 2, 0], [w, topT, d], 0.015),
    box('shelf', 'primary', [0, h * 0.3, 0], [w - 0.2, 0.025, d - 0.2], 0.006),
    ...cornerLegs('leg', 'accent', w / 2 - 0.06, d / 2 - 0.06, 0.025, h - topT),
  ];
}

function bookshelfParts(w: number, d: number, h: number): Part[] {
  const t = 0.025;
  const innerW = w - t * 2;
  const compartments = Math.max(2, Math.round(h / 0.36));
  const parts: Part[] = [
    box('side-left', 'primary', [-(w / 2 - t / 2), h / 2, 0], [t, h, d], 0.005),
    box('side-right', 'primary', [w / 2 - t / 2, h / 2, 0], [t, h, d], 0.005),
    box('bottom', 'primary', [0, t / 2, 0], [innerW, t, d], 0.005),
    box('top', 'primary', [0, h - t / 2, 0], [innerW, t, d], 0.005),
    box('back', 'accent', [0, h / 2, -(d / 2) + 0.005], [innerW, h - t * 2, 0.01], 0),
  ];
  for (let i = 1; i < compartments; i += 1) {
    const y = t + (i * (h - t * 2)) / compartments;
    parts.push(box(`shelf-${i}`, 'primary', [0, y, 0.005], [innerW, t, d - 0.01], 0.005));
  }
  return parts;
}

/** 按类型和尺寸（cm）生成部件列表。R3F 与原生 Three.js 共用此函数。 */
export function buildParts(kind: FurnitureKind, dims: Dimensions): Part[] {
  const w = dims.width * CM;
  const d = dims.depth * CM;
  const h = dims.height * CM;
  switch (kind) {
    case 'sofa':
      return sofaParts(w, d, h);
    case 'chair':
      return chairParts(w, d, h);
    case 'table':
      return tableParts(w, d, h);
    case 'bookshelf':
      return bookshelfParts(w, d, h);
  }
}

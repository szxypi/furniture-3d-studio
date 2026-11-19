import type { MaterialId } from './materials';

export type FurnitureKind = 'sofa' | 'chair' | 'table' | 'bookshelf';

/** 尺寸，单位 cm。 */
export interface Dimensions {
  width: number;
  depth: number;
  height: number;
}

export interface DimensionRange {
  min: number;
  max: number;
  step: number;
}

export interface FurnitureItem {
  id: FurnitureKind;
  name: string;
  description: string;
  /** 默认尺寸与默认材质下的示例价格，单位元。 */
  basePrice: number;
  defaultMaterial: MaterialId;
  defaults: Dimensions;
  ranges: Record<keyof Dimensions, DimensionRange>;
}

export const FURNITURE_CATALOG: readonly FurnitureItem[] = [
  {
    id: 'sofa',
    name: '三人沙发',
    description: '低扶手，厚坐垫，适合客厅。',
    basePrice: 4800,
    defaultMaterial: 'fabric',
    defaults: { width: 220, depth: 95, height: 85 },
    ranges: {
      width: { min: 160, max: 300, step: 5 },
      depth: { min: 80, max: 120, step: 5 },
      height: { min: 70, max: 100, step: 5 },
    },
  },
  {
    id: 'chair',
    name: '餐椅',
    description: '直背设计，四脚支撑。',
    basePrice: 680,
    defaultMaterial: 'wood',
    defaults: { width: 46, depth: 50, height: 90 },
    ranges: {
      width: { min: 40, max: 60, step: 2 },
      depth: { min: 42, max: 60, step: 2 },
      height: { min: 80, max: 110, step: 2 },
    },
  },
  {
    id: 'table',
    name: '茶几',
    description: '圆角台面，带下层搁板。',
    basePrice: 1280,
    defaultMaterial: 'wood',
    defaults: { width: 110, depth: 60, height: 42 },
    ranges: {
      width: { min: 80, max: 160, step: 5 },
      depth: { min: 50, max: 90, step: 5 },
      height: { min: 35, max: 55, step: 1 },
    },
  },
  {
    id: 'bookshelf',
    name: '书架',
    description: '开放式层板，层数随高度变化。',
    basePrice: 2100,
    defaultMaterial: 'wood',
    defaults: { width: 90, depth: 30, height: 180 },
    ranges: {
      width: { min: 60, max: 140, step: 5 },
      depth: { min: 25, max: 45, step: 1 },
      height: { min: 120, max: 220, step: 5 },
    },
  },
];

export function getFurniture(id: string): FurnitureItem | undefined {
  return FURNITURE_CATALOG.find((item) => item.id === id);
}

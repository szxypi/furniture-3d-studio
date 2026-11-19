export type MaterialId = 'fabric' | 'leather' | 'wood' | 'metal';

/** 传给 MeshPhysicalMaterial 的参数。R3F 与原生 Three.js 共用同一份。 */
export interface SurfaceProps {
  color: string;
  roughness: number;
  metalness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  sheen: number;
  sheenRoughness: number;
  sheenColor: string;
}

type PhysicalParams = Omit<SurfaceProps, 'color'>;

export interface MaterialPreset {
  id: MaterialId;
  label: string;
  summary: string;
  /** 示例价格的材质系数。 */
  priceFactor: number;
  swatches: readonly string[];
  physical: PhysicalParams;
}

export const MATERIAL_PRESETS: readonly MaterialPreset[] = [
  {
    id: 'fabric',
    label: '布艺',
    summary: '高粗糙度，带织物绒感',
    priceFactor: 1,
    swatches: ['#8a9a8b', '#c9bfae', '#4a5a73', '#a45d4f'],
    physical: {
      roughness: 0.95,
      metalness: 0,
      clearcoat: 0,
      clearcoatRoughness: 0,
      sheen: 1,
      sheenRoughness: 0.8,
      sheenColor: '#ffffff',
    },
  },
  {
    id: 'leather',
    label: '皮革',
    summary: '中等粗糙度，带清漆层',
    priceFactor: 1.9,
    swatches: ['#6b3e26', '#1f1f22', '#b5835a', '#8c2f2f'],
    physical: {
      roughness: 0.5,
      metalness: 0,
      clearcoat: 0.35,
      clearcoatRoughness: 0.35,
      sheen: 0,
      sheenRoughness: 0.5,
      sheenColor: '#ffffff',
    },
  },
  {
    id: 'wood',
    label: '木纹',
    summary: '半哑光，无金属度',
    priceFactor: 1.5,
    swatches: ['#c8a27a', '#8b5a2b', '#5a3a22', '#e3cfa8'],
    physical: {
      roughness: 0.62,
      metalness: 0,
      clearcoat: 0.1,
      clearcoatRoughness: 0.6,
      sheen: 0,
      sheenRoughness: 0.5,
      sheenColor: '#ffffff',
    },
  },
  {
    id: 'metal',
    label: '金属',
    summary: '高金属度，低粗糙度',
    priceFactor: 1.7,
    swatches: ['#c0c4c8', '#b08d57', '#3a3d42', '#b87333'],
    physical: {
      roughness: 0.28,
      metalness: 1,
      clearcoat: 0,
      clearcoatRoughness: 0,
      sheen: 0,
      sheenRoughness: 0.5,
      sheenColor: '#ffffff',
    },
  },
];

export function getMaterialPreset(id: MaterialId): MaterialPreset {
  const preset = MATERIAL_PRESETS.find((item) => item.id === id);
  if (!preset) {
    throw new Error(`Unknown material: ${id}`);
  }
  return preset;
}

export function getDefaultColor(id: MaterialId): string {
  return getMaterialPreset(id).swatches[0] ?? '#cccccc';
}

/** 主体部件的表面参数：材质预设加用户选择的颜色。 */
export function primarySurface(id: MaterialId, color: string): SurfaceProps {
  return { color, ...getMaterialPreset(id).physical };
}

/** 辅助部件（椅脚、背板）的表面参数：固定的深色金属。 */
export const ACCENT_SURFACE: SurfaceProps = {
  color: '#2a2a2e',
  roughness: 0.4,
  metalness: 0.8,
  clearcoat: 0,
  clearcoatRoughness: 0,
  sheen: 0,
  sheenRoughness: 0.5,
  sheenColor: '#ffffff',
};

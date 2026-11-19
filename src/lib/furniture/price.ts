import type { Dimensions, FurnitureItem } from './catalog';
import { getMaterialPreset, type MaterialId } from './materials';

/**
 * 示例价格：基础价 × 材质系数 × 体积比的 0.8 次方。
 * 结果取整到 10 元。数据为前端本地计算，不代表真实报价。
 */
export function estimatePrice(item: FurnitureItem, material: MaterialId, dims: Dimensions): number {
  const volume = dims.width * dims.depth * dims.height;
  const defaultVolume = item.defaults.width * item.defaults.depth * item.defaults.height;
  const defaultFactor = getMaterialPreset(item.defaultMaterial).priceFactor;
  const factor = getMaterialPreset(material).priceFactor / defaultFactor;
  const raw = item.basePrice * factor * Math.pow(volume / defaultVolume, 0.8);
  return Math.round(raw / 10) * 10;
}

export function formatPrice(value: number): string {
  return `¥${value.toLocaleString('zh-CN')}`;
}

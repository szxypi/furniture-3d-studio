'use client';

import type { Dimensions, FurnitureItem } from '@/lib/furniture/catalog';
import { MATERIAL_PRESETS, getMaterialPreset, type MaterialId } from '@/lib/furniture/materials';
import { formatPrice } from '@/lib/furniture/price';
import styles from './ControlPanel.module.css';

interface ControlPanelProps {
  item: FurnitureItem;
  material: MaterialId;
  color: string;
  dims: Dimensions;
  price: number;
  message: string | null;
  onMaterialChange: (material: MaterialId) => void;
  onColorChange: (color: string) => void;
  onDimChange: (key: keyof Dimensions, value: number) => void;
  onReset: () => void;
  onExport: () => void;
}

const DIM_LABELS: ReadonlyArray<readonly [keyof Dimensions, string]> = [
  ['width', '宽'],
  ['depth', '深'],
  ['height', '高'],
];

export function ControlPanel({
  item,
  material,
  color,
  dims,
  price,
  message,
  onMaterialChange,
  onColorChange,
  onDimChange,
  onReset,
  onExport,
}: ControlPanelProps) {
  const preset = getMaterialPreset(material);

  return (
    <aside className={styles.panel} aria-label="配置面板">
      <h1 className={styles.title}>{item.name}</h1>

      <section className={styles.section}>
        <h2 className={styles.heading} id="material-heading">
          材质
        </h2>
        <div className={styles.options} role="radiogroup" aria-labelledby="material-heading">
          {MATERIAL_PRESETS.map((option) => (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={option.id === material}
              className={styles.option}
              onClick={() => onMaterialChange(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className={styles.hint}>{preset.summary}</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading} id="color-heading">
          颜色
        </h2>
        <div className={styles.swatches} role="radiogroup" aria-labelledby="color-heading">
          {preset.swatches.map((swatch) => (
            <button
              key={swatch}
              type="button"
              role="radio"
              aria-checked={swatch === color}
              aria-label={`颜色 ${swatch}`}
              className={styles.swatch}
              onClick={() => onColorChange(swatch)}
            >
              <span className={styles.swatchDot} style={{ background: swatch }} />
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.headingRow}>
          <h2 className={styles.heading}>尺寸</h2>
          <button type="button" className={styles.linkButton} onClick={onReset}>
            恢复默认
          </button>
        </div>
        {DIM_LABELS.map(([key, label]) => {
          const range = item.ranges[key];
          const inputId = `dim-${key}`;
          return (
            <div key={key} className={styles.slider}>
              <label htmlFor={inputId}>{label}</label>
              <input
                id={inputId}
                type="range"
                min={range.min}
                max={range.max}
                step={range.step}
                value={dims[key]}
                aria-valuetext={`${dims[key]} cm`}
                onChange={(event) => onDimChange(key, Number(event.target.value))}
              />
              <output htmlFor={inputId}>{dims[key]} cm</output>
            </div>
          );
        })}
      </section>

      <section className={styles.price} aria-live="polite">
        <p className={styles.priceValue}>{formatPrice(price)}</p>
        <p className={styles.hint}>示例价格，按材质与体积在浏览器里估算，不是真实报价。</p>
      </section>

      <button type="button" className={styles.primaryButton} onClick={onExport}>
        导出截图
      </button>
      <p className={styles.status} role="status">
        {message}
      </p>
    </aside>
  );
}

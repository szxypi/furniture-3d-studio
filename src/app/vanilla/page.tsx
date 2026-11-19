import type { Metadata } from 'next';
import { VanillaLoader } from '@/components/VanillaLoader';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: '原生 Three.js 示例',
};

const COMPARISON: ReadonlyArray<readonly [string, string, string]> = [
  ['创建场景', '<Canvas> 自动创建 scene、camera、renderer', '手动 new Scene、PerspectiveCamera、WebGLRenderer'],
  ['添加对象', 'JSX：<mesh><boxGeometry /></mesh>', 'new Mesh(geometry, material)，再 scene.add'],
  ['渲染循环', 'R3F 内置，用 useFrame 注册每帧逻辑', 'renderer.setAnimationLoop(callback)'],
  ['尺寸变化', 'Canvas 自动监听容器大小', '手动监听 resize，更新 renderer 与 camera'],
  ['资源释放', 'R3F 在卸载或 args 变化时释放 JSX 创建的对象', '在 useEffect 清理函数里逐个 dispose'],
  ['状态更新', 'props 变化后 React 协调并更新对象', '手动修改对象属性或重建对象'],
];

export default function VanillaPage() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>原生 Three.js 示例</h1>
      <p className={styles.lead}>
        这个页面不使用 React Three Fiber。它在 useEffect 里手动创建 scene、camera 和 renderer，渲染和配置器里同一件沙发。
      </p>
      <VanillaLoader />
      <h2 className={styles.heading}>R3F 与原生写法对照</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">环节</th>
            <th scope="col">R3F</th>
            <th scope="col">原生 Three.js</th>
          </tr>
        </thead>
        <tbody>
          {COMPARISON.map(([topic, r3f, vanilla]) => (
            <tr key={topic}>
              <th scope="row">{topic}</th>
              <td>{r3f}</td>
              <td>{vanilla}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={styles.note}>
        两种写法共用 src/lib/furniture/parts.ts 的部件数据和 materials.ts 的材质参数。
        R3F 版本在 src/components/furniture/FurnitureModel.tsx，原生版本在 src/lib/furniture/geometry.ts。
      </p>
    </main>
  );
}

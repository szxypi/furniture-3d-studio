'use client';

import { Environment, Lightformer } from '@react-three/drei';

interface StudioLightsProps {
  /** 环境贴图分辨率。预览用较小值。 */
  resolution?: number;
}

/** 用 Lightformer 在本地生成环境光，不请求任何外部 HDR 文件。 */
export function StudioLights({ resolution = 256 }: StudioLightsProps) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 2]} intensity={1.4} />
      <Environment resolution={resolution} frames={1}>
        <Lightformer form="rect" intensity={2.5} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
        <Lightformer form="rect" intensity={1.5} position={[-5, 2, 2]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} />
        <Lightformer form="rect" intensity={1} position={[5, 2, -2]} rotation-y={-Math.PI / 2} scale={[8, 4, 1]} />
        <Lightformer form="rect" intensity={0.8} position={[0, 2, 6]} rotation-y={Math.PI} scale={[10, 4, 1]} />
      </Environment>
    </>
  );
}

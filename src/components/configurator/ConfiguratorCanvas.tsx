'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { ContactShadows, OrbitControls } from '@react-three/drei';
import { useEffect, type RefObject } from 'react';
import { BackSide } from 'three';
import type { Dimensions, FurnitureItem } from '@/lib/furniture/catalog';
import type { MaterialId } from '@/lib/furniture/materials';
import { FurnitureModel } from '@/components/furniture/FurnitureModel';
import { StudioLights } from '@/components/furniture/StudioLights';
import { DimensionLabels } from './DimensionLabels';

/** 渲染当前画面并返回 PNG 的 data URL。 */
export type CaptureFn = () => string;

interface ConfiguratorCanvasProps {
  item: FurnitureItem;
  dims: Dimensions;
  material: MaterialId;
  color: string;
  captureRef: RefObject<CaptureFn | null>;
}

const ROOM_SIZE = 16;
const ROOM_HEIGHT = 4;

/** 把截图函数登记到 ref。Canvas 需设置 preserveDrawingBuffer，toDataURL 才能读到画面。 */
function CaptureBridge({ captureRef }: { captureRef: RefObject<CaptureFn | null> }) {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    captureRef.current = () => {
      gl.render(scene, camera);
      return gl.domElement.toDataURL('image/png');
    };
    return () => {
      captureRef.current = null;
    };
  }, [captureRef, gl, scene, camera]);

  return null;
}

/** 简单房间：内侧可见的盒子，地面用较深的颜色。BackSide 让相机从外侧俯视时不被墙挡住。 */
function Room() {
  const wall = { color: '#e9e6df', roughness: 1, side: BackSide } as const;
  return (
    <mesh position={[0, ROOM_HEIGHT / 2, 0]}>
      <boxGeometry args={[ROOM_SIZE, ROOM_HEIGHT, ROOM_SIZE]} />
      <meshStandardMaterial attach="material-0" {...wall} />
      <meshStandardMaterial attach="material-1" {...wall} />
      <meshStandardMaterial attach="material-2" {...wall} />
      <meshStandardMaterial attach="material-3" {...wall} color="#cfc8bc" />
      <meshStandardMaterial attach="material-4" {...wall} />
      <meshStandardMaterial attach="material-5" {...wall} />
    </mesh>
  );
}

export default function ConfiguratorCanvas({ item, dims, material, color, captureRef }: ConfiguratorCanvasProps) {
  const { width, depth, height } = item.defaults;
  const distance = Math.max(width, depth, height) / 100 * 1.6 + 1.2;
  const shadowScale = Math.max(dims.width, dims.depth) / 100 + 2;

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [distance * 0.7, distance * 0.45, distance * 0.85], fov: 40, near: 0.1, far: 60 }}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
    >
      <color attach="background" args={['#e9e6df']} />
      <StudioLights />
      <Room />
      <FurnitureModel kind={item.id} dims={dims} material={material} color={color} />
      <ContactShadows position={[0, 0.005, 0]} opacity={0.55} scale={shadowScale} blur={2.4} far={1.5} resolution={512} />
      <DimensionLabels dims={dims} />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        target={[0, dims.height / 200, 0]}
        minDistance={1.2}
        maxDistance={5.5}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2 - 0.03}
      />
      <CaptureBridge captureRef={captureRef} />
    </Canvas>
  );
}

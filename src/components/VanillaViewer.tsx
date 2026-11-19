'use client';

import { useEffect, useRef } from 'react';
import {
  ACESFilmicToneMapping,
  Color,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { getFurniture } from '@/lib/furniture/catalog';
import { createFurnitureGroup, disposeFurniture } from '@/lib/furniture/geometry';
import { getDefaultColor } from '@/lib/furniture/materials';
import styles from './VanillaViewer.module.css';

/**
 * 不使用 R3F 的原生 Three.js 写法。
 * 家具的部件数据与材质参数和 R3F 配置器共用，只有创建和释放资源的方式不同。
 */
export default function VanillaViewer() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const item = getFurniture('sofa');
    if (!container || !item) {
      return;
    }

    // 1. 创建 renderer，并把 canvas 挂到容器。
    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFShadowMap;
    container.appendChild(renderer.domElement);

    // 2. 创建 scene、camera 和本地生成的环境光。
    const scene = new Scene();
    scene.background = new Color('#e9e6df');
    const roomEnvironment = new RoomEnvironment();
    const pmrem = new PMREMGenerator(renderer);
    const environmentTarget = pmrem.fromScene(roomEnvironment, 0.04);
    scene.environment = environmentTarget.texture;

    const camera = new PerspectiveCamera(40, 1, 0.1, 60);
    camera.position.set(3.4, 2.2, 4.2);

    const sun = new DirectionalLight('#ffffff', 1.6);
    sun.position.set(3, 5, 2);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    scene.add(sun);

    const floorGeometry = new PlaneGeometry(16, 16);
    const floorMaterial = new MeshStandardMaterial({ color: '#cfc8bc', roughness: 1 });
    const floor = new Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // 3. 创建家具。
    const furniture = createFurnitureGroup(
      item.id,
      item.defaults,
      item.defaultMaterial,
      getDefaultColor(item.defaultMaterial),
    );
    scene.add(furniture);

    // 4. 控制器和 resize 监听。
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.target.set(0, item.defaults.height / 200, 0);
    controls.maxPolarAngle = Math.PI / 2 - 0.03;
    controls.minDistance = 1.2;
    controls.maxDistance = 8;

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / Math.max(clientHeight, 1);
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    // 5. 动画循环。
    renderer.setAnimationLoop(() => {
      controls.update();
      renderer.render(scene, camera);
    });

    // 6. 卸载时按创建的逆序释放资源。
    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener('resize', resize);
      controls.dispose();
      disposeFurniture(furniture);
      floorGeometry.dispose();
      floorMaterial.dispose();
      sun.shadow.map?.dispose();
      environmentTarget.dispose();
      roomEnvironment.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={containerRef} className={styles.viewer} role="img" aria-label="原生 Three.js 渲染的沙发" />;
}

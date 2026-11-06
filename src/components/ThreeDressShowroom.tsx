
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  Sparkles,
  X,
  Eye,
  ChevronUp,
  ChevronDown,
  Scissors,
  RotateCw,
  Crown
} from 'lucide-react';

interface ThreeDressShowroomProps {
  garmentName?: string;
  onClose?: () => void;
  initialColor?: string;
}

type FabricType = 'velvet' | 'silk' | 'brocade';
type FitType = 'S' | 'M' | 'L';

const COLORS = [
  { name: 'Royal Emerald', hex: '#064E3B' },
  { name: 'Champagne Gold', hex: '#D6B875' },
  { name: 'Midnight Black', hex: '#151C19' },
  { name: 'Ivory Pearl', hex: '#F1EBDD' },
  { name: 'Ruby Wine', hex: '#701F32' },
  { name: 'Royal Blue', hex: '#183A63' },
  { name: 'Dusty Rose', hex: '#B87983' },
  { name: 'Midnight Noir', hex: '#1C1618' }
];

const createBrocadeTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;

  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#064E3B';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = '#D6B875';
    ctx.lineWidth = 2.5;

    for (let i = 0; i < 512; i += 64) {
      for (let j = 0; j < 512; j += 64) {
        ctx.beginPath();
        ctx.arc(i + 32, j + 32, 16, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(i + 32, j + 16);
        ctx.lineTo(i + 32, j + 48);
        ctx.moveTo(i + 16, j + 32);
        ctx.lineTo(i + 48, j + 32);
        ctx.stroke();

        ctx.fillStyle = '#F1E2B8';
        ctx.fillRect(i + 30, j + 30, 4, 4);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);

  return texture;
};

const ThreeDressShowroom: React.FC<ThreeDressShowroomProps> = ({
  garmentName = 'ROYAL COLLECTION',
  onClose,
  initialColor = '#064E3B'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const dressMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const skirtRef = useRef<THREE.Mesh | null>(null);
  const torsoRef = useRef<THREE.Mesh | null>(null);
  const autoRotateRef = useRef(true);

  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [selectedFabric, setSelectedFabric] = useState<FabricType>('silk');
  const [selectedFit, setSelectedFit] = useState<FitType>('M');
  const [autoRotate, setAutoRotate] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#FAF8F1');
    scene.fog = new THREE.Fog('#FAF8F1', 7, 14);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 1.8, 4.4);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    const keyLight = new THREE.DirectionalLight('#FFF7EB', 2.5);
    keyLight.position.set(2.5, 4.5, 3.2);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight('#FFF5E6', '#022C22', 1.2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight('#D6B875', 1.8);
    rimLight.position.set(-2.8, 3, -2.5);
    scene.add(rimLight);

    const goldMaterial = new THREE.MeshPhysicalMaterial({
      color: '#D6B875',
      metalness: 0.9,
      roughness: 0.2,
      clearcoat: 0.4
    });

    const mannequinMaterial = new THREE.MeshStandardMaterial({
      color: '#18352B',
      roughness: 0.8,
      metalness: 0.1
    });

    const dressMaterial = new THREE.MeshPhysicalMaterial({
      color: selectedColor,
      roughness: 0.4,
      metalness: 0.2,
      clearcoat: 0.4
    });

    dressMaterialRef.current = dressMaterial;

    const group = new THREE.Group();

    // Pedestal base
    const baseGeo = new THREE.CylinderGeometry(0.55, 0.6, 0.06, 32);
    const base = new THREE.Mesh(baseGeo, goldMaterial);
    base.position.y = 0.03;
    base.receiveShadow = true;
    group.add(base);

    const stepGeo = new THREE.CylinderGeometry(0.35, 0.42, 0.04, 32);
    const step = new THREE.Mesh(stepGeo, goldMaterial);
    step.position.y = 0.08;
    group.add(step);

    const rodGeo = new THREE.CylinderGeometry(0.022, 0.022, 2, 16);
    const rod = new THREE.Mesh(rodGeo, goldMaterial);
    rod.position.y = 1.05;
    group.add(rod);

    // Mannequin torso
    const torsoGeo = new THREE.CylinderGeometry(0.18, 0.16, 0.58, 24);
    const torso = new THREE.Mesh(torsoGeo, mannequinMaterial);
    torso.position.y = 1.48;
    torso.castShadow = true;
    group.add(torso);
    torsoRef.current = torso;

    // Neck ornament
    const finialGeo = new THREE.SphereGeometry(0.065, 16, 16);
    const finial = new THREE.Mesh(finialGeo, goldMaterial);
    finial.position.y = 1.84;
    group.add(finial);

    // Flared skirt
    const skirtPoints: THREE.Vector2[] = [];

    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const y = 1.25 - t * 0.95;
      const radius = 0.16 + Math.pow(t, 1.8) * 0.58;
      skirtPoints.push(new THREE.Vector2(radius, y));
    }

    const skirtGeo = new THREE.LatheGeometry(skirtPoints, 48);
    const skirt = new THREE.Mesh(skirtGeo, dressMaterial);
    skirt.castShadow = true;
    skirt.receiveShadow = true;
    group.add(skirt);
    skirtRef.current = skirt;

    // Waistband
    const sashGeo = new THREE.CylinderGeometry(0.175, 0.185, 0.08, 32);
    const sash = new THREE.Mesh(sashGeo, goldMaterial);
    sash.position.y = 1.24;
    group.add(sash);

    // Collar
    const chokerGeo = new THREE.TorusGeometry(0.08, 0.015, 12, 32);
    chokerGeo.rotateX(Math.PI / 2);
    const choker = new THREE.Mesh(chokerGeo, goldMaterial);
    choker.position.y = 1.76;
    group.add(choker);

    // Gem
    const gemGeo = new THREE.ConeGeometry(0.025, 0.05, 8);
    gemGeo.rotateX(Math.PI);
    const gem = new THREE.Mesh(gemGeo, goldMaterial);
    gem.position.set(0, 1.73, 0.085);
    group.add(gem);

    // Golden hemline
    const hemGeo = new THREE.TorusGeometry(0.74, 0.012, 12, 48);
    hemGeo.rotateX(Math.PI / 2);
    const hem = new THREE.Mesh(hemGeo, goldMaterial);
    hem.position.y = 0.3;
    group.add(hem);

    scene.add(group);

    // Ground shadow
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;

    const shadowCtx = shadowCanvas.getContext('2d');

    if (shadowCtx) {
      const gradient = shadowCtx.createRadialGradient(128, 128, 20, 128, 128, 120);
      gradient.addColorStop(0, 'rgba(2, 44, 34, 0.35)');
      gradient.addColorStop(0.5, 'rgba(2, 44, 34, 0.15)');
      gradient.addColorStop(1, 'rgba(2, 44, 34, 0)');
      shadowCtx.fillStyle = gradient;
      shadowCtx.fillRect(0, 0, 256, 256);
    }

    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(1.6, 1.6);
    shadowGeo.rotateX(-Math.PI / 2);

    const shadowMaterial = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false
    });

    const shadow = new THREE.Mesh(shadowGeo, shadowMaterial);
    shadow.position.y = 0.005;
    scene.add(shadow);

    // 360 degree drag rotation
    let dragging = false;
    let previousX = 0;
    let previousY = 0;

    const targetRotation = { x: 0, y: 0 };
    const currentRotation = { x: 0, y: 0 };

    const handlePointerDown = (event: PointerEvent) => {
      dragging = true;
      previousX = event.clientX;
      previousY = event.clientY;
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!dragging) return;

      const dx = event.clientX - previousX;
      const dy = event.clientY - previousY;

      targetRotation.y += dx * 0.009;
      targetRotation.x = Math.max(
        -0.25,
        Math.min(0.35, targetRotation.x + dy * 0.006)
      );

      previousX = event.clientX;
      previousY = event.clientY;
    };

    const handlePointerUp = () => {
      dragging = false;
    };

    const dom = renderer.domElement;
    dom.style.touchAction = 'none';

    dom.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    const handleResize = () => {
      if (!container) return;

      const newWidth = container.clientWidth || 360;
      const newHeight = container.clientHeight || 480;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    let frameId = 0;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (autoRotateRef.current && !dragging) {
        targetRotation.y += 0.45 * dt;
      }

      const damping = 1 - Math.exp(-8 * dt);

      currentRotation.y += (targetRotation.y - currentRotation.y) * damping;
      currentRotation.x += (targetRotation.x - currentRotation.x) * damping;

      group.rotation.y = currentRotation.y;
      group.rotation.x = currentRotation.x;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);

      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);

      renderer.dispose();

      if (dom.parentElement) {
        dom.parentElement.removeChild(dom);
      }

      [
        baseGeo,
        stepGeo,
        rodGeo,
        torsoGeo,
        finialGeo,
        skirtGeo,
        sashGeo,
        chokerGeo,
        gemGeo,
        hemGeo,
        shadowGeo
      ].forEach(geometry => geometry.dispose());

      goldMaterial.dispose();
      mannequinMaterial.dispose();
      dressMaterial.dispose();
      shadowMaterial.dispose();
      shadowTexture.dispose();

      dressMaterialRef.current = null;
      skirtRef.current = null;
      torsoRef.current = null;
    };
  }, []);

  // Update selected dress colour
  useEffect(() => {
    if (dressMaterialRef.current) {
      dressMaterialRef.current.color.set(selectedColor);
    }
  }, [selectedColor]);

  // Update fabric texture and finish
  useEffect(() => {
    const material = dressMaterialRef.current;
    if (!material) return;

    if (material.map) {
      material.map.dispose();
      material.map = null;
    }

    if (selectedFabric === 'velvet') {
      material.roughness = 0.85;
      material.metalness = 0.05;
      material.clearcoat = 0.1;
    } else if (selectedFabric === 'silk') {
      material.roughness = 0.35;
      material.metalness = 0.25;
      material.clearcoat = 0.5;
    } else {
      material.roughness = 0.45;
      material.metalness = 0.45;
      material.clearcoat = 0.3;
      material.map = createBrocadeTexture();
    }

    material.needsUpdate = true;
  }, [selectedFabric]);

  // Update fitting size
  useEffect(() => {
    const scale = selectedFit === 'S' ? 0.92 : selectedFit === 'L' ? 1.08 : 1;

    if (skirtRef.current) {
      skirtRef.current.scale.set(scale, 1, scale);
    }

    if (torsoRef.current) {
      torsoRef.current.scale.set(scale, 1, scale);
    }
  }, [selectedFit]);

  return (
    <div className="relative w-full h-[480px] bg-gradient-to-b from-[#FAF8F1] to-[#E8E2D3] rounded-2xl overflow-hidden border border-[#D6B875]/50 shadow-xl">

      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Royal Threads Header */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <div className="bg-[#022C22]/95 text-[#FAF8F1] px-3 py-2 rounded-full shadow-lg flex items-center gap-2 pointer-events-auto border border-[#D6B875]/60">
          <Crown className="w-4 h-4 text-[#D6B875]" />

          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-wider font-brand uppercase">
              ROYAL THREADS
            </span>
            <span className="text-[8px] tracking-widest text-[#D6B875]">
              {garmentName}
            </span>
          </div>

          <span className="text-[9px] bg-[#D6B875] text-[#022C22] font-bold px-1.5 py-0.5 rounded">
            3D VIP
          </span>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 bg-[#FAF8F1] text-[#022C22] hover:bg-[#022C22] hover:text-white rounded-full shadow-lg transition-colors border border-[#D6B875]/50 pointer-events-auto"
            title="Close 3D View"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Rotation Hint */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-[#022C22]/85 text-[#FAF8F1] text-[10px] px-3 py-1 rounded-full pointer-events-none flex items-center gap-1.5 shadow">
        <Eye className="w-3.5 h-3.5 text-[#D6B875]" />
        <span>Drag to rotate 360°</span>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-[94%] max-w-[420px] z-20">

        <div className="flex justify-center -mb-2 relative z-30">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="bg-[#022C22] text-[#D6B875] text-[11px] font-semibold px-3 py-1 rounded-full border border-[#D6B875]/60 shadow-md flex items-center gap-1"
          >
            {isCollapsed
              ? <ChevronUp className="w-3.5 h-3.5" />
              : <ChevronDown className="w-3.5 h-3.5" />
            }
            <span>{isCollapsed ? 'Show Controls' : 'Hide Controls'}</span>
          </button>
        </div>

        {!isCollapsed && (
          <div className="bg-[#022C22]/95 border border-[#D6B875]/60 rounded-2xl p-3 shadow-2xl text-[#FAF8F1] space-y-2.5">

            {/* Colour Selection */}
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#D6B875] font-bold mb-2 flex items-center justify-between">
                <span>Fabric Shade</span>
                <span className="text-[#FAF8F1]/80">
                  {COLORS.find(c => c.hex === selectedColor)?.name || 'Custom'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-1.5">
                {COLORS.map(color => (
                  <button
                    key={color.hex}
                    onClick={() => setSelectedColor(color.hex)}
                    style={{ backgroundColor: color.hex }}
                    className={`w-7 h-7 rounded-full transition-transform border-2 ${
                      selectedColor === color.hex
                        ? 'border-[#D6B875] scale-110 shadow-lg ring-2 ring-[#D6B875]/50'
                        : 'border-white/30'
                    }`}
                    title={color.name}
                    aria-label={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Fabric and Fitting */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#D6B875]/30">

              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#D6B875] font-bold block mb-1">
                  Weave Finish
                </span>

                <div className="grid grid-cols-3 gap-1 bg-[#064E3B] p-0.5 rounded-lg border border-[#D6B875]/30">
                  {(['velvet', 'silk', 'brocade'] as const).map(fabric => (
                    <button
                      key={fabric}
                      onClick={() => setSelectedFabric(fabric)}
                      className={`text-[10px] py-1.5 font-semibold rounded capitalize transition-colors ${
                        selectedFabric === fabric
                          ? 'bg-[#D6B875] text-[#022C22] shadow'
                          : 'text-white/80 hover:text-white'
                      }`}
                    >
                      {fabric}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#D6B875] font-bold block mb-1 flex items-center gap-1">
                  <Scissors className="w-3 h-3" />
                  <span>Drape Fit</span>
                </span>

                <div className="grid grid-cols-3 gap-1 bg-[#064E3B] p-0.5 rounded-lg border border-[#D6B875]/30">
                  {(['S', 'M', 'L'] as const).map(fit => (
                    <button
                      key={fit}
                      onClick={() => setSelectedFit(fit)}
                      className={`text-[10px] py-1.5 font-semibold rounded transition-colors ${
                        selectedFit === fit
                          ? 'bg-[#D6B875] text-[#022C22] shadow'
                          : 'text-white/80 hover:text-white'
                      }`}
                    >
                      {fit}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Auto Rotate */}
            <div className="flex items-center justify-between pt-2 border-t border-[#D6B875]/30 text-[11px]">
              <span className="text-white/80 flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-[#D6B875]" />
                Continuous 360° Orbit
              </span>

              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`px-3 py-1 rounded text-[10px] font-bold tracking-wider transition-colors ${
                  autoRotate
                    ? 'bg-[#D6B875] text-[#022C22]'
                    : 'bg-[#064E3B] text-white/60'
                }`}
              >
                {autoRotate ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="text-center text-[8px] tracking-[0.2em] text-[#D6B875]/80 pt-1">
              POWERED BY NEXORA TECHNOLOGIES
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default ThreeDressShowroom;
export { ThreeDressShowroom };
    

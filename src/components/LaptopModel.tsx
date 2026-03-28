import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { LaptopKeyboard } from "./LaptopKeyboard";
import { LaptopScreenUI, BootPhase } from "./LaptopScreenUI";

interface LaptopModelProps {
  scrollProgress: number;
  lidOpenProgress: number;
  bootPhase: string | BootPhase;
}

export const LaptopModel = ({ scrollProgress, lidOpenProgress, bootPhase }: LaptopModelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const screenLightRef = useRef<THREE.PointLight>(null);
  const ambientGlowRef = useRef<THREE.PointLight>(null);

  // Determine current boot phase from lidOpenProgress and time
  // Wait, bootPhase is managed in Index.tsx. We need to pass it or just use lidOpenProgress internally?
  // Let's pass bootPhase from Index.tsx. But the props don't have it.
  // For now we can infer it or just make the UI pulse. Actually, the user wanted an explicit boot sequence.
  // Wait, I should add `bootPhase` prop to `LaptopModelProps` to drive UI.
  // I'll update it later or just pass it in Index.tsx update. Let's add it to props.
  // I will add `bootPhase?: string;` to Props.

  // PBR materials
  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0a0a10",
        metalness: 0.85,
        roughness: 0.18,
      }),
    []
  );

  const screenMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#000000",
        emissive: "#000000",
        emissiveIntensity: 0,
        metalness: 0.05,
        roughness: 0.03,
      }),
    []
  );

  const edgeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#111118",
        metalness: 0.95,
        roughness: 0.08,
      }),
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;

    // Screen glow
    const screenGlow = lidOpenProgress > 0.5 ? (lidOpenProgress - 0.5) * 2 : 0;
    screenMaterial.emissive.setHex(screenGlow > 0 ? 0x1a0a2e : 0x000000);
    screenMaterial.emissiveIntensity = screenGlow * 0.5;

    if (screenLightRef.current) {
      screenLightRef.current.intensity = screenGlow * 4; // Brighter
    }

    if (ambientGlowRef.current) {
      ambientGlowRef.current.intensity =
        0.4 + Math.sin(state.clock.elapsedTime * 0.8) * 0.1 + screenGlow * 1.5;
    }

    // Phase 1: Normal zoom as before. Phase 2: aggressive dive into the screen.
    // The screen in world space when fully open is roughly around Y=1.5, Z=-2.0
    // We want the camera to end up perfectly aligned with the screen normal.
    // The screen is rotated by `lidAngle` = 1.85 (106 deg) from the hinge.
    const zoomProgress = scrollProgress; // 0 to 1
    
    // Easing for cinematic feel (ease-in-out cubic)
    const easeZoom = zoomProgress < 0.5 
      ? 4 * zoomProgress * zoomProgress * zoomProgress 
      : 1 - Math.pow(-2 * zoomProgress + 2, 3) / 2;

    // Initial camera: [0, 2.5, 4.5] looking at [0, 1.2, 0]
    // Target camera (inside screen): Center of screen is approx [0, 1.2, -1.8]
    // If the screen is tilted back, we need to match its tilt.
    // However, the easiest trick is to level the laptop itself slightly as we zoom in!
    // We can do that by adjusting the groupRef rotation.
    
    const targetGroupRotationX = THREE.MathUtils.lerp(0.08, -0.28, easeZoom); // tilt laptop to face camera
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetGroupRotationX, 0.1);

    const targetZ = THREE.MathUtils.lerp(4.5, -0.6, easeZoom); // push deep into screen
    const targetY = THREE.MathUtils.lerp(2.5, 0.95, easeZoom); // align Y
    
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.08); // smoother
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.08);
    
    const lookTargetY = THREE.MathUtils.lerp(1.2, 0.95, easeZoom);
    const lookTargetZ = THREE.MathUtils.lerp(0, -2.0, easeZoom);
    state.camera.lookAt(0, lookTargetY, lookTargetZ);

    // Idle sway only when not zooming
    if (scrollProgress < 0.05) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.02; // subtle drift
    } else {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.05); // center it
    }
  });

  const lidAngle = 1.85 * lidOpenProgress;

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0.08, 0, 0]}>
      {/* Ambient purple glow behind laptop */}
      <pointLight
        ref={ambientGlowRef}
        position={[0, 1.5, -2.5]}
        color="#7c3aed"
        intensity={0.4}
        distance={10}
      />

      {/* === BASE CHASSIS === */}
      <mesh material={bodyMaterial} position={[0, 0.035, 0]}>
        <boxGeometry args={[3.2, 0.07, 2.1]} />
      </mesh>

      <mesh material={edgeMaterial} position={[0, 0.0, 0]}>
        <boxGeometry args={[3.22, 0.015, 2.12]} />
      </mesh>

      <mesh material={edgeMaterial} position={[0, 0.015, 1.06]}>
        <boxGeometry args={[3.18, 0.03, 0.02]} />
      </mesh>

      <mesh material={edgeMaterial} position={[-1.61, 0.015, 0]}>
        <boxGeometry args={[0.02, 0.03, 2.1]} />
      </mesh>
      <mesh material={edgeMaterial} position={[1.61, 0.015, 0]}>
        <boxGeometry args={[0.02, 0.03, 2.1]} />
      </mesh>

      {/* Ventilation grills */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`vent-${i}`} position={[-0.7 + i * 0.2, 0.072, -1.0]} material={edgeMaterial}>
          <boxGeometry args={[0.12, 0.003, 0.06]} />
        </mesh>
      ))}

      {/* === KEYBOARD === */}
      <LaptopKeyboard lidOpenProgress={lidOpenProgress} />

      {/* === TRACKPAD === */}
      <mesh position={[0, 0.075, 0.58]}>
        <boxGeometry args={[0.85, 0.005, 0.5]} />
        <meshStandardMaterial color="#08080e" metalness={0.6} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.074, 0.58]}>
        <boxGeometry args={[0.87, 0.002, 0.52]} />
        <meshStandardMaterial color="#111118" metalness={0.8} roughness={0.1} />
      </mesh>

      {/* === LED INDICATORS === */}
      <mesh position={[-1.25, 0.09, 0.15]}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshStandardMaterial
          color="#000"
          emissive="#ef4444"
          emissiveIntensity={lidOpenProgress > 0.1 ? 3 : 0}
        />
      </mesh>
      {lidOpenProgress > 0.1 && (
        <pointLight position={[-1.25, 0.1, 0.15]} color="#ef4444" intensity={0.15} distance={0.3} />
      )}

      <mesh position={[1.15, 0.09, -0.55]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial
          color="#000"
          emissive="#3b82f6"
          emissiveIntensity={lidOpenProgress > 0.1 ? 2.5 : 0}
        />
      </mesh>

      <mesh position={[0, 0.015, 1.055]}>
        <boxGeometry args={[0.6, 0.003, 0.005]} />
        <meshStandardMaterial
          color="#000"
          emissive="#7c3aed"
          emissiveIntensity={lidOpenProgress > 0.2 ? lidOpenProgress * 1.5 : 0}
        />
      </mesh>

      {/* === HINGE === */}
      <group position={[0, 0.07, -1.0]}>
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 2.6, 12]} />
          <meshStandardMaterial color="#0a0a10" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[-1.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.1, 12]} />
          <meshStandardMaterial color="#111118" metalness={0.95} roughness={0.05} />
        </mesh>
        <mesh position={[1.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.1, 12]} />
          <meshStandardMaterial color="#111118" metalness={0.95} roughness={0.05} />
        </mesh>

        {/* === LID (rotates from hinge) === */}
        <group rotation={[lidAngle, 0, 0]}>
          <mesh material={bodyMaterial} position={[0, -0.025, -1.1]}>
            <boxGeometry args={[3.2, 0.05, 2.2]} />
          </mesh>

          <mesh position={[0, -0.052, -1.1]}>
            <boxGeometry args={[0.4, 0.002, 0.25]} />
            <meshStandardMaterial color="#0c0c14" metalness={0.95} roughness={0.05} />
          </mesh>

          <mesh position={[0, 0.003, -1.1]}>
            <boxGeometry args={[3.05, 0.008, 2.1]} />
            <meshStandardMaterial color="#050508" metalness={0.2} roughness={0.7} />
          </mesh>

          <mesh material={screenMaterial} position={[0, 0.008, -1.1]}>
            <boxGeometry args={[2.8, 0.004, 1.8]} />
          </mesh>

          <pointLight
            ref={screenLightRef}
            position={[0, 0.4, -1.1]}
            color="#a855f7"
            intensity={0}
            distance={5}
          />

          <mesh position={[0, 0.004, -0.12]}>
            <sphereGeometry args={[0.018, 8, 8]} />
            <meshStandardMaterial
              color="#000"
              emissive="#ef4444"
              emissiveIntensity={lidOpenProgress > 0.8 ? 1.2 : 0}
            />
          </mesh>
          <mesh position={[0, 0.004, -0.12]}>
            <boxGeometry args={[0.12, 0.006, 0.035]} />
            <meshStandardMaterial color="#0a0a10" metalness={0.5} roughness={0.3} />
          </mesh>
          
          {/* THE SCREEN UI (HTML mapped to 3D) */}
          <group position={[0, 0.015, -1.1]} rotation={[-Math.PI / 2, 0, 0]}>
            {/* We position it slightly above the screen mesh surface */}
            <LaptopScreenUI bootPhase={bootPhase as BootPhase} />
          </group>

        </group>
      </group>

      {/* === GROUND SHADOW === */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.5, 3.5]} />
        <meshStandardMaterial
          color="#000000"
          transparent
          opacity={0.4}
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>

      {/* Reflective ground plane */}
      <mesh position={[0, -0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial
          color="#050508"
          metalness={0.9}
          roughness={0.15}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
};

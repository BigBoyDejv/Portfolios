import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";

interface LaptopKeyboardProps {
  lidOpenProgress: number;
}

// Realistic keyboard layout with proper sizing
const KEYBOARD_ROWS = [
  // Row 0: Function row (small keys)
  { keys: 14, keyWidth: 0.155, keyHeight: 0.12, zOffset: -0.72, gap: 0.015 },
  // Row 1: Number row
  { keys: 14, keyWidth: 0.155, keyHeight: 0.15, zOffset: -0.52, gap: 0.015 },
  // Row 2: QWERTY
  { keys: 13, keyWidth: 0.155, keyHeight: 0.15, zOffset: -0.32, gap: 0.015, xOffset: 0.08, hasSpecialLeft: true }, // For Caps Lock / Tab
  // Row 3: ASDF
  { keys: 12, keyWidth: 0.155, keyHeight: 0.15, zOffset: -0.12, gap: 0.015, xOffset: 0.14 },
  // Row 4: ZXCV
  { keys: 11, keyWidth: 0.155, keyHeight: 0.15, zOffset: 0.08, gap: 0.015, xOffset: 0.22 },
  // Row 5: Bottom row (space bar etc.)
  { keys: 8, keyWidth: 0.155, keyHeight: 0.14, zOffset: 0.27, gap: 0.015, xOffset: 0.0, hasSpacebar: true },
];

const KEY_LABELS_ROW1 = ["~", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "+", "DEL"];
const KEY_LABELS_ROW2 = ["TAB", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]"];
const KEY_LABELS_ROW3 = ["CAPS", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'"];
const KEY_LABELS_ROW4 = ["SHIFT", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"];

export const LaptopKeyboard = ({ lidOpenProgress }: LaptopKeyboardProps) => {
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const textMaterialsRef = useRef<THREE.MeshBasicMaterial[]>([]);

  const keys = useMemo(() => {
    const allKeys: {
      x: number;
      z: number;
      w: number;
      h: number;
      isSpecial?: boolean;
      colorHex?: string; // Precomputed color for exact match
      label?: string;
    }[] = [];

    // Helper to determine color based on physical position to match reference
    const getColor = (x: number, z: number, isCapsLock: boolean) => {
      if (isCapsLock) return "#ef4444"; // Red key on the left
      
      const distFromCenter = Math.sqrt(x * x + z * z);
      
      if (x > 0.8 || z < -0.6) {
        return "#06b6d4"; // Cyan/Blue on top and right edges
      } else if (distFromCenter < 0.6) {
        return "#a855f7"; // Glowing purple center
      } else {
        return "#c084fc"; // Fallback softer purple
      }
    };

    KEYBOARD_ROWS.forEach((row, rowIdx) => {
      const xStart = -(row.keys * (row.keyWidth + row.gap)) / 2 + (row.xOffset || 0);

      if (row.hasSpacebar) {
        const smallKeys = [ { w: 0.2, label: "CTRL" }, { w: 0.17 }, { w: 0.17, label: "ALT" }, { w: 0.17 } ];
        let cx = -1.1;
        smallKeys.forEach((sk) => {
          const color = getColor(cx + sk.w / 2, row.zOffset, false);
          allKeys.push({ x: cx + sk.w / 2, z: row.zOffset, w: sk.w, h: row.keyHeight, isSpecial: true, colorHex: color, label: sk.label });
          cx += sk.w + row.gap;
        });
        const spaceColor = getColor(0, row.zOffset, false);
        allKeys.push({ x: 0, z: row.zOffset, w: 0.7, h: row.keyHeight, colorHex: spaceColor });
        cx = 0.42;
        const rightKeys = [{ w: 0.17, label: "ALT" }, { w: 0.17 }, { w: 0.17 }, { w: 0.17, label: "CTRL" }];
        rightKeys.forEach((sk) => {
          const color = getColor(cx + sk.w / 2, row.zOffset, false);
          allKeys.push({ x: cx + sk.w / 2, z: row.zOffset, w: sk.w, h: row.keyHeight, isSpecial: true, colorHex: color, label: sk.label });
          cx += sk.w + row.gap;
        });
      } else {
        for (let col = 0; col < row.keys; col++) {
          const x = xStart + col * (row.keyWidth + row.gap) + row.keyWidth / 2;
          const isCapsLock = rowIdx === 2 && col === 0;
          const color = getColor(x, row.zOffset, isCapsLock);
          
          let label = "";
          if (rowIdx === 1) label = KEY_LABELS_ROW1[col];
          if (rowIdx === 2) label = KEY_LABELS_ROW2[col];
          if (rowIdx === 3) label = KEY_LABELS_ROW3[col];
          if (rowIdx === 4) label = KEY_LABELS_ROW4[col];

          allKeys.push({ x, z: row.zOffset, w: row.keyWidth, h: row.keyHeight, isSpecial: rowIdx === 0, colorHex: color, label });
        }
      }
    });

    return allKeys;
  }, []);

  const keyCapGeo = useMemo(() => new THREE.BoxGeometry(1, 1, 1, 1, 1, 1), []);
  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#0a0a10", metalness: 0.4, roughness: 0.8, transparent: true, opacity: 0.95 }), []);
  const topMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#08080e", metalness: 0.3, roughness: 0.9 }), []);

  useFrame(() => {
    // Fade in lights automatically as lid opens
    const baseIntensity = lidOpenProgress > 0.5 ? (lidOpenProgress - 0.5) * 2 : 0;
    
    // Animate underglow smoothly
    materialsRef.current.forEach((mat) => {
      if (mat) {
        mat.emissiveIntensity = baseIntensity * 0.8;
      }
    });

    // Make letters glow brightly as well
    textMaterialsRef.current.forEach((mat) => {
      if (mat) {
        mat.opacity = baseIntensity;
        // Text is a bit brighter to create the vivid shine effect
        mat.color.multiplyScalar(baseIntensity > 0 ? 1 : 0);
      }
    });
  });

  return (
    <group position={[0, 0.085, -0.15]}>
      {/* Keyboard plate */}
      <mesh position={[0, -0.005, 0]}>
        <boxGeometry args={[2.85, 0.008, 1.2]} />
        <meshStandardMaterial color="#040408" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Individual keys */}
      {keys.map((key, i) => (
        <group key={i} position={[key.x, 0.012, key.z]}>
          <mesh geometry={keyCapGeo} scale={[key.w - 0.01, 0.022, key.h - 0.01]} material={bodyMat} />
          
          <mesh position={[0, 0.012, 0]} material={topMat}>
            <boxGeometry args={[key.w - 0.025, 0.003, key.h - 0.025]} />
          </mesh>

          {/* Letter on the keycap shining colorfully */}
          {key.label && (
            <Text
              position={[-key.w / 2 + 0.03, 0.014, -key.h / 2 + 0.03]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.035}
              anchorX="left"
              anchorY="top"
            >
              {key.label}
              <meshBasicMaterial 
                ref={(el) => { if (el) textMaterialsRef.current[i] = el; }}
                color={Math.random() > 0.5 ? key.colorHex : "#ffffff"} // Mostly colored, some white for variety
                transparent
                opacity={0}
              />
            </Text>
          )}

          {/* Static RGB underglow matching the reference image perfectly */}
          <mesh position={[0, -0.008, 0]}>
            <boxGeometry args={[key.w - 0.015, 0.004, key.h - 0.015]} />
            <meshStandardMaterial
              ref={(el) => { if (el) materialsRef.current[i] = el; }}
              color="#000000"
              emissive={key.colorHex}
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

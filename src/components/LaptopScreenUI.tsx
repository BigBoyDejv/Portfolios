import { Html } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export type BootPhase = "off" | "opening" | "spinner" | "loading" | "title" | "ready" | "zooming" | "completed";

interface LaptopScreenUIProps {
  bootPhase: BootPhase;
}

export const LaptopScreenUI = ({ bootPhase }: LaptopScreenUIProps) => {
  // Zvyšovanie progressu pre loading fázach tu v 3D nepotrebujeme, pretože 
  // 3D obrazovka svieti s obsahom až od "title", kedy 2D BootSequence zmizne.
  const isTargetVisible = bootPhase === "title" || bootPhase === "ready" || bootPhase === "zooming" || bootPhase === "completed";

  return (
    <Html
      transform
      position={[0, 0.015, -1.1]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={0.00218}
    >
      <div
        className={`w-[1280px] h-[820px] bg-[#05050A] text-white flex flex-col items-center justify-center relative overflow-hidden transition-all duration-1000 ${isTargetVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ boxShadow: 'inset 0 0 150px rgba(168, 85, 247, 0.15)' }}
      >
        {/* Jemné particle efekty (štvorčeky) na pozadí */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-[20%] left-[15%] w-12 h-12 border-2 border-[#e81cff]/40 rounded-sm" />
          <div className="absolute top-[30%] right-[30%] w-8 h-8 border border-[#00f0ff]/40 rounded-sm" />
          <div className="absolute bottom-[20%] left-[25%] w-16 h-16 border border-[#e81cff]/20 rounded-sm" />
          <div className="absolute top-[10%] right-[10%] w-6 h-6 border-2 border-[#00f0ff]/30 rounded-sm" />
          <div className="absolute bottom-[40%] right-[15%] w-24 h-24 border border-[#e81cff]/10 rounded-sm" />
        </div>

        <AnimatePresence mode="wait">
          {/* 3. Title Phase & 4. Ready Phase */}
          {isTargetVisible && (
            <motion.div
              key="loaded"
              className="absolute inset-0 flex flex-col items-center justify-center z-10 w-full h-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              {/* Veľký Text DAVIDLOPER hore */}
              <motion.h1
                className="absolute top-16 text-5xl font-bold font-display tracking-[0.4em] text-white"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                style={{ textShadow: "0 0 40px rgba(255,255,255,0.8)" }}
              >
                DAVIDLOPER
              </motion.h1>

              {/* Informácie vpravo dole */}
              <motion.div
                className="absolute right-16 bottom-16 text-right"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <div className="text-white font-bold tracking-[0.4em] text-2xl mb-2">PORTFOLIO</div>
                <div className="text-gray-500 font-mono text-sm tracking-[0.3em]">VERSION 2026.0</div>
              </motion.div>

              {/* Veľký split neonový kruh uprostred */}
              <motion.div
                className="relative w-96 h-96 flex items-center justify-center mt-8"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
              >
                {/* Ľavá polovica (Magenta) */}
                <motion.div
                  className="absolute inset-0 rounded-full border-[14px] border-transparent"
                  style={{
                    borderLeftColor: '#e81cff',
                    borderBottomColor: '#e81cff',
                    transform: 'rotate(45deg)',
                    boxShadow: '-10px 10px 80px rgba(232, 28, 255, 0.4), inset -10px 10px 80px rgba(232, 28, 255, 0.4)'
                  }}
                  animate={{ rotate: [45, 65, 45] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Pravá polovica (Cyan) */}
                <motion.div
                  className="absolute inset-0 rounded-full border-[14px] border-transparent"
                  style={{
                    borderRightColor: '#00f0ff',
                    borderTopColor: '#00f0ff',
                    transform: 'rotate(45deg)',
                    boxShadow: '10px -10px 80px rgba(0, 240, 255, 0.4), inset 10px -10px 80px rgba(0, 240, 255, 0.4)'
                  }}
                  animate={{ rotate: [45, 25, 45] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />

                {/* Uprostred kruhu "SYSTEM READY" */}
                <div className="text-white/90 font-mono tracking-widest text-xl absolute uppercase font-bold" style={{ textShadow: "0 0 15px rgba(255,255,255,0.5)" }}>
                  SYSTEM READY
                </div>
              </motion.div>

              {/* 4. Ready Phase - Animované SCROLL šípky */}
              <AnimatePresence>
                {bootPhase === "ready" && (
                  <motion.div
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.p
                      className="text-white font-mono text-2xl tracking-[0.4em] font-bold mb-2 ml-2" // ml-2 na vycentrovanie s trackingom
                      animate={{
                        opacity: [0.3, 1, 0.3],
                        textShadow: ["0 0 10px rgba(0,240,255,0)", "0 0 25px rgba(0,240,255,1), 0 0 15px rgba(232,28,255,1)", "0 0 10px rgba(0,240,255,0)"]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      SCROLL
                    </motion.p>

                    <div className="flex flex-col items-center">
                      <motion.div
                        animate={{ opacity: [0.2, 1, 0.2], y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0, ease: "easeInOut" }}
                      >
                        <ChevronDown className="w-10 h-10 text-[#00f0ff]" style={{ filter: "drop-shadow(0 0 10px rgba(0,240,255,0.8))" }} />
                      </motion.div>
                      <motion.div
                        className="-mt-6"
                        animate={{ opacity: [0.2, 1, 0.2], y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.15, ease: "easeInOut" }}
                      >
                        <ChevronDown className="w-10 h-10 text-[#e81cff]" style={{ filter: "drop-shadow(0 0 10px rgba(232,28,255,0.8))" }} />
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Html>
  );
};

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export type BootPhase = "off" | "opening" | "spinner" | "loading" | "title" | "ready" | "zooming" | "completed";

interface BootSequenceProps {
    bootPhase: BootPhase;
    showContent: boolean;
}

const BootSequence = ({ bootPhase, showContent }: BootSequenceProps) => {
    const [loadProgress, setLoadProgress] = useState(0);

    useEffect(() => {
        if (bootPhase === "loading" || bootPhase === "spinner") {
            setLoadProgress(0);
            const interval = setInterval(() => {
                setLoadProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 2.5; // ~1.5s
                });
            }, 40);
            return () => clearInterval(interval);
        } else if (bootPhase === "title" || bootPhase === "ready") {
            setLoadProgress(100);
        }
    }, [bootPhase]);

    if (showContent) return null;

    // Viditeľné počas úvodných fáz
    const isVisible = bootPhase !== "off" && bootPhase !== "opening" && bootPhase !== "zooming" && bootPhase !== "completed";

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-40 flex flex-col items-center justify-center pointer-events-none bg-black/40 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Subtle scanning line effect overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.1)_51%)] bg-[length:100%_4px] opacity-20" />

                    <div className="relative flex flex-col items-center justify-center w-full h-full max-w-4xl mx-auto z-10">
                        <AnimatePresence mode="wait">
                            {/* === SPINNER PHASE === */}
                            {bootPhase === "spinner" && (
                                <motion.div
                                    key="spinner"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <motion.div
                                        className="w-24 h-24 border-[6px] border-[#e81cff]/30 border-t-[#00f0ff] rounded-full shadow-[0_0_30px_rgba(0,240,255,0.4)]"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                </motion.div>
                            )}

                            {/* === LOADING PHASE === */}
                            {bootPhase === "loading" && (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center gap-6"
                                >
                                    <div className="w-full max-w-md flex justify-between px-2 text-[#00f0ff] font-mono text-sm tracking-widest uppercase mb-2 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">
                                        <span>SYSTEM INITIALIZING...</span>
                                        <span className="text-[#e81cff] drop-shadow-[0_0_8px_rgba(232,28,255,0.8)]">
                                            {Math.floor(loadProgress)}%
                                        </span>
                                    </div>

                                    {/* Progress bar so glowom */}
                                    <div className="w-full max-w-md h-3 bg-gray-950/80 backdrop-blur-md rounded-full overflow-hidden border border-gray-800 shadow-[0_0_20px_rgba(232,28,255,0.2)]">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-[#e81cff] to-[#00f0ff] relative"
                                            style={{ width: `${loadProgress}%` }}
                                        >
                                            <div className="absolute right-0 top-0 bottom-0 w-8 bg-white/50 blur-[2px]" />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}

                            {/* === TITLE & READY PHASE === */}
                            {(bootPhase === "title" || bootPhase === "ready") && (
                                <motion.div
                                    key="title-ready"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 1 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center"
                                >
                                    {/* Hlavný nadpis */}
                                    <motion.h1
                                        className="absolute top-[20%] text-5xl md:text-7xl font-bold font-display tracking-[0.4em] text-white text-center"
                                        initial={{ opacity: 0, y: -30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 1, delay: 0.2 }}
                                        style={{ textShadow: "0 0 40px rgba(255,255,255,0.6), 0 0 80px rgba(0,240,255,0.3)" }}
                                    >
                                        DAVIDLOPER
                                    </motion.h1>

                                    {/* Informačný badge v rohu */}
                                    <div className="absolute top-8 right-8 text-right hidden md:block opacity-70">
                                        <div className="text-white font-bold tracking-[0.4em] text-xl">PORTFOLIO</div>
                                        <div className="text-[#00f0ff] font-mono text-xs tracking-[0.3em] mt-1">SYS.VER.2026</div>
                                    </div>

                                    {/* Uprostred split circle grafika */}
                                    <motion.div
                                        className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center mt-8"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.3, duration: 1 }}
                                    >
                                        <motion.div
                                            className="absolute inset-0 rounded-full border-[6px] md:border-[10px] border-transparent"
                                            style={{ borderLeftColor: "#e81cff", borderBottomColor: "#e81cff", transform: "rotate(45deg)", boxShadow: "-5px 5px 30px rgba(232,28,255,0.3)" }}
                                            animate={{ rotate: [45, 65, 45] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        />
                                        <motion.div
                                            className="absolute inset-0 rounded-full border-[6px] md:border-[10px] border-transparent"
                                            style={{ borderRightColor: "#00f0ff", borderTopColor: "#00f0ff", transform: "rotate(45deg)", boxShadow: "5px -5px 30px rgba(0,240,255,0.3)" }}
                                            animate={{ rotate: [45, 25, 45] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                        />
                                        <div className="text-white/90 font-mono tracking-[0.3em] text-sm md:text-lg absolute uppercase font-bold drop-shadow-md text-center">
                                            SYSTEM READY
                                        </div>
                                    </motion.div>

                                    {/* Ready Phase - Scroll hint naspodku */}
                                    <AnimatePresence>
                                        {bootPhase === "ready" && (
                                            <motion.div
                                                className="absolute bottom-[10%] flex flex-col items-center gap-2"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <motion.p
                                                    className="text-white font-mono text-xl md:text-2xl tracking-[0.4em] font-bold mb-2 ml-[0.4em]"
                                                    animate={{
                                                        opacity: [0.4, 1, 0.4],
                                                        textShadow: [
                                                            "0 0 10px rgba(0,240,255,0)",
                                                            "0 0 25px rgba(0,240,255,0.8), 0 0 15px rgba(232,28,255,0.8)",
                                                            "0 0 10px rgba(0,240,255,0)"
                                                        ]
                                                    }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                                >
                                                    SCROLL
                                                </motion.p>

                                                <div className="flex flex-col items-center pointer-events-auto cursor-pointer animate-pulse">
                                                    <motion.div
                                                        animate={{ opacity: [0.2, 1, 0.2], y: [0, 8, 0] }}
                                                        transition={{ duration: 1.5, repeat: Infinity, delay: 0, ease: "easeInOut" }}
                                                    >
                                                        <ChevronDown className="w-8 h-8 md:w-10 md:h-10 text-[#00f0ff]" style={{ filter: "drop-shadow(0 0 8px rgba(0,240,255,0.8))" }} />
                                                    </motion.div>
                                                    <motion.div
                                                        className="-mt-5 md:-mt-6"
                                                        animate={{ opacity: [0.2, 1, 0.2], y: [0, 8, 0] }}
                                                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.15, ease: "easeInOut" }}
                                                    >
                                                        <ChevronDown className="w-8 h-8 md:w-10 md:h-10 text-[#e81cff]" style={{ filter: "drop-shadow(0 0 8px rgba(232,28,255,0.8))" }} />
                                                    </motion.div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BootSequence;

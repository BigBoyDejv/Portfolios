import { useState, useEffect } from "react";
import LaptopScene from "@/components/LaptopScene";
import ScreenContent from "@/components/ScreenContent";
import Particles from "@/components/Particles";
import BootSequence from "@/components/BootSequence";

export type BootPhase = "off" | "opening" | "spinner" | "loading" | "title" | "ready" | "zooming" | "completed";

const Index = () => {
  const [bootPhase, setBootPhase] = useState<BootPhase>("off");
  const [lidOpenProgress, setLidOpenProgress] = useState(0);
  const [autoZoomProgress, setAutoZoomProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);

    // Boot timeline
    const t1 = setTimeout(() => {
      setBootPhase("opening");
      const startTime = Date.now();
      const duration = 2000;
      const animateLid = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setLidOpenProgress(eased);
        if (progress < 1) {
          requestAnimationFrame(animateLid);
        }
      };
      requestAnimationFrame(animateLid);
    }, 1500);

    // Screen boot steps
    const t2 = setTimeout(() => setBootPhase("spinner"), 3000);
    const t3 = setTimeout(() => setBootPhase("loading"), 4000);
    const t4 = setTimeout(() => setBootPhase("title"), 5500);
    const t5 = setTimeout(() => setBootPhase("ready"), 7000);
    // At 'ready', the UI instructs to scroll.

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  // Handle the scroll trigger
  useEffect(() => {
    if (bootPhase !== "ready") return;

    const handleScrollTrigger = () => {
      // Prevent multiple triggers
      if (bootPhase !== "ready") return;

      setBootPhase("zooming");

      const startTime = Date.now();
      const duration = 1200; // Aggressive fast zoom

      const animateZoom = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Exponential ease in for a dramatic pulling-in effect
        const eased = progress < 0.5 ? 4 * Math.pow(progress, 3) : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        setAutoZoomProgress(eased);
        if (progress < 1) {
          requestAnimationFrame(animateZoom);
        } else {
          setBootPhase("completed");
        }
      };
      requestAnimationFrame(animateZoom);
    };

    window.addEventListener("wheel", handleScrollTrigger, { once: true });
    window.addEventListener("touchstart", handleScrollTrigger, { once: true });
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") handleScrollTrigger();
    }, { once: true });

    return () => {
      window.removeEventListener("wheel", handleScrollTrigger);
      window.removeEventListener("touchstart", handleScrollTrigger);
    };
  }, [bootPhase]);

  // Pass globally for the 3D Html UI
  useEffect(() => {
    (window as unknown as { __bootPhase: BootPhase }).__bootPhase = bootPhase;
  }, [bootPhase]);

  // Lock scroll completely until the sequence is completed, 
  // we capture wheel manually for the trigger.
  const isSequenceCompleted = bootPhase === "completed";

  useEffect(() => {
    if (!isSequenceCompleted) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSequenceCompleted]);

  let screenOpacity = 0;
  if (isSequenceCompleted) {
    screenOpacity = 1;
  } else if (autoZoomProgress > 0.8) {
    screenOpacity = (autoZoomProgress - 0.8) / 0.2;
  }

  const pointerEvents = screenOpacity > 0.5 ? "auto" : "none";
  let sceneOpacity = 1;
  if (isSequenceCompleted) {
    sceneOpacity = 0;
  } else if (autoZoomProgress > 0.95) {
    sceneOpacity = 1 - ((autoZoomProgress - 0.95) / 0.05);
  }

  return (
    <div className="min-h-screen bg-[#05050A] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1e0a30] via-[#05050A] to-[#010103] relative selection:bg-[#e81cff]/30 overflow-hidden">
      <Particles />

      {/* 3D Scene */}
      {!isMobile && sceneOpacity > 0 && (
        <div
          className="fixed inset-0 z-20 pointer-events-none"
          style={{
            opacity: sceneOpacity,
            filter: autoZoomProgress > 0.8 ? `blur(${autoZoomProgress * 15}px)` : "none",
          }}
        >
          <LaptopScene scrollProgress={autoZoomProgress} lidOpenProgress={lidOpenProgress} bootPhase={bootPhase} />
        </div>
      )}

      {/* 2D Boot Sequence Overlay */}
      {!isMobile && (
        <BootSequence bootPhase={bootPhase} showContent={isSequenceCompleted} />
      )}

      {/* Main content */}
      <ScreenContent opacity={isMobile ? 1 : screenOpacity} pointerEvents={isMobile ? "auto" : pointerEvents} />
    </div>
  );
};

export default Index;

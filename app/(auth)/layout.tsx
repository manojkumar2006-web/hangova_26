"use client";
import { useRef, useCallback } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -10;
      const rotY = ((x - cx) / cx) * 10;
      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
  }, []);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center overflow-hidden relative"
      style={{ background: "#050507" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Animated blobs ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute" style={{
          top: "-20%", left: "-15%", width: 700, height: 700, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,111,255,0.18) 0%, transparent 65%)",
          filter: "blur(60px)", animation: "blob1 12s ease-in-out infinite alternate"
        }} />
        <div className="absolute" style={{
          bottom: "-25%", right: "-10%", width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 65%)",
          filter: "blur(80px)", animation: "blob2 15s ease-in-out infinite alternate"
        }} />
        <div className="absolute" style={{
          top: "35%", right: "20%", width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168,139,250,0.09) 0%, transparent 70%)",
          filter: "blur(50px)", animation: "blob3 9s ease-in-out infinite alternate"
        }} />
      </div>

      {/* ── Grid overlay ── */}
      <div className="pointer-events-none absolute inset-0" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)",
        backgroundSize: "56px 56px"
      }} />

      {/* ── 3D Card ── */}
      <div
        ref={cardRef}
        className="relative z-10 w-full mx-4"
        style={{
          maxWidth: 460,
          transition: "transform 0.15s ease-out",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Gradient border shell */}
        <div style={{
          background: "linear-gradient(135deg, rgba(124,111,255,0.5) 0%, rgba(99,91,204,0.15) 40%, rgba(168,139,250,0.4) 100%)",
          borderRadius: 28, padding: 1.5,
          boxShadow: "0 0 60px rgba(124,111,255,0.2), 0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,111,255,0.08)",
        }}>
          <div style={{
            background: "linear-gradient(145deg, rgba(18,16,32,0.97) 0%, rgba(10,9,20,0.99) 100%)",
            borderRadius: 27, padding: "40px 36px",
            backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)",
            position: "relative", overflow: "hidden",
          }}>
            {/* Inner shimmer top */}
            <div style={{
              position: "absolute", top: 0, left: "10%", right: "10%", height: 1,
              background: "linear-gradient(90deg, transparent, rgba(168,139,250,0.6), transparent)",
            }} />
            {/* Inner glow center */}
            <div style={{
              position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)",
              width: 300, height: 200,
              background: "radial-gradient(ellipse, rgba(124,111,255,0.08) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            {children}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob1 { from { transform: translate(0,0) scale(1); } to { transform: translate(60px,40px) scale(1.1); } }
        @keyframes blob2 { from { transform: translate(0,0) scale(1); } to { transform: translate(-40px,-60px) scale(1.15); } }
        @keyframes blob3 { from { transform: translate(0,0) scale(1); } to { transform: translate(30px,-30px) scale(0.9); } }
      `}</style>
    </div>
  );
}

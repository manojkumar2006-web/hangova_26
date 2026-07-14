export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-10"
      style={{ background: "#080808" }}>

      {/* Ambient glow blobs */}
      <div className="pointer-events-none select-none" aria-hidden>
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,111,255,0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(99,179,237,0.07) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,111,255,0.05) 0%, transparent 70%)", filter: "blur(30px)" }} />
      </div>

      {/* Grid overlay */}
      <div className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "48px 48px"
        }} />

      <div className="relative z-10 w-full max-w-[420px]">
        {children}
      </div>
    </div>
  );
}

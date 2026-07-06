function GradientBlobs() {
  return (
    <>
      <div style={{
        position: "fixed",
        top: "-170px",
        left: "-130px",
        zIndex: 0,
        pointerEvents: "none",
      }}>
        <div style={{
          width: "540px",
          height: "540px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.34), transparent 64%)",
          filter: "blur(40px)",
          animation: "ccFloat 16s ease-in-out infinite",
        }} />
      </div>

      <div style={{
        position: "fixed",
        top: "60px",
        right: "-180px",
        zIndex: 0,
        pointerEvents: "none",
      }}>
        <div style={{
          width: "580px",
          height: "580px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168,85,247,0.30), transparent 64%)",
          filter: "blur(40px)",
          animation: "ccFloat 20s ease-in-out infinite",
        }} />
      </div>

      <div style={{
        position: "fixed",
        bottom: "-220px",
        left: "30%",
        zIndex: 0,
        pointerEvents: "none",
      }}>
        <div style={{
          width: "620px",
          height: "620px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(129,140,248,0.18), transparent 66%)",
          filter: "blur(48px)",
          animation: "ccFloat 24s ease-in-out infinite",
        }} />
      </div>
    </>
  );
}

export default GradientBlobs;
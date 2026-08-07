"use client";

interface Props {
  onClose: () => void;
}

export default function LockedFeature({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      <div
        className="animate-modal-in text-center"
        style={{
          width: "min(360px, 92vw)",
          background: "linear-gradient(135deg, rgba(0,0,0,0.95), rgba(20,0,5,0.9))",
          border: "2px solid #ff0040",
          borderRadius: "16px",
          padding: "28px 22px",
          boxShadow: "0 0 50px rgba(255,0,64,0.4), 0 0 100px rgba(255,0,64,0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: "56px", marginBottom: "14px", filter: "drop-shadow(0 0 15px #ff0040)" }}>🔒</div>
        <h3 className="digital-font" style={{ color: "#ff0040", fontSize: "16px", fontWeight: "800", marginBottom: "10px", textShadow: "0 0 10px #ff0040" }}>
          FITUR TERKUNCI V2
        </h3>
        <p className="digital-font" style={{ color: "#ffffff", fontSize: "11px", lineHeight: 1.6, marginBottom: "6px", fontWeight: "600" }}>
          🔒 FITUR INI KHUSUS MEMBER RESELLER/OWNER V2 ULTIMATE.
        </p>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", lineHeight: 1.5, marginBottom: "18px" }}>
          Silakan upgrade akunmu untuk buka 25 bug brutal V2 + Kill Group Real Baileys!
        </p>

        <div style={{
          background: "rgba(255,0,64,0.06)",
          border: "1px solid rgba(255,0,64,0.2)",
          borderRadius: "8px",
          padding: "10px",
          marginBottom: "14px",
        }}>
          <p className="digital-font" style={{ color: "#ffaaaa", fontSize: "9px", margin: 0, lineHeight: 1.5 }}>
            User Basic: Hanya Delay Attack<br />
            Reseller: Full 25 Bug + Kill Group V2 Real<br />
            Owner: All + Logs Lanjutan
          </p>
        </div>

        <a
          href={`https://wa.me/6283115955196?text=${encodeURIComponent("Halo Admin BimzOfficial, saya ingin info upgrade role & pembelian akun BimxzBugxz V2 Black Red Neon")}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            background: "linear-gradient(135deg, #000, #ff0040)",
            color: "#fff",
            padding: "12px",
            borderRadius: "10px",
            textDecoration: "none",
            fontSize: "12px",
            fontWeight: "800",
            marginBottom: "10px",
            border: "1.5px solid #ff0040",
            boxShadow: "0 0 20px rgba(255,0,64,0.4)",
            letterSpacing: "0.5px",
          }}
        >
          📞 HUBUNGI DEVELOPER / UPGRADE V2
        </a>
        <button
          onClick={onClose}
          style={{
            padding: "8px 20px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "6px",
            color: "rgba(255,255,255,0.7)",
            fontSize: "11px",
            cursor: "pointer",
            width: "100%",
            fontWeight: "600",
          }}
        >
          TUTUP ✕
        </button>
      </div>
    </div>
  );
}

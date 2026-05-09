import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function Navbar({ dark, toggleDark }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "1.25rem 2.5rem",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      backgroundColor: scrolled ? "var(--bg)" : "transparent",
      borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      transition: "all 0.3s ease",
    }}>
      <a href="#hero" style={{ textDecoration: "none", display: "flex", alignItems: "baseline", gap: "2px" }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 900, color: "var(--text)", fontStyle: "italic" }}>CK</span>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--text)", display: "inline-block", marginLeft: 2, marginBottom: 4 }} />
      </a>

      <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
        {["About", "Projects", "Skills", "Contact"].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500, letterSpacing: "0.05em", transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = "var(--text)"}
            onMouseLeave={e => e.target.style.color = "var(--text-muted)"}
          >
            {l}
          </a>
        ))}
        <button onClick={toggleDark} style={{ background: "none", border: "1px solid var(--border)", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "none", color: "var(--text-muted)" }}>
          {dark ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>
    </nav>
  );
}
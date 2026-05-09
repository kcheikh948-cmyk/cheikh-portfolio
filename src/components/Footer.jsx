export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", padding: "2rem 2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 900, fontStyle: "italic", color: "var(--text)" }}>Cheikh Kamel.</span>
      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", letterSpacing: "0.08em" }}>© 2025 — All rights reserved · Bytwo Studio</span>
      <a href="#hero" style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text)", textDecoration: "none" }}>Back to top ↑</a>
    </footer>
  );
}
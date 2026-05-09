export default function Skills({ skills }) {
  const categories = [
    { key: "design", label: "Design", color: "#000" },
    { key: "development", label: "Development", color: "#000" },
    { key: "other", label: "Other", color: "#000" },
  ];

  return (
    <section id="skills" style={{ padding: "8rem 2.5rem", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "4rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "1rem" }}>— Skills & Tools</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.03em", color: "var(--text)" }}>
              What I<br /><span style={{ fontStyle: "italic" }}>work with</span>
            </h2>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "var(--border)", border: "1px solid var(--border)" }}>
          {categories.map((cat) => (
            <div key={cat.key} style={{ background: "var(--bg)", padding: "2.5rem" }}>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "2rem", paddingBottom: "1rem", borderBottom: "1px solid var(--border)" }}>
                {cat.label}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {(skills[cat.key] || []).map((skill) => (
                  <div key={skill} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--text)", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--text)" }}>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
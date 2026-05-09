import { MapPin, Clock, GraduationCap, Briefcase } from "lucide-react";

export default function About({ profile }) {
  const stats = [
    { icon: <MapPin size={18} />, label: "Based in", value: profile.country },
    { icon: <Clock size={18} />, label: "Experience", value: profile.experience },
    { icon: <GraduationCap size={18} />, label: "Education", value: profile.education },
    { icon: <Briefcase size={18} />, label: "Status", value: profile.availability },
  ];

  return (
    <section
      id="about"
      style={{
        padding: "6rem 1.5rem",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <p
        style={{
          fontSize: "0.8rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--accent)",
          marginBottom: "0.75rem",
        }}
      >
        About
      </p>
      <h2
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
          color: "var(--text)",
          marginBottom: "1.5rem",
          letterSpacing: "-0.02em",
        }}
      >
        Who I Am
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3rem",
          alignItems: "start",
        }}
        className="about-grid"
      >
        <div>
          <p
            style={{
              color: "var(--text)",
              fontSize: "1rem",
              lineHeight: 1.8,
              marginBottom: "1.5rem",
            }}
          >
            {profile.about}
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.8 }}>
            I'm also a co-founder of{" "}
            <span style={{ color: "var(--accent)", fontWeight: 600 }}>Bytwo</span> — a small
            studio where we build full-stack web and mobile applications for businesses that
            want quality over quantity.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "1rem 1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <span style={{ color: "var(--accent)" }}>{s.icon}</span>
              <div>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 2 }}>
                  {s.label}
                </p>
                <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text)" }}>
                  {s.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </section>
  );
}

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import ProjectModal from "./ProjectModal";

const tabs = [
  { key: "websites", label: "Websites & Apps", symbol: "○" },
  { key: "logos", label: "Logos & Brands", symbol: "✦" },
];

function ProjectCard({ project, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer",
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        overflow: "hidden",
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
        boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.15)" : "0 2px 8px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      {/* Image — white background, full image visible */}
      <div style={{
        width: "100%",
        paddingBottom: "65%",
        position: "relative",
        background: "#ffffff",
        overflow: "hidden",
      }}>
        {project.main_image || project.mainImage ? (
          <img
            src={project.main_image || project.mainImage}
            alt={project.title}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              padding: "1.5rem",
              transition: "transform 0.4s ease",
              transform: hovered ? "scale(1.05)" : "scale(1)",
            }}
          />
        ) : (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#ddd", fontSize: "3rem",
          }}>
            {tabs.find(t => t.key === project.category)?.symbol || "✦"}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {(project.tags || []).slice(0, 2).map(tag => (
              <span key={tag} style={{
                fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em",
                textTransform: "uppercase", color: "var(--text-muted)",
                border: "1px solid var(--border)", padding: "2px 8px", borderRadius: "4px",
              }}>
                {tag}
              </span>
            ))}
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>
            {project.year}
          </span>
        </div>

        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.15rem", fontWeight: 700,
          color: "var(--text)", marginBottom: "0.4rem", lineHeight: 1.2,
        }}>
          {project.title}
        </h3>

        <p style={{
          fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.6,
          marginBottom: "1rem",
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {project.short_desc || project.shortDesc}
        </p>

        <div style={{
          display: "flex", alignItems: "center", gap: "0.4rem",
          fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: hovered ? "var(--text)" : "var(--text-muted)",
          transition: "color 0.2s",
        }}>
          View details <ArrowUpRight size={13} />
        </div>
      </div>
    </div>
  );
}

export default function Projects({ projects }) {
  const [activeTab, setActiveTab] = useState("websites");
  const [selected, setSelected] = useState(null);
  const current = projects[activeTab] || [];

  return (
    <section id="projects" style={{ padding: "8rem 2.5rem", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", flexWrap: "wrap", gap: "2rem" }}>
          <div>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "1rem" }}>— Work</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.03em", color: "var(--text)" }}>
              Selected<br /><span style={{ fontStyle: "italic" }}>Projects</span>
            </h2>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                style={{
                  padding: "0.6rem 1.25rem",
                  borderRadius: "99px",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  background: activeTab === t.key ? "var(--text)" : "transparent",
                  color: activeTab === t.key ? "var(--bg)" : "var(--text-muted)",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                {t.symbol} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {current.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}>
            {current.map(p => (
              <ProjectCard key={p.id} project={p} onClick={() => setSelected(p)} />
            ))}
          </div>
        ) : (
          <div style={{
            padding: "6rem 2rem", textAlign: "center",
            color: "var(--text-muted)", border: "1px dashed var(--border)",
            borderRadius: "16px",
          }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontStyle: "italic" }}>No projects yet</p>
            <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>Add some from the admin panel</p>
          </div>
        )}
      </div>

      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
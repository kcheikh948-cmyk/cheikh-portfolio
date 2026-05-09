import { useState } from "react";
import { X, ExternalLink, ArrowLeft, ArrowRight } from "lucide-react";

export default function ProjectModal({ project, onClose }) {
  const [activeImg, setActiveImg] = useState(0);
  const screenshots = project.screenshots?.length ? project.screenshots : project.main_image ? [project.main_image] : [];

  const prev = () => setActiveImg(i => (i - 1 + screenshots.length) % screenshots.length);
  const next = () => setActiveImg(i => (i + 1) % screenshots.length);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          width: "100%",
          maxWidth: "900px",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
          animation: "fadeUp 0.25s ease",
        }}
      >
        {/* Close */}
        <button onClick={onClose} style={{
          position: "absolute", top: "1rem", right: "1rem",
          background: "var(--bg)", border: "1px solid var(--border)",
          padding: "8px", cursor: "pointer", color: "var(--text)",
          display: "flex", alignItems: "center", zIndex: 10,
        }}>
          <X size={18} />
        </button>

        {/* Image viewer — full width, fully visible */}
        {screenshots.length > 0 && (
          <div style={{ position: "relative", background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
            <div style={{
              width: "100%",
              paddingBottom: "56%",
              position: "relative",
              overflow: "hidden",
            }}>
              <img
                src={screenshots[activeImg]}
                alt=""
                style={{
                  position: "absolute", inset: 0,
                  width: "100%", height: "100%",
                  objectFit: "contain",
                  padding: "1.5rem",
                }}
              />
            </div>

            {/* Navigation arrows */}
            {screenshots.length > 1 && (
              <>
                <button onClick={prev} style={{
                  position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)",
                  background: "var(--bg-card)", border: "1px solid var(--border)",
                  padding: "10px", cursor: "pointer", color: "var(--text)", display: "flex",
                }}>
                  <ArrowLeft size={18} />
                </button>
                <button onClick={next} style={{
                  position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)",
                  background: "var(--bg-card)", border: "1px solid var(--border)",
                  padding: "10px", cursor: "pointer", color: "var(--text)", display: "flex",
                }}>
                  <ArrowRight size={18} />
                </button>
              </>
            )}

            {/* Counter */}
            {screenshots.length > 1 && (
              <div style={{
                position: "absolute", bottom: "1rem", right: "1rem",
                background: "var(--text)", color: "var(--bg)",
                padding: "3px 10px", fontSize: "0.75rem", fontWeight: 700,
              }}>
                {activeImg + 1} / {screenshots.length}
              </div>
            )}
          </div>
        )}

        {/* Thumbnail strip */}
        {screenshots.length > 1 && (
          <div style={{
            display: "flex", gap: "4px", padding: "0.75rem",
            background: "var(--bg)", borderBottom: "1px solid var(--border)",
            overflowX: "auto",
          }}>
            {screenshots.map((src, i) => (
              <div
                key={i}
                onClick={() => setActiveImg(i)}
                style={{
                  width: 72, height: 50, flexShrink: 0,
                  cursor: "pointer", overflow: "hidden",
                  border: `2px solid ${i === activeImg ? "var(--text)" : "transparent"}`,
                  transition: "border-color 0.2s",
                }}
              >
                <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <div style={{ padding: "2rem" }}>
          {/* Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
            {(project.tags || []).map(tag => (
              <span key={tag} style={{
                fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em",
                textTransform: "uppercase", border: "1px solid var(--border)",
                padding: "3px 10px", color: "var(--text-muted)",
              }}>
                {tag}
              </span>
            ))}
            {project.year && (
              <span style={{
                fontSize: "0.7rem", fontWeight: 700,
                background: "var(--text)", color: "var(--bg)",
                padding: "3px 10px",
              }}>
                {project.year}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
            fontWeight: 900, color: "var(--text)",
            marginBottom: "2rem", lineHeight: 1.1,
          }}>
            {project.title}
          </h2>

          {/* Problem + Solution */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "var(--border)", marginBottom: "2rem" }} className="modal-grid">
            <div style={{ padding: "1.5rem", background: "var(--bg)" }}>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#ef4444", marginBottom: "0.75rem" }}>
                ✕ The Problem
              </p>
              <p style={{ fontSize: "0.9rem", color: "var(--text)", lineHeight: 1.7 }}>{project.problem}</p>
            </div>
            <div style={{ padding: "1.5rem", background: "var(--bg)" }}>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#22c55e", marginBottom: "0.75rem" }}>
                ✓ The Solution
              </p>
              <p style={{ fontSize: "0.9rem", color: "var(--text)", lineHeight: 1.7 }}>{project.solution}</p>
            </div>
          </div>

          {/* Live URL */}
          {project.live_url && project.live_url !== "#" && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                background: "var(--text)", color: "var(--bg)",
                padding: "0.75rem 1.5rem", fontWeight: 700,
                fontSize: "0.8rem", textDecoration: "none",
                letterSpacing: "0.08em", textTransform: "uppercase",
              }}
            >
              View Live Project <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>

      <style>{`.modal-grid { @media(max-width:600px){grid-template-columns:1fr!important} }`}</style>
    </div>
  );
}
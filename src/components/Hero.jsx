import { useEffect, useRef } from "react";
import { ArrowUpRight, ArrowDown } from "lucide-react";

export default function Hero({ profile }) {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    const move = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX - 6 + "px";
        cursorRef.current.style.top = e.clientY - 6 + "px";
      }
      if (followerRef.current) {
        setTimeout(() => {
          followerRef.current.style.left = e.clientX - 18 + "px";
          followerRef.current.style.top = e.clientY - 18 + "px";
        }, 80);
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const roles = ["Web Developer", "UI/UX Designer", "Brand Designer", "Full-Stack Dev"];

  return (
    <>
      <div ref={cursorRef} className="cursor" />
      <div ref={followerRef} className="cursor-follower" />

      <section id="hero" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 2.5rem", position: "relative", overflow: "hidden" }}>

        {/* Year label top right */}
        <div className="animate-fadeUp delay-1" style={{ position: "absolute", top: "7rem", right: "2.5rem" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)" }}>© 2025</span>
        </div>

        {/* Main content */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "4rem", alignItems: "center", maxWidth: "1300px", width: "100%" }}>

          {/* Left side — text */}
          <div>
            <p className="animate-fadeUp delay-1" style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
             Part of Bytwo Studio
            </p>

            {/* Big title */}
            <div style={{ marginBottom: "2rem" }}>
              <h1 className="animate-fadeUp delay-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3.5rem, 8vw, 8rem)", fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.03em", color: "var(--text)", marginBottom: "0.1em" }}>
                Full Stack
              </h1>
              <h1 className="animate-fadeUp delay-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3.5rem, 8vw, 8rem)", fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.03em", color: "transparent", WebkitTextStroke: "1.5px var(--text)", fontStyle: "italic" }}>
                Developer &
              </h1>
              <h1 className="animate-fadeUp delay-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3.5rem, 8vw, 8rem)", fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.03em", color: "var(--text)" }}>
                Designer.
              </h1>
            </div>

            <p className="animate-fadeUp delay-4" style={{ fontSize: "1rem", color: "var(--text-muted)", maxWidth: 420, lineHeight: 1.7, marginBottom: "2.5rem" }}>
              {profile.short_bio || profile.shortBio || "I build digital experiences that attract attention and drive results."}
            </p>

            <div className="animate-fadeUp delay-5" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <a href="#projects" style={{ background: "var(--text)", color: "var(--bg)", padding: "0.9rem 2rem", borderRadius: "4px", fontWeight: 700, fontSize: "0.875rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem", letterSpacing: "0.05em", textTransform: "uppercase", fontSize: "0.8rem" }}>
                See My Work <ArrowUpRight size={14} />
              </a>
              <a href="#contact" style={{ background: "transparent", color: "var(--text)", padding: "0.9rem 2rem", borderRadius: "4px", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem", letterSpacing: "0.05em", textTransform: "uppercase", fontSize: "0.8rem", border: "1px solid var(--border)" }}>
                Contact Me
              </a>
            </div>
          </div>

          {/* Right side — photo */}
          <div className="animate-fadeUp delay-3" style={{ position: "relative" }}>
            {/* Decorative box behind photo */}
            <div style={{ position: "absolute", top: 20, left: 20, right: -20, bottom: -20, border: "1px solid var(--border)", borderRadius: "4px", zIndex: 0 }} />

            <div style={{ width: "clamp(240px, 22vw, 340px)", height: "clamp(300px, 28vw, 440px)", borderRadius: "4px", overflow: "hidden", position: "relative", zIndex: 1, filter: "grayscale(20%)" }}>
              {profile.photo ? (
                <img src={profile.photo} alt="Cheikh Kamel" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", background: "var(--bg-card)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border)" }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "4rem", color: "var(--text-muted)", fontStyle: "italic" }}>CK</span>
                </div>
              )}
            </div>

            {/* Floating tag */}
            <div style={{ position: "absolute", bottom: -10, left: -30, background: "var(--text)", color: "var(--bg)", padding: "0.6rem 1rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", zIndex: 2 }}>
              Cheikh Kamel
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: "2rem", left: "2.5rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          <ArrowDown size={12} />
          Scroll
        </div>

        {/* Roles marquee */}
        <div style={{ position: "absolute", bottom: "2rem", right: 0, left: "40%", overflow: "hidden", borderTop: "1px solid var(--border)", paddingTop: "0.75rem" }}>
          <div className="marquee-track" style={{ display: "flex", gap: "3rem", whiteSpace: "nowrap", width: "max-content" }}>
            {[...roles, ...roles].map((r, i) => (
              <span key={i} style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                {r} ✦
              </span>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.5)} }
      `}</style>
    </>
  );
}
import { FaEnvelope, FaWhatsapp, FaFacebook, FaTiktok } from "react-icons/fa";

export default function Contact({ contact }) {
  const items = [
    {
      key: "email",
      label: "Email",
      icon: <FaEnvelope size={22} />,
      color: "#ef4444",
      description: "For project inquiries",
      display: contact.email,
      href: contact.email ? `mailto:${contact.email}` : null,
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      icon: <FaWhatsapp size={22} />,
      color: "#22c55e",
      description: "Quick chat",
      display: contact.whatsapp,
      href: contact.whatsapp
        ? `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`
        : null,
    },
    {
      key: "facebook",
      label: "Facebook",
      icon: <FaFacebook size={22} />,
      color: "#1877f2",
      description: "Follow my work",
      display: contact.facebook_name,
      href: contact.facebook_url || null,
    },
    {
      key: "tiktok",
      label: "TikTok",
      icon: <FaTiktok size={22} />,
      color: "#010101",
      description: "Design & dev content",
      display: contact.tiktok_name,
      href: contact.tiktok_url || null,
    },
  ];

  return (
    <section id="contact" style={{ padding: "6rem 1.5rem", maxWidth: "900px", margin: "0 auto" }}>
      <p style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "0.75rem" }}>
        Contact
      </p>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "var(--text)", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
        Let's Work Together
      </h2>
      <p style={{ color: "var(--text-muted)", fontSize: "1rem", marginBottom: "2.5rem", maxWidth: 480, lineHeight: 1.7 }}>
        Have a project in mind? Whether it's a brand identity, a website, or a full-stack app — I'd love to hear about it.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
        {items.map((item) => {
          if (!item.href) return null;
          return (
            <a
              key={item.key}
              href={item.href}
              target={item.key !== "email" ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="card"
              style={{ padding: "1.5rem", textDecoration: "none", display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <span style={{ width: 46, height: 46, borderRadius: "12px", background: item.color + "18", border: `1px solid ${item.color}30`, display: "flex", alignItems: "center", justifyContent: "center", color: item.color }}>
                {item.icon}
              </span>
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text)", marginBottom: "0.2rem" }}>{item.label}</p>
                <p style={{ fontSize: "0.82rem", color: "var(--accent)", fontWeight: 600, marginBottom: "0.15rem", wordBreak: "break-all" }}>
                  {item.display}
                </p>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{item.description}</p>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
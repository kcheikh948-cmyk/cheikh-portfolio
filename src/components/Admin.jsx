import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { User, Briefcase, Link2, LogOut, Plus, Edit3, Trash2, Save, X, Upload, Settings, Eye } from "lucide-react";

const CATEGORIES = { logos: "Logos & Brands", websites: "Websites & Apps", designs: "Social & Designs" };
const EMPTY = { title: "", short_desc: "", problem: "", solution: "", category: "logos", tags: "", live_url: "", year: new Date().getFullYear().toString(), main_image: "", screenshots: [] };

export default function Admin() {
  const [tab, setTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [profile, setProfile] = useState({ name: "", tagline: "", short_bio: "", about: "", country: "", experience: "", education: "", availability: "", photo: "" });
  const [contact, setContact] = useState({ email: "", whatsapp: "", facebook_name: "", facebook_url: "", tiktok_name: "", tiktok_url: "" });
  const [skills, setSkills] = useState({ design: "", development: "", other: "" });
  const [projects, setProjects] = useState([]);
  const [projectTab, setProjectTab] = useState("logos");
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);

  const toast = (t) => { setMsg(t); setTimeout(() => setMsg(""), 3500); };

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    const { data: p } = await supabase.from("profile").select("*").eq("id", 1).single();
    if (p) setProfile({ name: p.name || "", tagline: p.tagline || "", short_bio: p.short_bio || "", about: p.about || "", country: p.country || "", experience: p.experience || "", education: p.education || "", availability: p.availability || "", photo: p.photo || "" });

    const { data: c } = await supabase.from("contact").select("*").eq("id", 1).single();
    if (c) setContact({ email: c.email || "", whatsapp: c.whatsapp || "", facebook_name: c.facebook_name || "", facebook_url: c.facebook_url || "", tiktok_name: c.tiktok_name || "", tiktok_url: c.tiktok_url || "" });

    const { data: s } = await supabase.from("skills").select("*").eq("id", 1).single();
    if (s) setSkills({ design: (s.design || []).join(", "), development: (s.development || []).join(", "), other: (s.other || []).join(", ") });

    const { data: pr } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    if (pr) setProjects(pr);
  };

  const saveProfile = async () => {
    setSaving(true);
    const { error } = await supabase.from("profile").upsert({ id: 1, ...profile });
    setSaving(false);
    error ? toast("❌ " + error.message) : toast("✅ Profile saved!");
  };

  const saveContact = async () => {
    setSaving(true);
    const { error } = await supabase.from("contact").upsert({ id: 1, ...contact });
    setSaving(false);
    error ? toast("❌ " + error.message) : toast("✅ Contact saved!");
  };

  const saveSkills = async () => {
    setSaving(true);
    const { error } = await supabase.from("skills").upsert({
      id: 1,
      design: skills.design.split(",").map(s => s.trim()).filter(Boolean),
      development: skills.development.split(",").map(s => s.trim()).filter(Boolean),
      other: skills.other.split(",").map(s => s.trim()).filter(Boolean),
    });
    setSaving(false);
    error ? toast("❌ " + error.message) : toast("✅ Skills saved!");
  };

  const uploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSaving(true);
    const ext = file.name.split(".").pop();
    const path = `profile/photo.${ext}`;
    const { data: existing } = await supabase.storage.from("portfolio").list("profile");
    if (existing && existing.length > 0) {
      await supabase.storage.from("portfolio").remove(existing.map(f => `profile/${f.name}`));
    }
    const { error } = await supabase.storage.from("portfolio").upload(path, file, { upsert: true });
    if (error) { toast("❌ " + error.message); setSaving(false); return; }
    const { data } = supabase.storage.from("portfolio").getPublicUrl(path);
    const url = data.publicUrl + "?v=" + Date.now();
    await supabase.from("profile").upsert({ id: 1, photo: url });
    setProfile(p => ({ ...p, photo: url }));
    setSaving(false);
    toast("✅ Photo uploaded!");
  };

  const uploadMainImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSaving(true);
    const path = `projects/${Date.now()}_main.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("portfolio").upload(path, file, { upsert: true });
    if (error) { toast("❌ " + error.message); setSaving(false); return; }
    const { data } = supabase.storage.from("portfolio").getPublicUrl(path);
    const url = data.publicUrl + "?v=" + Date.now();
    setForm(p => ({ ...p, main_image: url }));
    setSaving(false);
    toast("✅ Main image uploaded!");
  };

  const uploadScreenshots = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setSaving(true);
    const urls = [];
    for (const file of files) {
      const path = `projects/${Date.now()}_${Math.random().toString(36).slice(2)}.${file.name.split(".").pop()}`;
      const { error } = await supabase.storage.from("portfolio").upload(path, file);
      if (!error) {
        const { data } = supabase.storage.from("portfolio").getPublicUrl(path);
        urls.push(data.publicUrl + "?v=" + Date.now());
      }
    }
    setForm(p => ({ ...p, screenshots: [...(p.screenshots || []), ...urls] }));
    setSaving(false);
    toast(`✅ ${urls.length} image(s) uploaded!`);
  };

  const removeScreenshot = (i) => {
    setForm(p => ({ ...p, screenshots: p.screenshots.filter((_, j) => j !== i) }));
  };

  const saveProject = async () => {
    if (!form.title) { toast("❌ Title is required"); return; }
    setSaving(true);
    const payload = { ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) };
    delete payload.id;
    const { error } = editingId
      ? await supabase.from("projects").update(payload).eq("id", editingId)
      : await supabase.from("projects").insert(payload);
    setSaving(false);
    if (error) { toast("❌ " + error.message); return; }
    toast(editingId ? "✅ Updated!" : "✅ Project added!");
    setForm(EMPTY);
    setEditingId(null);
    const { data: pr } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    if (pr) setProjects(pr);
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      title: p.title || "", short_desc: p.short_desc || "",
      problem: p.problem || "", solution: p.solution || "",
      category: p.category || "logos", tags: (p.tags || []).join(", "),
      live_url: p.live_url || "", year: p.year || "",
      main_image: p.main_image || "", screenshots: p.screenshots || []
    });
    setProjectTab(p.category);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProject = async (id) => {
    if (!confirm("Delete this project?")) return;
    await supabase.from("projects").delete().eq("id", id);
    setProjects(prev => prev.filter(p => p.id !== id));
    toast("🗑️ Deleted");
  };

  const logout = async () => { await supabase.auth.signOut(); window.location.reload(); };

  const inp = { width: "100%", padding: "0.65rem 0.9rem", borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--bg)", color: "var(--text)", fontSize: "0.9rem", fontFamily: "inherit", outline: "none" };
  const lbl = { fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.35rem", display: "block", textTransform: "uppercase", letterSpacing: "0.06em" };
  const card = { background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "1.75rem", marginBottom: "1.25rem" };
  const btn = { backgroundColor: "var(--text)", color: "var(--bg)", padding: "0.65rem 1.4rem", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.875rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" };

  const TABS = [
    { key: "profile", label: "Profile", icon: <User size={15} /> },
    { key: "projects", label: "Projects", icon: <Briefcase size={15} /> },
    { key: "skills", label: "Skills", icon: <Settings size={15} /> },
    { key: "contact", label: "Contact", icon: <Link2 size={15} /> },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Top bar */}
      <div style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontStyle: "italic", color: "var(--text)" }}>Admin Panel</span>
          {msg && <span style={{ padding: "0.3rem 0.9rem", borderRadius: "99px", fontSize: "0.8rem", fontWeight: 600, background: msg.startsWith("❌") ? "#fee2e2" : "#dcfce7", color: msg.startsWith("❌") ? "#991b1b" : "#166534" }}>{msg}</span>}
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <a href="/" target="_blank" style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "var(--text-muted)", textDecoration: "none", border: "1px solid var(--border)", borderRadius: "8px", padding: "0.45rem 0.9rem" }}><Eye size={14} /> View Site</a>
          <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "var(--text-muted)", background: "none", border: "1px solid var(--border)", borderRadius: "8px", padding: "0.45rem 0.9rem", cursor: "pointer" }}><LogOut size={14} /> Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.4rem", marginBottom: "2rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "0.35rem", width: "fit-content" }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1.1rem", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600, background: tab === t.key ? "var(--text)" : "transparent", color: tab === t.key ? "var(--bg)" : "var(--text-muted)" }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* PROFILE */}
        {tab === "profile" && (
          <>
            <div style={card}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontStyle: "italic", color: "var(--text)", marginBottom: "1.25rem" }}>Profile Photo</p>
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                <div style={{ width: 80, height: 80, borderRadius: "8px", overflow: "hidden", border: "2px solid var(--border)", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {profile.photo
                    ? <img src={profile.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <span style={{ color: "var(--text-muted)", fontStyle: "italic", fontFamily: "'Playfair Display', serif" }}>CK</span>}
                </div>
                <label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.1rem", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, color: "var(--text)" }}>
                  <Upload size={14} /> {saving ? "Uploading..." : "Upload Photo"}
                  <input type="file" accept="image/*" onChange={uploadPhoto} style={{ display: "none" }} />
                </label>
              </div>
            </div>

            <div style={card}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontStyle: "italic", color: "var(--text)", marginBottom: "1.25rem" }}>Personal Info</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {[["name","Full Name"],["tagline","Tagline"],["country","Country"],["experience","Experience"],["education","Education"],["availability","Availability"]].map(([key, l]) => (
                  <div key={key}>
                    <label style={lbl}>{l}</label>
                    <input value={profile[key]} onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} style={inp} />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "1rem" }}>
                <label style={lbl}>Short Bio (hero section)</label>
                <textarea value={profile.short_bio} onChange={e => setProfile(p => ({ ...p, short_bio: e.target.value }))} rows={3} style={{ ...inp, resize: "vertical" }} />
              </div>
              <div style={{ marginTop: "1rem" }}>
                <label style={lbl}>About Me (full)</label>
                <textarea value={profile.about} onChange={e => setProfile(p => ({ ...p, about: e.target.value }))} rows={5} style={{ ...inp, resize: "vertical" }} />
              </div>
              <button onClick={saveProfile} disabled={saving} style={{ ...btn, marginTop: "1.25rem" }}>
                <Save size={14} /> {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </>
        )}

        {/* PROJECTS */}
        {tab === "projects" && (
          <>
            <div style={card}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontStyle: "italic", color: "var(--text)", marginBottom: "1.25rem" }}>{editingId ? "✏️ Edit Project" : "➕ Add Project"}</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div><label style={lbl}>Title *</label><input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} style={inp} /></div>
                <div><label style={lbl}>Year</label><input value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} style={inp} /></div>
                <div>
                  <label style={lbl}>Category</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={inp}>
                    {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>Live URL</label><input value={form.live_url} onChange={e => setForm(p => ({ ...p, live_url: e.target.value }))} style={inp} placeholder="https://..." /></div>
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={lbl}>Tags (comma separated)</label>
                  <input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} style={inp} placeholder="React, Figma, Branding" />
                </div>
              </div>

              {/* Main image */}
              <div style={{ marginTop: "1.25rem" }}>
                <label style={lbl}>Main Image (shown on project card)</label>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
                  {form.main_image ? (
                    <div style={{ position: "relative" }}>
                      <img
                        src={form.main_image}
                        alt=""
                        style={{ width: 120, height: 80, objectFit: "cover", borderRadius: "6px", border: "1px solid var(--border)", display: "block" }}
                        onError={e => e.target.style.display = "none"}
                      />
                      <button
                        onClick={() => setForm(p => ({ ...p, main_image: "" }))}
                        style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", background: "#ef4444", border: "none", color: "white", cursor: "pointer", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >✕</button>
                    </div>
                  ) : (
                    <div style={{ width: 120, height: 80, borderRadius: "6px", border: "1.5px dashed var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "0.75rem" }}>
                      No image
                    </div>
                  )}
                  <label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1rem", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, color: "var(--text)" }}>
                    <Upload size={14} /> {saving ? "Uploading..." : form.main_image ? "Change Image" : "Upload Main Image"}
                    <input type="file" accept="image/*" onChange={uploadMainImage} style={{ display: "none" }} />
                  </label>
                </div>
              </div>

              {/* Screenshots */}
              <div style={{ marginTop: "1.25rem" }}>
                <label style={lbl}>Screenshots (multiple — shown in project modal)</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.5rem" }}>
                  {(form.screenshots || []).map((src, i) => (
                    <div key={i} style={{ position: "relative" }}>
                      <img src={src} alt="" style={{ width: 100, height: 70, objectFit: "cover", borderRadius: "6px", border: "1px solid var(--border)" }} />
                      <button
                        onClick={() => removeScreenshot(i)}
                        style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", background: "#ef4444", border: "none", color: "white", cursor: "pointer", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >✕</button>
                    </div>
                  ))}
                  <label style={{ width: 100, height: 70, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "1.5px dashed var(--border)", borderRadius: "6px", cursor: "pointer", color: "var(--text-muted)", fontSize: "0.75rem", gap: "0.25rem" }}>
                    <Upload size={16} />
                    Add photos
                    <input type="file" accept="image/*" multiple onChange={uploadScreenshots} style={{ display: "none" }} />
                  </label>
                </div>
              </div>

              {[["short_desc","Short Description (card preview)",2],["problem","The Problem",3],["solution","The Solution",3]].map(([key, l, rows]) => (
                <div key={key} style={{ marginTop: "1rem" }}>
                  <label style={lbl}>{l}</label>
                  <textarea value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} rows={rows} style={{ ...inp, resize: "vertical" }} />
                </div>
              ))}

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
                <button onClick={saveProject} disabled={saving} style={btn}>
                  {editingId ? <><Edit3 size={14} /> Update</> : <><Plus size={14} /> Add Project</>}
                </button>
                {editingId && (
                  <button onClick={() => { setEditingId(null); setForm(EMPTY); }} style={{ padding: "0.65rem 1.2rem", borderRadius: "10px", border: "1px solid var(--border)", background: "transparent", color: "var(--text-muted)", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                    <X size={14} /> Cancel
                  </button>
                )}
              </div>
            </div>

            <div style={card}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontStyle: "italic", color: "var(--text)", marginBottom: "1.25rem" }}>Your Projects</p>
              <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
                {Object.entries(CATEGORIES).map(([k, v]) => (
                  <button key={k} onClick={() => setProjectTab(k)} style={{ padding: "0.4rem 1rem", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "0.8rem", fontWeight: 700, background: projectTab === k ? "var(--text)" : "var(--bg)", color: projectTab === k ? "var(--bg)" : "var(--text-muted)" }}>
                    {v} ({projects.filter(p => p.category === k).length})
                  </button>
                ))}
              </div>
              {projects.filter(p => p.category === projectTab).length === 0
                ? <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>No projects yet.</p>
                : projects.filter(p => p.category === projectTab).map(p => (
                  <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.9rem 1rem", background: "var(--bg)", borderRadius: "10px", border: "1px solid var(--border)", marginBottom: "0.6rem", gap: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1, minWidth: 0 }}>
                      {p.main_image
                        ? <img src={p.main_image} alt="" style={{ width: 52, height: 38, objectFit: "cover", borderRadius: "4px", flexShrink: 0, border: "1px solid var(--border)" }} />
                        : <div style={{ width: 52, height: 38, borderRadius: "4px", background: "var(--bg-card)", border: "1px solid var(--border)", flexShrink: 0 }} />
                      }
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)" }}>{p.title}</p>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.short_desc}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                      <button onClick={() => startEdit(p)} style={{ padding: "6px 10px", borderRadius: "8px", border: "1px solid var(--border)", background: "transparent", color: "var(--text)", cursor: "pointer", display: "flex", alignItems: "center" }}><Edit3 size={14} /></button>
                      <button onClick={() => deleteProject(p.id)} style={{ padding: "6px 10px", borderRadius: "8px", border: "1px solid #fecaca", background: "transparent", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center" }}><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))
              }
            </div>
          </>
        )}

        {/* SKILLS */}
        {tab === "skills" && (
          <div style={card}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontStyle: "italic", color: "var(--text)", marginBottom: "0.5rem" }}>Skills & Tools</p>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>Separate each skill with a comma.</p>
            {[["design","Design Tools"],["development","Development"],["other","Other Skills"]].map(([key, l]) => (
              <div key={key} style={{ marginBottom: "1rem" }}>
                <label style={lbl}>{l}</label>
                <textarea value={skills[key]} onChange={e => setSkills(s => ({ ...s, [key]: e.target.value }))} rows={3} style={{ ...inp, resize: "vertical" }} />
              </div>
            ))}
            <button onClick={saveSkills} disabled={saving} style={btn}><Save size={14} /> {saving ? "Saving..." : "Save Skills"}</button>
          </div>
        )}

        {/* CONTACT */}
        {tab === "contact" && (
          <div style={card}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontStyle: "italic", color: "var(--text)", marginBottom: "1.5rem" }}>Social & Contact</p>

            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Email & WhatsApp</p>
            {[["email","Email address"],["whatsapp","WhatsApp number (e.g. 213XXXXXXXXX)"]].map(([key, l]) => (
              <div key={key} style={{ marginBottom: "1rem" }}>
                <label style={lbl}>{l}</label>
                <input value={contact[key] || ""} onChange={e => setContact(c => ({ ...c, [key]: e.target.value }))} style={inp} />
              </div>
            ))}

            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", margin: "1.5rem 0 1rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Facebook</p>
            {[["facebook_name","Display name (e.g. Cheikh Kamel)"],["facebook_url","Facebook URL"]].map(([key, l]) => (
              <div key={key} style={{ marginBottom: "1rem" }}>
                <label style={lbl}>{l}</label>
                <input value={contact[key] || ""} onChange={e => setContact(c => ({ ...c, [key]: e.target.value }))} style={inp} />
              </div>
            ))}

            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", margin: "1.5rem 0 1rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>TikTok</p>
            {[["tiktok_name","Display name (e.g. @cheikh.kamel)"],["tiktok_url","TikTok URL"]].map(([key, l]) => (
              <div key={key} style={{ marginBottom: "1rem" }}>
                <label style={lbl}>{l}</label>
                <input value={contact[key] || ""} onChange={e => setContact(c => ({ ...c, [key]: e.target.value }))} style={inp} />
              </div>
            ))}

            <button onClick={saveContact} disabled={saving} style={{ ...btn, marginTop: "0.5rem" }}><Save size={14} /> {saving ? "Saving..." : "Save Contact"}</button>
          </div>
        )}
      </div>
    </div>
  );
}
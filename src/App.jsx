import { useState, useEffect } from "react";
import { supabase, isSupabaseReady } from "./lib/supabase";
import { profileData, projectsData, skillsData, contactData } from "./data/placeholder";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Admin from "./components/Admin";
import Login from "./components/Login";

function useTheme() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);
  return [dark, () => setDark((d) => !d)];
}

export default function App() {
  const [dark, toggleDark] = useTheme();
  const [profile, setProfile] = useState(profileData);
  const [projects, setProjects] = useState(projectsData);
  const [skills, setSkills] = useState(skillsData);
  const [contact, setContact] = useState(contactData);
  const [session, setSession] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [ready, setReady] = useState(false);

  const isAdmin = window.location.pathname === "/admin";

  useEffect(() => {
    if (!isSupabaseReady) { setReady(true); return; }
    setLoadingAuth(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingAuth(false);
      setReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isSupabaseReady || isAdmin) return;
    const load = async () => {
      try {
        const [{ data: p }, { data: pr }, { data: s }, { data: c }] = await Promise.all([
          supabase.from("profile").select("*").eq("id", 1).single(),
          supabase.from("projects").select("*").order("created_at", { ascending: false }),
          supabase.from("skills").select("*").eq("id", 1).single(),
          supabase.from("contact").select("*").eq("id", 1).single(),
        ]);
        if (p) setProfile({ ...profileData, ...p });
        if (pr) {
          const grouped = { logos: [], websites: [], designs: [] };
          pr.forEach(proj => { if (grouped[proj.category]) grouped[proj.category].push(proj); });
          setProjects(grouped);
        }
        if (s) setSkills(s);
        if (c) setContact(c);
      } catch (_) {}
    };
    load();
  }, []);

  if (!ready || loadingAuth) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Loading...</div>
      </div>
    );
  }

  if (isAdmin) {
    if (!session) return <Login />;
    return <Admin />;
  }

  return (
    <>
      <Navbar dark={dark} toggleDark={toggleDark} />
      <main>
        <Hero profile={profile} />
        <div style={{ borderTop: "1px solid var(--border)" }} />
        <About profile={profile} />
        <div style={{ borderTop: "1px solid var(--border)" }} />
        <Projects projects={projects} />
        <div style={{ borderTop: "1px solid var(--border)" }} />
        <Skills skills={skills} />
        <div style={{ borderTop: "1px solid var(--border)" }} />
        <Contact contact={contact} />
      </main>
      <Footer />
    </>
  );
}
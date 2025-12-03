import React, { useState, useEffect, useRef } from "react";

/*********** COLORS ***********/
const COLORS = ["#EA4335", "#FBBC05", "#34A853", "#4285F4"];

/*********** GALAXY BACKGROUND ***********/
const GalaxyBackground = ({ darkMode }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);

  class Particle {
    constructor(width, height) {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.2;
      this.vy = (Math.random() - 0.5) * 0.2;
      this.size = 2 + Math.random() * 2;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    move(width, height) {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }
    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const connectParticles = (ctx, particles) => {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.strokeStyle = `rgba(255,255,255,${1 - dist / maxDist})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesRef.current = Array.from({ length: 100 }, () => new Particle(canvas.width, canvas.height));
    };

    resize();
    window.addEventListener("resize", resize);

    let rafId;
    const animate = () => {
      ctx.fillStyle = darkMode ? "#090a0f" : "#f0f0f0";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((p) => {
        p.move(canvas.width, canvas.height);
        p.draw(ctx);
      });
      connectParticles(ctx, particlesRef.current);
      rafId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
    };
  }, [darkMode]);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, zIndex: 0 }} />;
};

/*********** SPLASH SCREEN ***********/
const SplashScreen = ({ onFinish, darkMode }) => {
  const [showStars, setShowStars] = useState(true);
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    const logoTimer = setTimeout(() => { setShowStars(false); setShowLogo(true); }, 2500);
    const finishTimer = setTimeout(() => { onFinish(); }, 5000);
    return () => { clearTimeout(logoTimer); clearTimeout(finishTimer); };
  }, [onFinish]);

  const starColors = ["#EA4335", "#FBBC05", "#34A853", "#4285F4"];

  return (
    <div style={{
      position: "fixed", inset: 0, display: "flex", justifyContent: "center", alignItems: "center",
      flexDirection: "column", backgroundColor: darkMode ? "#090a0f" : "#fff", color: darkMode ? "#fff" : "#000",
      zIndex: 1000, overflow: "hidden"
    }}>
      {showStars && starColors.map((color, i) => (
        <div key={i} style={{
          position: "absolute", top: "50%", left: "50%", width: 22, height: 22, backgroundColor: color,
          clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
          transformOrigin: "-120px center", animation: `rotateStar 2s linear infinite`, animationDelay: `${i * 0.12}s`, zIndex: 1001
        }} />
      ))}
      {showLogo && (
        <div style={{ display: "flex", alignItems: "center", gap: 18, zIndex: 1001 }}>
          <img src={darkMode ? "/GDSC_Club_logo2.png" : "/GDSC_Club_logo.png"} alt="logo" style={{ width: 110 }} />
          <h1 style={{ fontSize: 56, margin: 0, display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span style={{ color: "#EA4335" }}>G</span>
            <span style={{ color: "#FBBC05" }}>D</span>
            <span style={{ color: "#34A853" }}>S</span>
            <span style={{ color: "#4285F4" }}>C</span>
            <span> </span>
            <span style={{ color: "#EA4335" }}>G</span>
            <span style={{ color: "#FBBC05" }}>A</span>
            <span style={{ color: "#34A853" }}>L</span>
            <span style={{ color: "#4285F4" }}>A</span>
            <span style={{ color: "#EA4335" }}>X</span>
            <span style={{ color: "#FBBC05" }}>Y</span>
          </h1>
        </div>
      )}

      <style>{`
        @keyframes rotateStar {
          0% { transform: rotate(0deg) translateX(120px) scale(0.6); opacity: 1; }
          50% { transform: rotate(180deg) translateX(120px) scale(1); opacity: 1; }
          100% { transform: rotate(360deg) translateX(120px) scale(0.6); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

/*********** MAIN APP ***********/
export default function App() {
  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [showSplash, setShowSplash] = useState(true);

  const [name, setName] = useState("");
  const [reg, setReg] = useState("");
  const [designation, setDesignation] = useState("");
  const [position, setPosition] = useState("Core Member");
  const [skills, setSkills] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const [roleFilter, setRoleFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");

  useEffect(() => localStorage.setItem("darkMode", darkMode), [darkMode]);
  const handleSplashFinish = () => setShowSplash(false);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result);
    reader.readAsDataURL(file);
  };

  const addMember = () => {
    if (!name || !reg || !designation || !position) { alert("Please fill all fields"); return; }
    setMembers(prev => [...prev, { name, reg, designation, position, skills, bio, image: profileImage || defaultAvatar }]);
    setName(""); setReg(""); setDesignation(""); setPosition("Core Member"); setSkills(""); setBio(""); setProfileImage(null); setOpen(false);
  };

  const deleteMember = (index) => {
    setMembers(prev => { const copy = [...prev]; copy.splice(index, 1); return copy; });
  };

  const allSkills = Array.from(new Set(members.flatMap(m => m.skills?.split(",").map(s => s.trim()) || [])));
  const filteredMembers = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || (m.bio || "").toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter ? m.position === roleFilter : true;
    const matchSkill = skillFilter ? (m.skills || "").split(",").map(s => s.trim()).includes(skillFilter) : true;
    return matchSearch && matchRole && matchSkill;
  });

  const inputStyle = { width: "100%", padding: "10px 12px", marginBottom: 12, borderRadius: 10, border: "1px solid #ccc", outline: "none", fontSize: 14 };

  if (showSplash) return <SplashScreen onFinish={handleSplashFinish} darkMode={darkMode} />;

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden", fontFamily: "Inter, Roboto, sans-serif", color: darkMode ? "#fff" : "#000", backgroundColor: darkMode ? "#090a0f" : "#f0f0f0", transition: "all 0.3s", padding: 20 }}>
      <GalaxyBackground darkMode={darkMode} />

      {/* header */}
      <div className="logo-header" style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "center", marginBottom: 20, position: "relative", zIndex: 2, animation: "floatHeader 4s ease-in-out infinite alternate", cursor: "pointer", transition: "transform 0.3s" }}>
        <img src={darkMode ? "/GDSC_Club_logo2.png" : "/GDSC_Club_logo.png"} alt="logo" style={{ width: 60, transition: "transform 0.3s" }} />
        <h1 style={{ fontSize: 48, fontWeight: 800, margin: 0, display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ color: "#EA4335" }}>G</span>
          <span style={{ color: "#FBBC05" }}>D</span>
          <span style={{ color: "#34A853" }}>S</span>
          <span style={{ color: "#4285F4" }}>C</span>
          <span> </span>
          <span style={{ color: "#EA4335" }}>G</span>
          <span style={{ color: "#FBBC05" }}>A</span>
          <span style={{ color: "#34A853" }}>L</span>
          <span style={{ color: "#4285F4" }}>A</span>
          <span style={{ color: "#EA4335" }}>X</span>
          <span style={{ color: "#FBBC05" }}>Y</span>
        </h1>
      </div>

      <style>{`
        @keyframes floatHeader { 0% { transform: translateY(0px) rotate(-1deg); } 50% { transform: translateY(-10px) rotate(1deg); } 100% { transform: translateY(0px) rotate(-1deg); } }
        .logo-header:hover { transform: scale(1.03) rotate(0deg); }
        .logo-header:hover img { transform: scale(1.08) rotate(5deg); }
        .logo-header:hover h1 { transform: scale(1.02) rotate(-1deg); }
      `}</style>

      {/* dark mode toggle */}
      <button onClick={() => setDarkMode(!darkMode)} style={{ position: "absolute", right: 20, top: 20, padding: "8px 14px", borderRadius: 10, border: "none", cursor: "pointer", backgroundColor: darkMode ? "#f3f3f3" : "#333", color: darkMode ? "#333" : "#fff", zIndex: 3 }}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      {/* controls */}
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 24, flexWrap: "wrap", position: "relative", zIndex: 3 }}>
        <button onClick={() => setOpen(true)} style={{ padding: "10px 18px", borderRadius: 12, border: "none", backgroundColor: "#ea4335", color: "#fff", cursor: "pointer" }}>Add Member</button>
        <input placeholder="Search member..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: 10, borderRadius: 12, minWidth: 180, border: "1px solid #ccc", outline: "none", backgroundColor: "#FBBC05", color: "#000" }} />
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ padding: 10, borderRadius: 12, border: "1px solid #ccc", cursor: "pointer", backgroundColor: "#34A853", color: "#fff" }}>
          <option value="">All Roles</option>
          <option value="Lead">Lead</option>
          <option value="Co-Lead">Co-Lead</option>
          <option value="Core Member">Core Member</option>
        </select>
        <select value={skillFilter} onChange={e => setSkillFilter(e.target.value)} style={{ padding: 10, borderRadius: 12, border: "1px solid #ccc", cursor: "pointer", backgroundColor: "#4285F4", color: "#fff" }}>
          <option value="">All Skills</option>
          {allSkills.map((s, idx) => <option key={idx} value={s}>{s}</option>)}
        </select>
      </div>

      {/* members grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 220px))",
        gap: 20,
        justifyContent: "center",
        zIndex: 2
      }}>
        {filteredMembers.map((m, i) => (
          <div key={i} style={{
            backgroundColor: COLORS[i % COLORS.length],
            borderRadius: 14,
            padding: 12,
            textAlign: "center",
            position: "relative",
            cursor: "pointer",
            transition: "transform 0.28s, box-shadow 0.28s",
            width: "100%",
            height: 320,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start"
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05) rotate(-2deg)"; e.currentTarget.style.boxShadow = `0 0 18px 6px ${COLORS[i % COLORS.length]}55`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1) rotate(0deg)"; e.currentTarget.style.boxShadow = "none"; }}>
            <button onClick={() => deleteMember(i)} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.45)", color: "#fff", border: "none", borderRadius: "50%", padding: "4px 8px", cursor: "pointer" }}>🗑</button>
            <img src={m.image} alt={m.name} style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 12, marginBottom: 10 }} />
            <h3 style={{ margin: 0 }}>{m.name}</h3>
            <p style={{ margin: "4px 0" }}>Reg: {m.reg}</p>
            <p style={{ margin: "4px 0" }}>{m.designation}</p>
            <p style={{ margin: "4px 0", fontStyle: "italic" }}>{m.position}</p>
            <p style={{ margin: "4px 0" }}>Skills: {m.skills || "N/A"}</p>
            <p style={{ margin: "4px 0", fontStyle: "italic" }}>{m.bio}</p>
          </div>
        ))}
      </div>

      {/* add-member modal */}
      {open && (
        <div style={{ position: "fixed", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999, backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div style={{ width: 380, padding: 22, borderRadius: 16, backgroundColor: darkMode ? "#0f1113" : "#fff" }}>
            <h2 style={{ marginTop: 0, textAlign: "center" }}>Add Member</h2>
            <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
            <input placeholder="Registration" value={reg} onChange={e => setReg(e.target.value)} style={inputStyle} />
            <input placeholder="Designation" value={designation} onChange={e => setDesignation(e.target.value)} style={inputStyle} />
            <select value={position} onChange={e => setPosition(e.target.value)} style={inputStyle}>
              <option>Lead</option>
              <option>Co-Lead</option>
              <option>Core Member</option>
            </select>
            <input placeholder="Skills (comma separated)" value={skills} onChange={e => setSkills(e.target.value)} style={inputStyle} />
            <textarea placeholder="Bio" value={bio} onChange={e => setBio(e.target.value)} style={{ ...inputStyle, height: 60 }} />
            <input type="file" onChange={handleFileUpload} style={{ marginBottom: 12 }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => setOpen(false)} style={{ padding: "10px 18px", borderRadius: 12, border: "none", cursor: "pointer" }}>Cancel</button>
              <button onClick={addMember} style={{ padding: "10px 18px", borderRadius: 12, border: "none", backgroundColor: "#34A853", color: "#fff", cursor: "pointer" }}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


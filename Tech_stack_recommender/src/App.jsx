import { useState, useEffect, useRef } from "react";

// ─── DATASET: job roles with required skills ─────────────────────────────────
const JOB_ROLES = [
  { title: "Data Scientist", skills: ["python", "machine learning", "sql", "data analysis", "statistics", "pandas", "numpy", "tensorflow", "scikit-learn", "data visualization"] },
  { title: "DevOps Engineer", skills: ["aws", "docker", "kubernetes", "ci/cd", "linux", "git", "automation", "terraform", "jenkins", "bash"] },
  { title: "Backend Developer", skills: ["java", "python", "sql", "apis", "node.js", "databases", "rest", "microservices", "git", "algorithms"] },
  { title: "Frontend Developer", skills: ["javascript", "react", "css", "html", "typescript", "ui/ux", "git", "responsive design", "vue", "figma"] },
  { title: "Machine Learning Engineer", skills: ["python", "tensorflow", "pytorch", "machine learning", "deep learning", "algorithms", "numpy", "docker", "git", "mlops"] },
  { title: "Cloud Architect", skills: ["aws", "azure", "cloud", "kubernetes", "terraform", "networking", "security", "docker", "automation", "microservices"] },
  { title: "Full Stack Developer", skills: ["javascript", "react", "node.js", "sql", "python", "html", "css", "git", "apis", "databases"] },
  { title: "Cybersecurity Analyst", skills: ["security", "networking", "linux", "penetration testing", "cryptography", "python", "firewalls", "siem", "ethical hacking", "compliance"] },
  { title: "Database Administrator", skills: ["sql", "databases", "postgresql", "mysql", "mongodb", "performance tuning", "backup", "oracle", "data modeling", "linux"] },
  { title: "AI Research Engineer", skills: ["python", "deep learning", "pytorch", "tensorflow", "mathematics", "algorithms", "research", "nlp", "computer vision", "statistics"] },
  { title: "Blockchain Developer", skills: ["solidity", "ethereum", "web3", "javascript", "cryptography", "smart contracts", "python", "distributed systems", "node.js", "security"] },
  { title: "Mobile App Developer", skills: ["flutter", "swift", "kotlin", "java", "react native", "ui/ux", "apis", "git", "firebase", "android"] },
  { title: "Systems Administrator", skills: ["linux", "windows server", "networking", "bash", "automation", "aws", "monitoring", "security", "virtualization", "troubleshooting"] },
  { title: "Data Engineer", skills: ["python", "sql", "spark", "hadoop", "etl", "data pipelines", "aws", "kafka", "airflow", "databases"] },
  { title: "QA Engineer", skills: ["testing", "automation", "selenium", "python", "javascript", "ci/cd", "git", "performance testing", "apis", "bug tracking"] },
];

const SKILL_SUGGESTIONS = [
  "Python", "Java", "JavaScript", "SQL", "Machine Learning", "Deep Learning",
  "AWS", "Docker", "Kubernetes", "React", "Node.js", "Data Analysis",
  "TensorFlow", "PyTorch", "Linux", "Git", "TypeScript", "CSS", "HTML",
  "Networking", "Security", "Algorithms", "Statistics", "NLP", "Cloud",
  "Automation", "APIs", "Databases", "CI/CD", "Microservices"
];

// ─── TF-IDF ENGINE ────────────────────────────────────────────────────────────
function buildTFIDF(roles) {
  const N = roles.length;
  const df = {};
  roles.forEach(role => {
    const unique = [...new Set(role.skills)];
    unique.forEach(skill => { df[skill] = (df[skill] || 0) + 1; });
  });

  return roles.map(role => {
    const tf = {};
    role.skills.forEach(s => { tf[s] = (tf[s] || 0) + 1; });
    Object.keys(tf).forEach(s => { tf[s] /= role.skills.length; });
    const vec = {};
    Object.keys(tf).forEach(s => {
      const idf = Math.log(N / df[s]);
      vec[s] = tf[s] * idf;
    });
    return { ...role, vec };
  });
}

function buildUserVector(userSkills, allSkills) {
  const vec = {};
  allSkills.forEach(s => { vec[s] = 0; });
  const lower = userSkills.map(s => s.toLowerCase().trim());
  lower.forEach(s => { if (vec[s] !== undefined) vec[s] = 1; });
  return vec;
}

function cosineSimilarity(vecA, vecB) {
  const keys = Object.keys(vecA);
  let dot = 0, magA = 0, magB = 0;
  keys.forEach(k => {
    dot += (vecA[k] || 0) * (vecB[k] || 0);
    magA += (vecA[k] || 0) ** 2;
    magB += (vecB[k] || 0) ** 2;
  });
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

function recommend(userSkills, enrichedRoles, topN = 5) {
  const allSkills = [...new Set(enrichedRoles.flatMap(r => r.skills))];
  const userVec = buildUserVector(userSkills, allSkills);
  const scored = enrichedRoles.map(role => ({
    ...role,
    score: cosineSimilarity(userVec, role.vec),
    matchedSkills: role.skills.filter(s => userSkills.map(u => u.toLowerCase()).includes(s)),
  }));
  return scored.sort((a, b) => b.score - a.score).slice(0, topN);
}

// ─── COLOR MAP ────────────────────────────────────────────────────────────────
const RANK_COLORS = ["#4ade80", "#22d3ee", "#a78bfa", "#fb923c", "#f472b6"];
const RANK_LABELS = ["🥇 Best Match", "🥈 Strong Match", "🥉 Good Match", "4th", "5th"];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function App() {
  const [input, setInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [results, setResults] = useState(null);
  const [enriched] = useState(() => buildTFIDF(JOB_ROLES));
  const [animating, setAnimating] = useState(false);
  const [step, setStep] = useState(0); // 0=input, 1=results
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (input.trim().length > 0) {
      const f = SKILL_SUGGESTIONS.filter(
        s => s.toLowerCase().includes(input.toLowerCase()) && !skills.map(x => x.toLowerCase()).includes(s.toLowerCase())
      );
      setFiltered(f.slice(0, 6));
      setShowSuggestions(f.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [input, skills]);

  const addSkill = (s) => {
    const trimmed = s.trim();
    if (!trimmed || skills.map(x => x.toLowerCase()).includes(trimmed.toLowerCase())) return;
    setSkills(prev => [...prev, trimmed]);
    setInput("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (input.trim()) addSkill(input);
    }
    if (e.key === "Backspace" && !input && skills.length > 0) {
      setSkills(prev => prev.slice(0, -1));
    }
  };

  const removeSkill = (i) => setSkills(prev => prev.filter((_, idx) => idx !== i));

  const handleAnalyze = () => {
    if (skills.length < 3) return;
    setAnimating(true);
    setTimeout(() => {
      const res = recommend(skills, enriched, 5);
      setResults(res);
      setStep(1);
      setAnimating(false);
    }, 1800);
  };

  const reset = () => {
    setSkills([]);
    setResults(null);
    setStep(0);
    setInput("");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29 0%, #1a1a3e 50%, #0f0c29 100%)",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      color: "#e2e8f0",
      padding: "0",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background grid */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: "linear-gradient(rgba(99,102,241,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.07) 1px,transparent 1px)",
        backgroundSize: "40px 40px",
        pointerEvents: "none",
      }} />

      {/* Header */}
      <header style={{
        position: "relative", zIndex: 1,
        textAlign: "center",
        padding: "48px 24px 24px",
      }}>
        <div style={{
          display: "inline-block",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          borderRadius: "12px",
          padding: "6px 16px",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#fff",
          marginBottom: "16px",
        }}>DecodeLabs · Project 3 · AI Batch 2026</div>
        <h1 style={{
          fontSize: "clamp(28px, 5vw, 52px)",
          fontWeight: 800,
          margin: "0 0 8px",
          background: "linear-gradient(135deg, #a5b4fc 0%, #e879f9 50%, #22d3ee 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          lineHeight: 1.1,
        }}>Tech Stack Recommender</h1>
        <p style={{ color: "#94a3b8", fontSize: "15px", margin: 0 }}>
          TF-IDF · Cosine Similarity · Content-Based Filtering
        </p>
      </header>

      {/* Pipeline indicator */}
      <div style={{
        position: "relative", zIndex: 1,
        display: "flex", justifyContent: "center",
        gap: "0", marginBottom: "32px",
        padding: "0 24px",
      }}>
        {["① Ingestion", "② Scoring", "③ Sorting", "④ Filtering"].map((label, i) => {
          const active = step === 1 || (animating && i <= Math.floor(Date.now() / 600) % 4);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                padding: "6px 14px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 600,
                background: step === 1 ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.05)",
                color: step === 1 ? "#a5b4fc" : "#64748b",
                border: step === 1 ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(255,255,255,0.08)",
                transition: "all 0.3s",
                whiteSpace: "nowrap",
              }}>{label}</div>
              {i < 3 && <div style={{ width: "20px", height: "1px", background: step === 1 ? "#6366f1" : "#2d3748" }} />}
            </div>
          );
        })}
      </div>

      <main style={{ position: "relative", zIndex: 1, maxWidth: "780px", margin: "0 auto", padding: "0 24px 60px" }}>

        {/* STEP 0: Input */}
        {step === 0 && (
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "20px",
            padding: "32px",
            backdropFilter: "blur(12px)",
          }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 6px", color: "#e2e8f0" }}>
              Enter Your Skills
            </h2>
            <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 24px" }}>
              Add at least 3 skills — press Enter or comma to add each one.
            </p>

            {/* Tag input */}
            <div style={{
              display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center",
              background: "rgba(0,0,0,0.3)",
              border: "1.5px solid rgba(99,102,241,0.4)",
              borderRadius: "12px",
              padding: "12px",
              minHeight: "56px",
              cursor: "text",
              position: "relative",
            }} onClick={() => inputRef.current?.focus()}>
              {skills.map((s, i) => (
                <span key={i} style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))",
                  border: "1px solid rgba(99,102,241,0.5)",
                  borderRadius: "8px",
                  padding: "4px 10px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#c4b5fd",
                }}>
                  {s}
                  <button onClick={(e) => { e.stopPropagation(); removeSkill(i); }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0, lineHeight: 1, fontSize: "14px" }}>×</button>
                </span>
              ))}
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={skills.length === 0 ? "e.g. Python, Machine Learning, AWS..." : "Add more..."}
                style={{
                  background: "transparent", border: "none", outline: "none",
                  color: "#e2e8f0", fontSize: "14px", flex: 1, minWidth: "140px",
                  padding: "4px",
                }}
              />

              {/* Autocomplete */}
              {showSuggestions && (
                <div style={{
                  position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 50,
                  background: "#1e1b4b",
                  border: "1px solid rgba(99,102,241,0.5)",
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                }}>
                  {filtered.map((s, i) => (
                    <div key={i}
                      onMouseDown={(e) => { e.preventDefault(); addSkill(s); }}
                      style={{
                        padding: "10px 16px", cursor: "pointer", fontSize: "13px",
                        borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                        color: "#c4b5fd",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={e => e.target.style.background = "rgba(99,102,241,0.2)"}
                      onMouseLeave={e => e.target.style.background = "transparent"}
                    >{s}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick add chips */}
            <div style={{ marginTop: "16px" }}>
              <p style={{ fontSize: "12px", color: "#475569", marginBottom: "10px" }}>Quick add popular skills:</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {SKILL_SUGGESTIONS.slice(0, 12).filter(s => !skills.map(x => x.toLowerCase()).includes(s.toLowerCase())).map((s, i) => (
                  <button key={i} onClick={() => addSkill(s)} style={{
                    padding: "5px 12px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "20px",
                    color: "#94a3b8",
                    fontSize: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                    onMouseEnter={e => { e.target.style.background = "rgba(99,102,241,0.2)"; e.target.style.color = "#a5b4fc"; e.target.style.borderColor = "rgba(99,102,241,0.5)"; }}
                    onMouseLeave={e => { e.target.style.background = "rgba(255,255,255,0.04)"; e.target.style.color = "#94a3b8"; e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
                  >+ {s}</button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{ marginTop: "28px", display: "flex", alignItems: "center", gap: "16px" }}>
              <button
                onClick={handleAnalyze}
                disabled={skills.length < 3 || animating}
                style={{
                  padding: "14px 32px",
                  background: skills.length >= 3
                    ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                    : "rgba(255,255,255,0.07)",
                  border: "none",
                  borderRadius: "12px",
                  color: skills.length >= 3 ? "#fff" : "#4b5563",
                  fontSize: "15px",
                  fontWeight: 700,
                  cursor: skills.length >= 3 ? "pointer" : "not-allowed",
                  transition: "all 0.3s",
                  boxShadow: skills.length >= 3 ? "0 4px 24px rgba(99,102,241,0.4)" : "none",
                }}
              >
                {animating ? "Analyzing..." : "Find My Career Matches →"}
              </button>
              <span style={{ fontSize: "13px", color: "#475569" }}>
                {skills.length}/3 minimum skills
              </span>
            </div>

            {/* Animated loading */}
            {animating && (
              <div style={{ marginTop: "24px" }}>
                {["Step 1: Ingesting your skill profile...", "Step 2: Computing TF-IDF vectors...", "Step 3: Running cosine similarity...", "Step 4: Filtering Top-5 matches..."].map((msg, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "8px 0",
                    animation: `fadeIn 0.4s ease ${i * 0.4}s both`,
                    opacity: 0,
                    color: "#94a3b8",
                    fontSize: "13px",
                  }}>
                    <span style={{ color: RANK_COLORS[i], fontSize: "16px" }}>⟳</span>
                    {msg}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 1: Results */}
        {step === 1 && results && (
          <div>
            {/* Summary bar */}
            <div style={{
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.3)",
              borderRadius: "14px",
              padding: "20px 24px",
              marginBottom: "24px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              flexWrap: "wrap", gap: "12px",
            }}>
              <div>
                <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "4px" }}>Skills analyzed</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {skills.map((s, i) => (
                    <span key={i} style={{
                      padding: "3px 10px",
                      background: "rgba(99,102,241,0.25)",
                      border: "1px solid rgba(99,102,241,0.4)",
                      borderRadius: "20px",
                      fontSize: "12px",
                      color: "#a5b4fc",
                      fontWeight: 600,
                    }}>{s}</span>
                  ))}
                </div>
              </div>
              <button onClick={reset} style={{
                padding: "10px 20px",
                background: "transparent",
                border: "1px solid rgba(99,102,241,0.4)",
                borderRadius: "10px",
                color: "#a5b4fc",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}>← New Analysis</button>
            </div>

            <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "16px", color: "#e2e8f0" }}>
              Top Career Matches
            </h2>

            {/* Result cards */}
            {results.map((role, i) => (
              <ResultCard key={i} role={role} rank={i} />
            ))}

            {/* Explanation panel */}
            <div style={{
              marginTop: "32px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "16px",
              padding: "24px",
            }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "12px", color: "#a5b4fc" }}>
                How the Algorithm Works
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: "16px" }}>
                {[
                  { icon: "📥", title: "TF-IDF Weighting", desc: "Rare, specific skills get higher importance than common ones." },
                  { icon: "📐", title: "Cosine Similarity", desc: "Measures the angle between your skill vector and each job role." },
                  { icon: "📊", title: "Top-N Filtering", desc: "Only the 5 highest-scoring roles are shown to prevent overload." },
                  { icon: "🚫", title: "No Cold Start", desc: "Content-based filtering works immediately — no history needed." },
                ].map((item, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "10px", padding: "14px" }}>
                    <div style={{ fontSize: "22px", marginBottom: "8px" }}>{item.icon}</div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#e2e8f0", marginBottom: "4px" }}>{item.title}</div>
                    <div style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fillBar { from { width: 0%; } to { width: var(--w); } }
      `}</style>
    </div>
  );
}

function ResultCard({ role, rank }) {
  const pct = Math.round(role.score * 100);
  const color = RANK_COLORS[rank] || "#94a3b8";

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${rank === 0 ? color + "55" : "rgba(255,255,255,0.07)"}`,
      borderRadius: "16px",
      padding: "22px 24px",
      marginBottom: "14px",
      animation: `slideUp 0.4s ease ${rank * 0.1}s both`,
      opacity: 0,
      position: "relative",
      overflow: "hidden",
    }}>
      {rank === 0 && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "2px",
          background: `linear-gradient(90deg, ${color}, transparent)`,
        }} />
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color, background: color + "22", padding: "3px 8px", borderRadius: "6px" }}>
              {RANK_LABELS[rank]}
            </span>
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#f1f5f9", margin: "0 0 10px" }}>{role.title}</h3>

          {/* Score bar */}
          <div style={{ marginBottom: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontSize: "12px", color: "#64748b" }}>Match Score</span>
              <span style={{ fontSize: "13px", fontWeight: 700, color }}>{pct}%</span>
            </div>
            <div style={{ height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{
                "--w": `${pct}%`,
                width: `${pct}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${color}, ${color}88)`,
                borderRadius: "4px",
                animation: "fillBar 0.8s ease 0.3s both",
              }} />
            </div>
          </div>

          {/* Matched skills */}
          <div>
            <span style={{ fontSize: "11px", color: "#475569", marginBottom: "8px", display: "block", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Skills you already have ({role.matchedSkills.length}/{role.skills.length})
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {role.skills.map((s, i) => {
                const matched = role.matchedSkills.includes(s);
                return (
                  <span key={i} style={{
                    padding: "3px 10px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: matched ? 600 : 400,
                    background: matched ? color + "22" : "rgba(255,255,255,0.04)",
                    border: matched ? `1px solid ${color}55` : "1px solid rgba(255,255,255,0.06)",
                    color: matched ? color : "#475569",
                  }}>{s}</span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Circular score */}
        <div style={{ textAlign: "center", minWidth: "72px" }}>
          <svg width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
            <circle cx="36" cy="36" r="30" fill="none" stroke={color} strokeWidth="6"
              strokeDasharray={`${2 * Math.PI * 30}`}
              strokeDashoffset={`${2 * Math.PI * 30 * (1 - pct / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 36 36)"
              style={{ transition: "stroke-dashoffset 1s ease" }}
            />
            <text x="36" y="40" textAnchor="middle" fill={color} fontSize="14" fontWeight="bold">{pct}%</text>
          </svg>
        </div>
      </div>
    </div>
  );
}

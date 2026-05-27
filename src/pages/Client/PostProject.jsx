import { useState, useContext, useEffect } from "react";
import ClientNavbar from "../../components/ClientNavbar";
import NeuralBackground from "../../components/NeuralBackground";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../freelancer.css";
import api from "../../api.js";

const MOCK_MODE = false;

export default function PostProject() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    project_id: "",
    project_title: "",
    description: "",
    skills: "",
    budget_min: "",
    budget_max: "",
    deadline: "",
    type: "Fixed"
  });

  const [scopeResult, setScopeResult] = useState(null);
  const [matchResult, setMatchResult] = useState([]);
  const [loadingScope, setLoadingScope] = useState(false);
  const [loadingMatch, setLoadingMatch] = useState(false);

  useEffect(() => {
    if (!MOCK_MODE && (!user || user.role !== "Client")) {
      navigate("/signin");
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submitProject = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/marketplace/requests", {
        project_id: form.project_id,
        client_id: user.user_id,
        title: form.project_title,
        description: form.description,
        required_skills: form.skills.split(",").map(s => s.trim()),
        budget_range: {
          min: Number(form.budget_min),
          max: Number(form.budget_max)
        },
        deadline: form.deadline,
        project_type: form.type
      }, {
        headers:{
          "x-user-id" : user.user_id
        }
      });

      alert("✅ Project Posted");
    } catch {
      alert("❌ Failed");
    }
  };

  // ✅ AI PROJECT SCOPE
  const handleAIScope = async () => {
    setLoadingScope(true);

    try {
      if (MOCK_MODE) {
        setTimeout(() => {
          setScopeResult({
            status: "draft_ready",
            tier_assigned: "Tier 2",
            draft_data: {
              title: "AI SaaS Dashboard",
              description: "Structured scope generated.",
              timeline_weeks: 6,
              budget_range: { min: 3000, max: 6000 },
              required_skills: ["React", "Node.js", "MongoDB"]
            }
          });
          setLoadingScope(false);
        }, 1000);
        return;
      }

      const response = await api.post("/api/ai/scope-project", {
        client_input: form.description
      },
      {
        headers:{
          "x-user-id" : user.user_id
        }
      });

      setScopeResult(`\n Project Tier: ${response.data.tier_assigned}\n
                      Reasoning : ${response.data.draft_data.reasoning_for_tier}\n
                      Points to note ${response.data.draft_data.deliverables}`);
    } catch {
      alert("AI Scope Failed");
    }

    setLoadingScope(false);
  };

  // ✅ MATCH BEST FREELANCERS
  const handleMatchFreelancers = async () => {
    setLoadingMatch(true);

    try {
      if (MOCK_MODE) {
        setTimeout(() => {
          setMatchResult([
            {
              freelancer_id: "F101",
              match_score: 92,
              bio: "Expert React Developer"
            },
            {
              freelancer_id: "F202",
              match_score: 85,
              bio: "Full Stack Engineer"
            }
          ]);
          setLoadingMatch(false);
        }, 1000);
        return;
      }

      const response = await api.post("/api/ai/match-freelancers", {
        project: {
          title: form.project_title,
          description: form.description,
          required_skills: form.skills.split(",")
        },
        all_freelancers: []
      });

      setMatchResult(response.data);
    } catch {
      alert("Matching Failed");
    }

    setLoadingMatch(false);
  };

  return (
    <>
      <NeuralBackground />
      <ClientNavbar />

      <div className="freelancer-container">
        <h2 className="freelancer-title">Post Project</h2>

        {/* ✅ AI Side Buttons */}
        <div style={{ marginBottom: 25 }}>
          <button className="neon-btn" onClick={handleAIScope}>
            {loadingScope ? "Analyzing..." : "Get AI Project Scope"}
          </button>

          <button
            className="neon-btn"
            style={{ marginLeft: 15 }}
            onClick={handleMatchFreelancers}
          >
            {loadingMatch ? "Matching..." : "Match Best Freelancers"}
          </button>
        </div>

        <div className="freelancer-card">
          <form onSubmit={submitProject}>
            <input className="freelancer-input" placeholder="Project ID" name="project_id" onChange={handleChange} />
            <input className="freelancer-input" placeholder="Project Title" name="project_title" onChange={handleChange} />
            <textarea className="freelancer-input" placeholder="Description" name="description" onChange={handleChange} />
            <input className="freelancer-input" placeholder="Required Skills (comma separated)" name="skills" onChange={handleChange} />
            <input className="freelancer-input" placeholder="Min Budget" name="budget_min" onChange={handleChange} />
            <input className="freelancer-input" placeholder="Max Budget" name="budget_max" onChange={handleChange} />
            <input type="date" className="freelancer-input" name="deadline" onChange={handleChange} />
            <select className="freelancer-input" name="type" onChange={handleChange}>
              <option>Fixed</option>
              <option>Hourly</option>
            </select>

            <button className="neon-btn">Post Project</button>
          </form>
        </div>

        {/* ✅ AI Scope Result */}
        {scopeResult && (
          <div className="ai-review-box">
            <h3>AI Project Scope Result</h3>
            <pre>{JSON.stringify(scopeResult, null, 2)}</pre>
          </div>
        )}

        {/* ✅ Match Result */}
        {matchResult.length > 0 && (
          <div className="ai-review-box">
            <h3>Top Matched Freelancers</h3>
            {matchResult.map((f, i) => (
              <div key={i} style={{ marginBottom: 15 }}>
                <strong>ID:</strong> {f.freelancer_id} <br />
                <strong>Match Score:</strong> {f.match_score}% <br />
                <strong>Bio:</strong> {f.bio}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
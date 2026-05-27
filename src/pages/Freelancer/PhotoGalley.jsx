import { useEffect, useState, useContext } from "react";
import FreelancerNavbar from "../../components/FreelancerNavbar.jsx";
import NeuralBackground from "../../components/NeuralBackground.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import "../../freelancer.css";
import api from "../../api.js";

const MOCK_MODE = true;

export default function PortfolioGallery() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [aiReview, setAiReview] = useState("");
  const [loadingReview, setLoadingReview] = useState(false);

  useEffect(() => {
    if (MOCK_MODE) {
      setProjects([
        {
          title: "AI Portfolio Builder",
          description: "Built an AI-based resume builder.",
          tech_stack: ["React", "Node", "GPT-4"],
          link: "https://demo.com",
          images: []
        }
      ]);
      return;
    }

    if (!user) {
      navigate("/signin");
      return;
    }

    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await api.get(`/api/portfolios/${user.user_id}`);
    setProjects(res.data.projects);
    setProfileData(res.data);
  };

  const saveProjects = async () => {
    const updatedProfile = {
      ...profileData,
      projects: projects
    };

    await api.put(`/api/portfolios/${user.user_id}`, updatedProfile);
    setProfileData(updatedProfile);
    setEditing(false);
  };

  const updateProject = (index, key, value) => {
    const updated = [...projects];
    updated[index][key] = value;
    setProjects(updated);
  };

  // ✅ NEW: AI Portfolio Review
  const handleAIReview = async () => {
    setLoadingReview(true);

    try {
      if (MOCK_MODE) {
        setTimeout(() => {
          setAiReview(
            "AI Portfolio Review:\n\n✅ Strong technical stack.\n⚠ Add measurable impact metrics.\n💡 Improve project descriptions with outcomes.\nOverall Portfolio Score: 8/10"
          );
          setLoadingReview(false);
        }, 1000);
        return;
      }

      const response = await api.post(`/api/ai/review-portfolio?user=${user.user_id}`, {
        portfolio: {
          ...profileData,
          projects: projects
        }
      });

      setAiReview(`Flags: \n ${response.data.backend_findings}\n 
        Suggestions:\n ${response.data.ai_critic_suggestions} `);
    } catch {
      alert("Failed to fetch AI review.");
    }

    setLoadingReview(false);
  };

  return (
    <>
      <NeuralBackground />
      <FreelancerNavbar />

      <div className="freelancer-container">
        <h2 className="freelancer-title">
          My Portfolio Gallery
        </h2>

        {/* ✅ Sidebar AI Review Section */}
        <div style={{ marginBottom: 30 }}>
          <button
            className="neon-btn"
            onClick={handleAIReview}
          >
            {loadingReview ? "Analyzing..." : "Get AI Review"}
          </button>

          {aiReview && (
            <div className="ai-review-box">
              <h3>AI Portfolio Feedback</h3>
              <pre>{aiReview}</pre>
            </div>
          )}
        </div>

        {projects.map((project, i) => (
          <div key={i} style={projectBlock}>
            <Editable
              label="Title"
              value={project.title}
              editing={editing}
              onChange={(val) =>
                updateProject(i, "title", val)
              }
            />

            <Editable
              label="Description"
              value={project.description}
              editing={editing}
              onChange={(val) =>
                updateProject(i, "description", val)
              }
            />

            <Editable
              label="Tech Stack"
              value={
                Array.isArray(project.tech_stack)
                  ? project.tech_stack.join(", ")
                  : project.tech_stack
              }
              editing={editing}
              onChange={(val) =>
                updateProject(i, "tech_stack", val.split(","))
              }
            />

            <Editable
              label="Project Link"
              value={project.link}
              editing={editing}
              onChange={(val) =>
                updateProject(i, "link", val)
              }
            />

            {project.images &&
              project.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt=""
                  style={{ width: 150, marginRight: 10 }}
                />
              ))}
          </div>
        ))}

        {!editing ? (
          <button
            className="neon-btn"
            onClick={() => setEditing(true)}
          >
            Edit Portfolio
          </button>
        ) : (
          <button
            className="neon-btn"
            onClick={saveProjects}
          >
            Save Changes
          </button>
        )}
      </div>
    </>
  );
}

function Editable({ label, value, editing, onChange }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <strong>{label}:</strong>
      {editing ? (
        <input
          className="freelancer-input"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <span> {value || "-"}</span>
      )}
    </div>
  );
}

const projectBlock = {
  padding: 20,
  border: "1px solid #00f5ff44",
  borderRadius: 10,
  marginBottom: 20
};
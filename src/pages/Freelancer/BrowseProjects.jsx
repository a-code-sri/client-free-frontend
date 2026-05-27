import { useEffect, useState } from "react";
import axios from "axios";
import FreelancerNavbar from "../../components/FreelancerNavbar.jsx";
import NeuralBackground from "../../components/NeuralBackground.jsx";
import "../../freelancer.css";
import api from "../../api.js";
export default function BrowseProjects() {
  const MOCK_MODE = false;

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (MOCK_MODE) {
      setProjects([
        {
          id: "P101",
          clientName: "AI Labs",
          title: "AI SaaS Dashboard",
          skills: ["React", "Node.js", "MongoDB"],
          budget: "$3000 - $5000",
          description: "Build a scalable AI dashboard.",
          deadline: "2026-06-01",
          type: "Fixed"
        },
        {
          id: "P102",
          clientName: "Quantum Corp",
          title: "Frontend Optimization",
          skills: ["Next.js", "Tailwind"],
          budget: "$1000 - $2000",
          description: "Improve performance and animations.",
          deadline: "2026-07-15",
          type: "Hourly"
        }
      ]);

      return;
    }

    fetchProjects();
  }, []);

  const fetchProjects = async () => {
  try {
    const res = await api.get("/api/marketplace/requests");
    setProjects(res.data);
  } catch {
    console.log("Failed fetching projects");
  }
};

  return (
    <>
      <NeuralBackground />
      <FreelancerNavbar />

      <div className="freelancer-container">
        <h2 className="freelancer-title">Browse Projects</h2>

        {projects.map((project, i) => (
          <div key={i} className="project-card">
            <h4 className="client-name">
              {project.client_id}
            </h4>

            <h2 className="project-title">
              {project.title}
            </h2>

            <div className="skills-container">
              {(project.required_skills || []).map((skill, idx) => (
                <span key={idx} className="skill-badge">
                  {skill}
                </span>
              ))}
            </div>

            <p className="budget-text">
              Budget: {project.budget_range?.min || 0} - {project.budget_range?.max || 0}
            </p>

            <button
              className="neon-btn"
              onClick={() => setSelectedProject(project)}
            >
              View Details
            </button>
          </div>
        ))}

        {/* ✅ MODAL */}
        {selectedProject && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedProject(null)}
          >
            <div className="modal-card">
              <h2>{selectedProject.title}</h2>

              <p><strong>Project ID:</strong> {selectedProject.project_id}</p>
              <p><strong>Client ID:</strong> {selectedProject.client_id}</p>
              <p><strong>Description:</strong> {selectedProject.description}</p>
              <p><strong>Skills:</strong> {selectedProject.required_skills.join(", ")}</p>
              <p>
                  <strong>Budget:</strong> $
                  {selectedProject.budget_range?.min || 0}
                  -
                  {selectedProject.budget_range?.max || 0}
              </p>
              <p><strong>Deadline:</strong> {eselectdProject.deadline ? selectedProject.deadline.toLocaleString()  : "N/A"}</p>
              <p><strong>Type:</strong> {selectedProject.type}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
import { useEffect, useState, useContext } from "react";
import api from "../../api";
import Navbar from "../../components/Navbar";
import NeuralBackground from "../../components/NeuralBackground";
import { AuthContext } from "../../context/AuthContext";
import "../../freelancer.css";
import CommunityNavbar from "../../components/CommunityNavbar.jsx";
import FreelancerNavbar from "../../components/FreelancerNavbar.jsx";
export default function SkillChallenges() {
  const { user } = useContext(AuthContext);
  const MOCK_MODE = false;

  const [challenges, setChallenges] = useState([]);
  const [selected, setSelected] = useState(null);
  const [submissionLink, setSubmissionLink] = useState("");

  useEffect(() => {
    if (MOCK_MODE) {
      setChallenges([
        {
          id: "C1",
          title: "Design a Dashboard in Figma",
          postedBy: "Admin",
          description: "Create a modern SaaS dashboard UI.",
          featuredLink: "https://top-submission.com"
        }
      ]);
      return;
    }

    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    const res = await api.get("/api/community/challenges/active");
    setChallenges(res.data);
  };

  const submitChallenge = async () => {
    if (!user) {
      alert("Login required");
      return;
    }

    if (!MOCK_MODE) {
      await api.post(`/api/community/challenges/submit`, {
        challenged_id : selected.id,
        freelancer_id : user.user_id,
        link: submissionLink,
        description : ""
      });
    }

    alert("✅ Submission sent!");
  };

  return (
    <>
      <NeuralBackground />
      <FreelancerNavbar />
      <CommunityNavbar />
      <div className="freelancer-container">
        <h2 className="freelancer-title">Skill Challenges</h2>

        {challenges.map((c , index) => (
          <div
            key={c.challenge_id || index}
            className="freelancer-card"
            onClick={() => setSelected(c)}
            style={{ cursor: "pointer" }}
          >
            <h3>{c.title}</h3>
            <p>Posted by: {c.postedBy}</p>
          </div>
        ))}

        {selected && (
          <div
            className="modal-overlay"
            onClick={() => setSelected(null)}
          >
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <h2>{selected.title}</h2>
             <h3>
                <strong>
                  Deadline :{" "}
                  {selected.deadline
                    ? new Date(selected.deadline).toLocaleString()
                    : "N/A"}
                </strong>
              </h3>
              <p>{selected.description}</p>

              <p>
                ⭐ Featured Submission:{" "}
                {selected.submissions?.length > 0 && (
                  <a href={selected.submissions[0].submission_url} target="_blank">
                    View
                  </a>
                )}
              </p>

              <input
                className="freelancer-input"
                placeholder="Submit your link"
                value={submissionLink}
                onChange={(e) =>
                  setSubmissionLink(e.target.value)
                }
              />

              <button className="neon-btn" onClick={submitChallenge}>
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
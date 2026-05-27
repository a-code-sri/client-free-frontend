import { useState, useEffect, useContext } from "react";
import api from "../../api";
import FreelancerNavbar from "../../components/FreelancerNavbar";
import NeuralBackground from "../../components/NeuralBackground";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../freelancer.css";
import CommunityNavbar from "../../components/CommunityNavbar.jsx";
export default function MySkillChallenges() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const MOCK_MODE = false;

  const [challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/signin");
      return;
    }

    if (MOCK_MODE) {
      setChallenges([
        {
          id: "C1",
          title: "Design a Dashboard in Figma",
          submissions: [
            { id: "S1", userId: "U101", link: "https://figma.com/1", featured: true },
            { id: "S2", userId: "U102", link: "https://figma.com/2", featured: false }
          ]
        }
      ]);
      return;
    }

    fetchChallenges();
  }, [user]);

  const fetchChallenges = async () => {
    const res = await api.get(`/api/community/challenges/creator/${user.user_id}`);
    setChallenges(res.data);
  };

  const makeFeatured = async (challengeId, submissionId) => {
    if (!MOCK_MODE) {
      await api.post(`/api/community/challenges/${challengeId}/featured`, {
        submission_id: submissionId
      });
    }
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id === challengeId) {
          return {
            ...c,
            submissions: c.submissions.map((s) => ({
              ...s,
              featured: s.id === submissionId
            }))
          };
        }
        return c;
      })
    );

    setSelectedChallenge((prev) => ({
      ...prev,
      submissions: prev.submissions.map((s) => ({
        ...s,
        featured: s.id === submissionId
      }))
    }));
  };

  return (
    <>
      <NeuralBackground />
      <FreelancerNavbar />
      <CommunityNavbar />
      <div className="freelancer-container">
        <h2 className="freelancer-title">My Skill Challenges</h2>

        {challenges.map((c) => (
          <div
            key={c.id}
            className="freelancer-card"
            onClick={() => setSelectedChallenge(c)}
            style={{ cursor: "pointer" }}
          >
            <h3>{c.title}</h3>
            <p>Submissions: {c.submissions.length}</p>
          </div>
        ))}

        {/* ✅ Submission Modal */}
        {selectedChallenge && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedChallenge(null)}
          >
            <div className="modal-card" style={{ width: 600 }}>
              <h2>{selectedChallenge.title}</h2>

              <table className="neon-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Link</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedChallenge.submissions.map((s) => (
                    <tr key={s.freelancer_id}>
                      <td>{s.freelancer_id}</td>
                      <td>
                        <a href={s.submission_url} target="_blank">
                          View
                        </a>
                      </td>
                      <td>
                        {s.featured ? (
                          <span style={{ color: "#00ff88" }}>⭐ Featured</span>
                        ) : (
                          <span style={{ color: "gray" }}>Pending</span>
                        )}
                      </td>
                      <td>
                        {!s.featured && (
                          <button
                            className="neon-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              makeFeatured(selectedChallenge.id, s.id);
                            }}
                          >
                            Make Featured
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
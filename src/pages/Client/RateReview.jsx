import { useState, useContext, useEffect } from "react";
import ClientNavbar from "../../components/ClientNavbar.jsx";
import NeuralBackground from "../../components/NeuralBackground.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import "../../freelancer.css";
import api from "../../api.js";

export default function RateReview() {
  const { user } = useContext(AuthContext);
  const MOCK_MODE = false;

  const [activeTab, setActiveTab] = useState("post");
  const [reviews, setReviews] = useState([]);

  const [projectId, setProjectId] = useState("");
  const [freelancerId, setFreelancerId] = useState("");
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (activeTab === "my") {
      fetchMyReviews();
    }
  }, [activeTab]);

  const fetchMyReviews = async () => {
    if (MOCK_MODE) {
      setReviews([
        { freelancer_id: "F101", stars: 5, description: "Excellent work!" }
      ]);
      return;
    }

    const res = await api.get(`/api/client/${user.user_id}/reviews`);
    setReviews(res.data);
  };

  const submitReview = async () => {
    await api.post("/api/reviews/", {
      freelancer_id: freelancerId,
      client_id: user.user_id,
      stars : stars,
      description: feedback
    });

    alert("✅ Review Submitted");
  };

  return (
    <>
      <NeuralBackground />
      <ClientNavbar />

      <div className="freelancer-container">
        <h2 className="freelancer-title">Reviews</h2>

        <div style={{ marginBottom: 20 }}>
          <button className="neon-btn" onClick={() => setActiveTab("post")}>
            Post Review
          </button>
          <button className="neon-btn" style={{ marginLeft: 10 }}
            onClick={() => setActiveTab("my")}>
            My Reviews
          </button>
        </div>

        {activeTab === "post" && (
          <div className="freelancer-card">
            <input className="freelancer-input"
              placeholder="Project ID"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            />
            <input className="freelancer-input"
              placeholder="Freelancer ID"
              value={freelancerId}
              onChange={(e) => setFreelancerId(e.target.value)}
            />

            <textarea className="freelancer-input"
              placeholder="Feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />

            <button className="neon-btn" onClick={submitReview}>
              Submit Review
            </button>
          </div>
        )}

        {activeTab === "my" && (
          <div>
            {reviews.map((r, i) => (
              <div key={i} className="freelancer-card">
                <p><strong>Freelancer:</strong> {r.freelancer_id}</p>
                <p><strong>Stars:</strong> {r.stars}</p>
                <p>{r.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
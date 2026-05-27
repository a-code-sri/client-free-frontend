import { useState, useContext } from "react";
import FreelancerNavbar from "../../components/FreelancerNavbar.jsx";
import NeuralBackground from "../../components/NeuralBackground.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import "../../freelancer.css";
import api from "../../api.js";

const MOCK_MODE = 1;

export default function SubmitProposals() {
  const { user } = useContext(AuthContext);
  const [proposalId, setProposalId] = useState("");
  const [form, setForm] = useState({
    projectId: "",
    bidAmount: "",
    timeline: "",
    coverMessage: ""
  });

  const [milestones, setMilestones] = useState([]);
  const [aiReview, setAiReview] = useState("");
  const [loadingReview, setLoadingReview] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      { milestone_id: crypto.randomUUID(), title: "", amount: "", due_date: "" }
    ]);
  };

  const updateMilestone = (index, key, value) => {
    const updated = [...milestones];
    updated[index][key] = value;
    setMilestones(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setProposalId(crypto.randomUUID());
      await api.post("/api/marketplace/proposals", {
        proposal_id: proposalId,
        project_id: form.projectId,
        freelancer_id: user.user_id,
        bid_amount: Number(form.bidAmount),
        estimated_days: Number(form.timeline),
        cover_letter: form.coverMessage,
        proposed_milestones: milestones,
        attachments: []
      });

      alert("✅ Proposal Submitted Successfully!");
    } catch {
      alert("❌ Failed to submit proposal");
    }
  };

  const handleAIReview = async () => {
    if (!form.projectId || !form.bidAmount || !form.timeline || !form.coverMessage) {
      alert("Please fill all fields before requesting AI review.");
      return;
    }

    setLoadingReview(true);

    if (MOCK_MODE) {
      setTimeout(() => {
        setAiReview("✅ Strong proposal. Add clearer milestone breakdown.");
        setLoadingReview(false);
      }, 1000);
      return;
    }

    const response = await api.post("/api/ai/evaluate-proposal", {
      proposal: {
        proposal_id : proposalId,
        bid_amount: Number(form.bidAmount),
        estimated_days: Number(form.timeline),
        cover_letter: form.coverMessage,
        proposed_milestones: milestones
      },
      project: { project_id: form.projectId }
    });

    setAiReview(JSON.stringify(response.data, null, 2));
    setLoadingReview(false);
  };

  return (
    <>
      <NeuralBackground />
      <FreelancerNavbar />

      <div className="freelancer-container">
        <h2 className="freelancer-title">Submit Proposal</h2>

        <div className="freelancer-card">
          <form onSubmit={handleSubmit}>

            <input className="freelancer-input" name="projectId"
              placeholder="Project ID"
              value={form.projectId}
              onChange={handleChange}
            />

            <input type="number" className="freelancer-input"
              name="bidAmount"
              placeholder="Bid Amount"
              value={form.bidAmount}
              onChange={handleChange}
            />

            <input type="number" className="freelancer-input"
              name="timeline"
              placeholder="Timeline (days)"
              value={form.timeline}
              onChange={handleChange}
            />

            <textarea className="freelancer-input"
              name="coverMessage"
              placeholder="Cover Letter"
              value={form.coverMessage}
              onChange={handleChange}
            />

            {/* ✅ Milestones Section */}
            <h3 style={{ marginTop: 20 }}>Proposed Milestones</h3>

            {milestones.map((m, i) => (
              <div key={i} className="freelancer-card" style={{ marginTop: 10 }}>
                <input className="freelancer-input"
                  placeholder="Title"
                  value={m.title}
                  onChange={(e) => updateMilestone(i, "title", e.target.value)}
                />
                <input type="number" className="freelancer-input"
                  placeholder="Amount"
                  value={m.amount}
                  onChange={(e) => updateMilestone(i, "amount", Number(e.target.value))}
                />
                <input type="date" className="freelancer-input"
                  value={m.due_date}
                  onChange={(e) => updateMilestone(i, "due_date", e.target.value)}
                />
              </div>
            ))}

            <button type="button" className="neon-btn" onClick={addMilestone}>
              + Add Milestone
            </button>

            <br /><br />

            <button type="button" className="neon-btn" onClick={handleAIReview}>
              {loadingReview ? "Analyzing..." : "Get AI Review"}
            </button>

            <button className="neon-btn" style={{ marginLeft: 15 }}>
              Submit Proposal
            </button>

          </form>

          {aiReview && (
            <div className="ai-review-box">
              <pre>{aiReview}</pre>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
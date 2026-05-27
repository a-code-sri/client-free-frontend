import { useContext, useEffect, useState } from "react";
import axios from "axios";
import FreelancerNavbar from "../../components/FreelancerNavbar.jsx";
import NeuralBackground from "../../components/NeuralBackground.jsx";
import "../../freelancer.css";
import { AuthContext } from "../../context/AuthContext.jsx";
export default function ActiveContracts() {
  const { user}  = useContext(AuthContext);
  const [contracts, setContracts] = useState([]);
  const [selectedTimeline, setSelectedTimeline] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState(null);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const res = await api.get(
        `api/contracts/freelancer/${user.user_id}/active`
      );
      setContracts(res.data);
    } catch {
      // ✅ MOCK DATA
      setContracts([
        {
          project_id: "P123",
          client_id: "C001",
          proposal_id: "AI Portfolio Builder",
          active_milestones: ["Milestone 1", "Milestone 2", "Final Delivery"],
          total_amount: 3000,
          description: "Develop a full AI-powered resume builder."
        }
      ]);
    }
  };

  return (
    <>
      <NeuralBackground />
      <FreelancerNavbar />

      <div className="freelancer-container">
        <h2 className="freelancer-title">Active Contracts</h2>

        {contracts.map((c, i) => (
          <div key={i} className="contract-card">
            <div>
              <h3>Project ID: {c.project_id}</h3>
              <p><strong>Client ID:</strong> {c.client_id}</p>
              <p><strong>Proposal ID : </strong> {c.proposal_id}</p>
            </div>

            <div className="contract-buttons">
              <button
                className="neon-btn"
                onClick={() => setSelectedTimeline(c)}
              >
                View Timeline
              </button>

              <button
                className="neon-btn"
                onClick={() => setSelectedDetails(c)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}

        {/* ✅ Timeline Modal */}
        {selectedTimeline && (
          <div className="modal-overlay" onClick={() => setSelectedTimeline(null)}>
            <div className="modal-card">
              <h3>Project Timeline</h3>
              <ul>
                {selectedTimeline.active_milestones.map((t, i) => (
                    <li key={i}>
                      {t.title} due :{" "}
                      {t.due_date ? new Date(t.due_date).toLocaleString() : "N/A"}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}

        {/* ✅ Details Modal */}
        {selectedDetails && (
          <div className="modal-overlay" onClick={() => setSelectedDetails(null)}>
            <div className="modal-card">
              <h3>Project Details</h3>
              <p><strong>Bid Amount:</strong> ${selectedDetails.total_amount || 0}</p>
                  <p>
                    Started at :{" "}
                    {selectedDetails.started_at
                      ? new Date(selectedDetails.started_at).toLocaleString()
                      : "N/A"}
                  </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
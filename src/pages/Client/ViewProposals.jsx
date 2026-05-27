import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ClientNavbar from "../../components/ClientNavbar.jsx";
import NeuralBackground from "../../components/NeuralBackground.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import "../../freelancer.css";
import api from "../../api.js";

export default function ViewProposals() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const MOCK_MODE = false;

  const [activeTab, setActiveTab] = useState("contracts");
  const [contracts, setContracts] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [aiReviews, setAiReviews] = useState({});

  useEffect(() => {
    if (!user) return;

    if (activeTab === "contracts") fetchActiveContracts();
  }, [activeTab, user]);

  // ✅ Fetch Active Contracts
  const fetchActiveContracts = async () => {
    if (MOCK_MODE) {
      setContracts([
        {
          contract_id: "C101",
          proposal_id: "P101",
          project_id: "Proj1",
          client_id: user?.user_id,
          freelancer_id: "F101",
          total_amount: 2000,
          active_milestones: [],
          status: "in_progress",
          started_at: "2025-01-01"
        }
      ]);
      return;
    }

    const res = await api.get(
      `/api/contracts/client/${user.user_id}/active`
    );
    setContracts(res.data);
  };

  // ✅ Fetch Proposals
  const fetchByProject = async () => {
    const res = await api.get(
      `/api/marketplace/requests/${projectId}/proposals`
    );
    setProposals(res.data);
    if(res.status == 500){
      alert("This project does not exist");
      return;
    }
  };

  // ✅ Accept Proposal
  const handleAcceptProposal = async (proposal) => {
    if (MOCK_MODE) {
      alert("✅ Proposal Accepted (Mock)");
      return;
    }

    const res2 = await api.post(
      `/api/contracts/accept-proposal/${proposal.proposal_id}`
    );
    if(res2.status.code == 400 || res2.status.code==500){
      alert("Contract acceptance failed!");
      return;
    }
    alert("✅ Contract Created");
  };

  // ✅ End Contract & Pay
  const handleEndContract = async (contract) => {
    if (MOCK_MODE) {
      alert("✅ Contract Ended & Funds Released (Mock)");
      return;
    }

    await api.post(
      `/api/contracts/${contract.contract_id}/complete`
    );

    alert("✅ Contract Completed");
    fetchActiveContracts();
  };

  // ✅ AI Review per Proposal
  const handleAIReview = async (proposal) => {
    if (MOCK_MODE) {
      setAiReviews((prev) => ({
        ...prev,
        [proposal.proposal_id]:
          "✅ Strong bid. Timeline realistic. Consider negotiating price."
      }));
      return;
    }

    const res = await api.post("/api/ai/evaluate-proposal", {
      proposal: {
        proposal_id: proposal.proposal_id,
        bid_amount: proposal.bid_amount,
        estimated_days: proposal.estimated_days,
        cover_letter: proposal.cover_letter,
        proposed_milestones: proposal.proposed_milestones
      },
      project: {
        project_id: proposal.project_id
      }
    });

    setAiReviews((prev) => ({
      ...prev,
      [proposal.proposal_id]: JSON.stringify(res.data, null, 2)
    }));
  };

  return (
    <>
      <NeuralBackground />
      <ClientNavbar />

      <div className="freelancer-container">
        <h2 className="freelancer-title">Client Dashboard</h2>

        {/* ✅ Tabs */}
        <div>
          <button
            className="neon-btn"
            onClick={() => setActiveTab("contracts")}
          >
            View Active Contracts
          </button>

          <button
            className="neon-btn"
            style={{ marginLeft: 10 }}
            onClick={() => setActiveTab("proposals")}
          >
            View Received Proposals
          </button>
        </div>

        {/* ✅ ACTIVE CONTRACTS TAB */}
        {activeTab=="contracts" && contracts.length==0 && 
            <h3>No active Contracts currently</h3>
          }
        {activeTab === "contracts" && contracts.length>0 &&
          contracts.map((c, i) => (
            <div key={i} className="freelancer-card">
              <p><strong>Contract ID:</strong> {c.contract_id}</p>
              <p><strong>Project:</strong> {c.project_id}</p>
              <p><strong>Freelancer:</strong> {c.freelancer_id}</p>
              <p><strong>Total Amount:</strong> ${c.total_amount}</p>
              <p><strong>Status:</strong> {c.status}</p>

              <button
                className="neon-btn"
                onClick={() => handleEndContract(c)}
              >
                End Contract & Pay
              </button>
            </div>
          ))}

        {/* ✅ PROPOSALS TAB */}
        {activeTab === "proposals" && (
          <>
            <div className="freelancer-card" style={{ marginTop: 20 }}>
              <input
                className="freelancer-input"
                placeholder="Enter Project ID"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
              />
              <button
                className="neon-btn"
                onClick={fetchByProject}
              >
                Fetch Proposals
              </button>
            </div>

            {proposals.map((p, i) => (
              <div key={i} className="freelancer-card">
                <p><strong>Proposal:</strong> {p.proposal_id}</p>
                <p><strong>Freelancer:</strong> {p.freelancer_id}</p>
                <p><strong>Status:</strong> {p.status}</p>

                <button
                  className="neon-btn"
                  onClick={() => handleAcceptProposal(p)}
                >
                  Accept Proposal
                </button>

                <button
                  className="neon-btn"
                  style={{ marginLeft: 10 }}
                  onClick={() => handleAIReview(p)}
                >
                  Get AI Review
                </button>

                {aiReviews[p.proposal_id] && (
                  <div className="ai-review-box">
                    <pre>{aiReviews[p.proposal_id]}</pre>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}
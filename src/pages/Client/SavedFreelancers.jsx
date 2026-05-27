import { useState, useEffect, useContext } from "react";
import ClientNavbar from "../../components/ClientNavbar.jsx";
import NeuralBackground from "../../components/NeuralBackground.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import default_photo from "../../assets/defautl_photo.png";
import "../../freelancer.css";
import api from "../../api.js";

export default function SavedFreelancers() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const MOCK_MODE = false;

  const [freelancers, setFreelancers] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "Client") {
      navigate("/signin");
      return;
    }

    if (MOCK_MODE) {
      setFreelancers([
        {
          user_id: "F101",
          full_name: "John Developer",
          email: "john@mail.com",
          bio: "Frontend expert",
          skills: ["React", "Node.js"],
          profilePhoto: ""
        }
      ]);
      return;
    }

    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    const res = await api.get(`/api/bookmarks/${user.user_id}/list`);
    setFreelancers(res.data.saved_freelancers);
  };

  // ✅ View Profile (fetch full profile)
  const handleViewProfile = async (freelancer) => {
    if (MOCK_MODE) {
      setSelectedProfile(freelancer);
      return;
    }

    const res = await api.get(`/api/users/${freelancer.user_id}/profile`);
    setSelectedProfile(res.data);
  };

  // ✅ Remove from Bookmark
  const handleRemove = async (freelancerId) => {
    if (!MOCK_MODE) {
      await api.delete(`/api/bookmarks/remove` , {
        client_id : user.client_id,
        freelancers : [freelancerId]
      });
    }

    setFreelancers((prev) =>
      prev.filter((f) => f.user_id !== freelancerId)
    );

    setSelectedProfile(null);
  };

  // ✅ Add Freelancer (Mock)
  const handleAddFreelancer = async () => {
    if (!MOCK_MODE) {
      await api.post("/api/client/saved-freelancers/add", {
        freelancer_id: "NEW_ID"
      });
    }

    alert("✅ Add Freelancer logic triggered (mock)");
  };

  return (
    <>
      <NeuralBackground />
      <ClientNavbar />

      <div className="freelancer-container">
        <h2 className="freelancer-title">
          Saved Freelancers
        </h2>

        {/* ✅ Add Freelancer Button */}
        <div style={{ marginBottom: 30 }}>
          <button className="neon-btn" onClick={handleAddFreelancer}>
            ➕ Add Freelancer
          </button>
        </div>

        <div className="saved-grid">
          {freelancers.length>0 && freelancers.map((f, i) => (
            <div
              key={i}
              className="saved-card"
              onClick={() => handleViewProfile(f)}
            >
              <img
                src={f.profilePhoto || default_photo}
                alt=""
                className="saved-avatar"
              />
              <p>{f.user_id}</p>
            </div>
          ))}
        </div>

        {/* ✅ PROFILE MODAL */}
        {selectedProfile && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedProfile(null)}
          >
            <div
              className="modal-card"
              onClick={(e) => e.stopPropagation()}
              style={{ position: "relative" }}
            >
              {/* ✅ Remove Icon */}
              <span
                className="remove-icon"
                onClick={() => handleRemove(selectedProfile.user_id)}
              >
                🗑
              </span>

              <div style={{ textAlign: "center" }}>
                <img
                  src={selectedProfile.profilePhoto || default_photo}
                  alt=""
                  className="saved-avatar"
                />
              </div>

              <h2>{selectedProfile.full_name}</h2>
              <p>{selectedProfile.email}</p>
              <p>{selectedProfile.bio}</p>

              <div>
                {selectedProfile.skills?.map((s, i) => (
                  <span key={i} className="skill-badge">
                    {typeof s === "string" ? s : s.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
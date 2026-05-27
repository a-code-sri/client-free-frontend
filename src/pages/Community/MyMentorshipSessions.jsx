import { useState, useEffect, useContext } from "react";
import api from "../../api";
import FreelancerNavbar from "../../components/FreelancerNavbar.jsx";
import NeuralBackground from "../../components/NeuralBackground.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import "../../freelancer.css";
import CommunityNavbar from "../../components/CommunityNavbar.jsx";
export default function MyMentorshipSessions() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const MOCK_MODE = false;

  const [activeTab, setActiveTab] = useState("created");
  const [createdSessions, setCreatedSessions] = useState([]);
  const [bookedSessions, setBookedSessions] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/signin");
      return;
    }

    if (MOCK_MODE) {
      const mockResponse = {
        user_id: "U100",
        offered_sessions: [
          {
            session_id: "S1",
            mentor_id: "U100",
            title: "Master React Architecture",
            description: "Deep dive into scalable systems.",
            price: 0,
            duration_minutes: 60,
            available_slots: 5,
            booked_by: ["U101", "U102"],
            is_active: true,
            created_at: "2025-01-01"
          }
        ],
        booked_sessions: [
          {
            session_id: "S2",
            mentor_id: "U200",
            title: "System Design Basics",
            description: "Learn core system design principles.",
            price: 25,
            duration_minutes: 90,
            available_slots: 0,
            booked_by: ["U100"],
            is_active: false,
            created_at: "2025-02-01"
          }
        ]
      };

      setCreatedSessions(mockResponse.offered_sessions);
      setBookedSessions(mockResponse.booked_sessions);
      return;
    }

    fetchSessions();
  }, [user]);

  const fetchSessions = async () => {
    const res = await api.get(
      `/api/community/mentorship/user/${user.user_id}`
    );

    setCreatedSessions(res.data.offered_sessions);
    setBookedSessions(res.data.booked_sessions);
  };

  const handleEdit = (session) => {
    setEditing(true);
    setEditForm({ ...session });
  };

  const saveEdit = async () => {
    if (!MOCK_MODE) {
      await api.put(
        `/api/community/mentorship/${editForm.session_id}`,
        editForm
      );
    }

    setCreatedSessions((prev) =>
      prev.map((s) =>
        s.session_id === editForm.session_id ? editForm : s
      )
    );

    setEditing(false);
  };

  return (
    <>
      <NeuralBackground />
      <FreelancerNavbar />
      <CommunityNavbar />
      <div className="freelancer-container">
        <h2 className="freelancer-title">
          My Mentorship Sessions
        </h2>

        {/* ✅ Tabs */}
        <div style={{ marginBottom: 20 }}>
          <button
            className="neon-btn"
            onClick={() => setActiveTab("created")}
          >
            My Created Sessions
          </button>

          <button
            className="neon-btn"
            style={{ marginLeft: 10 }}
            onClick={() => setActiveTab("participated")}
          >
            My Participated Sessions
          </button>
        </div>

        {/* ✅ CREATED SESSIONS */}
        {activeTab === "created" &&
          createdSessions.map((s) => (
            <div key={s.session_id} className="freelancer-card">
              {editing && editForm.session_id === s.session_id ? (
                <>
                  <input
                    className="freelancer-input"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        title: e.target.value
                      })
                    }
                  />
                  <textarea
                    className="freelancer-input"
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        description: e.target.value
                      })
                    }
                  />
                  <button className="neon-btn" onClick={saveEdit}>
                    Save
                  </button>
                </>
              ) : (
                <>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                  <p>
                    <strong>Price:</strong>{" "}
                    {s.price === 0 ? "Free" : `$${s.price}`}
                  </p>
                  <p>
                    <strong>Duration:</strong> {s.duration_minutes} mins
                  </p>
                  <p>
                    <strong>Available Slots:</strong>{" "}
                    {s.available_slots}
                  </p>

                  {s.is_active && (
                    <button
                      className="neon-btn"
                      onClick={() => handleEdit(s)}
                    >
                      Edit
                    </button>
                  )}
                </>
              )}
            </div>
          ))}

        {/* ✅ PARTICIPATED SESSIONS */}
        {activeTab === "participated" &&
          bookedSessions.map((s) => (
            <div key={s.session_id} className="freelancer-card">
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <p>
                <strong>Mentor:</strong> {s.mentor_id}
              </p>
              <p>
                <strong>Price:</strong>{" "}
                {s.price === 0 ? "Free" : `$${s.price}`}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {s.is_active ? "Active" : "Completed"}
              </p>
            </div>
          ))}
      </div>
    </>
  );
}
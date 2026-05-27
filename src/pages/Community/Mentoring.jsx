import { useState, useEffect, useContext } from "react";
import api from "../../api";
import Navbar from "../../components/Navbar";
import NeuralBackground from "../../components/NeuralBackground";
import { AuthContext } from "../../context/AuthContext";
import "../../freelancer.css";
import { Navigate } from "react-router-dom";
import CommunityNavbar from "../../components/CommunityNavbar.jsx";
import FreelancerNavbar from "../../components/FreelancerNavbar.jsx";

export default function Mentoring() {
  const { user } = useContext(AuthContext);
  const MOCK_MODE = false;

  const [sessions, setSessions] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (MOCK_MODE) {
      setSessions([
        {
          id: "M1",
          title: "Master React Architecture",
          mentor: "John Dev",
          price: "Free",
          description: "Deep dive into scalable frontend systems.",
          link: "https://zoom-link.com"
        }
      ]);
      return;
    }

    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    const res = await api.get("/api/community/mentorship/active");
    setSessions(res.data);
  };

  const register = async () => {
    if (!user) {
      alert("Login required");
      return;
    }

    await api.post(`/api/community/mentorship/${selected.session_id}/book?mentee_id=${selected.mentor_id}`);
    alert("✅ Registered!");
  };

  return (
    <>
      <NeuralBackground />
      <FreelancerNavbar />
      <CommunityNavbar/>
      <div className="freelancer-container">
        <h2 className="freelancer-title">Mentorship Sessions</h2>
        {
          sessions.length==0 && 
          <h3>No available mentorship sessions</h3>
        }
        {sessions.map((s , index) => (
          <div
            key={index}
            className="freelancer-card"
            onClick={() => setSelected(s)}
            style={{ cursor: "pointer", display: "flex", justifyContent: "space-between" }}
          >
            <div>
              <h3>{s.title}</h3>
              <p>By {s.mentor_id}</p>
            </div>

            <strong>{s.price}</strong>
          </div>
        ))}

        {selected && (
          <div
            className="modal-overlay"
            onClick={() => setSelected(null)}
          >
            <div className="modal-card">
              <h2>{selected.title}</h2>
              <p>{selected.description}</p>

              {user && (
                <p>
                  Session Link:{" "}
                  <a href={selected.link} target="_blank">
                    Join
                  </a>
                </p>
              )}

              <button className="neon-btn" onClick={register}>
                Register
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import FreelancerNavbar from "../../components/FreelancerNavbar.jsx";
import NeuralBackground from "../../components/NeuralBackground.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import "../../freelancer.css";
import api from "../../api.js";

const MOCK_MODE = false;

export default function Skills() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [skills, setSkills] = useState([]);
  const [verifiedSkills, setVerifiedSkills] = useState([]);
  const safeSkills = Array.isArray(skills) ? skills : [];
  const safeVerified = Array.isArray(verifiedSkills) ? verifiedSkills : [];
  useEffect(() => {
    if (!user) {
      navigate("/signin");
      return;
    }

    fetchSkills();
  }, [user]);

  const fetchSkills = async () => {
    try {
      const res1 = await api.get(`/api/portfolios/${user.user_id}`);
      setSkills(res1.data.skills || []);

      const res2 = await api.post(
        `/api/verified_skills/show_valid_skills/${user.user_id}`
      );

      setVerifiedSkills(res2.data.skills || res2.data);

    } catch {
      setSkills([]);
      setVerifiedSkills([]);
    }
  };

  return (
    <>
      <NeuralBackground />
      <FreelancerNavbar />

      <div className="freelancer-container">
        <h2 className="freelancer-title">Skill Matrix</h2>

        <div style={{ marginTop: 30 }}>
          
        {safeSkills.map((skill, i) => (
          <div key={skill || i} style={skillBlock}>
            <h3>
              {skill}
              {safeVerified.includes(skill) && (
                <span style={{ color: "#00ff88", marginLeft: 10 }}>
                  ✔ Verified
                </span>
              )}
            </h3>

            {!safeVerified.includes(skill) && (
              <button
                className="neon-btn"
                onClick={() =>
                  navigate(`/freelancer/skills/test/${skill}`)
                }
              >
                Take Test
              </button>
            )}
          </div>
        ))}
        </div>
      </div>
    </>
  );
}

const skillBlock = {
  padding: 20,
  border: "1px solid #00f5ff44",
  borderRadius: 10,
  marginBottom: 20
};
import { useNavigate } from "react-router-dom";
import NeuralBackground from "../components/NeuralBackground.jsx";
import Navbar from "../components/Navbar.jsx";
export default function SignupRole() {
  const navigate = useNavigate();

  const selectRole = (role) => {
    navigate("/signup-details", { state: { role } });
  };

  return (
    <>
      <NeuralBackground />
      <Navbar />
      <div style={container}>
        <h2>Select Neural Role</h2>

        <div style={cardContainer}>
          <div className="glow-card" onClick={() => selectRole("Freelancer")}>
            🧑‍💻 Freelancer
          </div>

          <div className="glow-card" onClick={() => selectRole("Client")}>
            🧠 Client
          </div>

          <div className="glow-card" onClick={() => selectRole("Both")}>
            ⚡ Both
          </div>
        </div>
      </div>
    </>
  );
}

const container = {
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

const cardContainer = {
  display: "flex",
  gap: 30,
  marginTop: 30,
};
import Navbar from "../components/Navbar.jsx";
import NeuralBackground from "../components/NeuralBackground.jsx";
import { motion } from "framer-motion";
import logo from "../TalentStageLogo.png";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <NeuralBackground />
      <Navbar />

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            top: Math.random() * 100 + "%",
            left: Math.random() * 100 + "%",
            animationDelay: Math.random() * 5 + "s"
          }}
        />
      ))}

      <div style={container}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ display: "flex", alignItems: "center" }}
        >
          <img src={logo} alt="logo" style={{ height: 80, marginRight: 20 }} />
          <h1 className="hero-title">TalentStage</h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{ fontSize: 24, marginTop: 20 }}
        >
          Where Ideas become code.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{ marginTop: 30 }}
        >
          <button className="neon-btn" onClick={() => navigate("/signin")}>
            Login
          </button>
          <button className="neon-btn" onClick={() => navigate("/signup-role")}>
            Sign Up
          </button>
          <button className="neon-btn" onClick={() => navigate("/community/feed")}>
            Community
          </button>
        </motion.div>
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
  textAlign: "center"
};
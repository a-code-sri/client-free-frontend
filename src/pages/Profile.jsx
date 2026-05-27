import { useContext } from "react";
import Navbar from "../components/Navbar.jsx";
import NeuralBackground from "../components/NeuralBackground.jsx";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      <NeuralBackground />
      <Navbar />

      <div style={container}>
        <div className="glow-card">
          <h2>TalenStage Profile</h2>
          <p>Name: {user?.name}</p>
          <p>User Id : {user?.id}</p>
          <button className="neon-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

const container = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
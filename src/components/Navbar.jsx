import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "../TalentStageLogo.png";

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/")}>
        <img src={logo} alt="logo" style={{ height: 40, marginRight: 10 }} />
        <h2 style={{ fontFamily: "Orbitron" }}>TalentStage</h2>
      </div>

      <div className="nav-right">
        {!user ? (
          <>
            <button className="neon-btn" onClick={() => navigate("/signin")}>
              Login
            </button>
            <button className="neon-btn" onClick={() => navigate("/signup-role")}>
              Sign Up
            </button>
            <button className="neon-btn" onClick={() => navigate("/community/feed")}>
              Community
            </button>
          </>
        ) : (
          <div
            onClick={() => navigate("/profile")}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#00f5ff,#8b5cf6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            {user.name?.charAt(0)}
          </div>
        )}
      </div>
    </div>
  );
}

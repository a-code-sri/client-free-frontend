import { NavLink, useNavigate } from "react-router-dom";
import logo from "../TalentStageLogo.png";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export default function FreelancerNavbar() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const linkStyle = ({ isActive }) => ({
    color: isActive ? "#00f5ff" : "white",
    textDecoration: "none",
    marginRight: 20,
    fontWeight: isActive ? "bold" : "normal"
  });

  return (
    <div className="navbar">
      <div
        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        onClick={() => navigate("/freelancer/profile")}
      >
        <img src={logo} alt="logo" style={{ height: 35, marginRight: 10 }} />
        <h3 style={{ fontFamily: "Orbitron" }}>TalentStage</h3>
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <NavLink to="/freelancer/portfolio" style={linkStyle}>
          My Portfolio
        </NavLink>

        <NavLink to="/freelancer/skills" style={linkStyle}>
          Skills
        </NavLink>

        <NavLink to="/freelancer/profile" style={linkStyle}>
          My Profile
        </NavLink>
        <NavLink to="/freelancer/submit-proposal" style={linkStyle}>
          Submit Proposal
        </NavLink>

        <NavLink to="/freelancer/reviews" style={linkStyle}>
          Reviews
        </NavLink>

        <NavLink to="/freelancer/earnings" style={linkStyle}>
          Earnings
        </NavLink>
        <NavLink to="/freelancer/active-contracts" style={linkStyle}>
           Active Contracts
        </NavLink>
        <NavLink to="/freelancer/browse-projects" style={linkStyle}>
          Browse Projects
        </NavLink>
        <NavLink to="/payments" style={linkStyle}>
            Payments
        </NavLink>
        <NavLink to="/community/feed" style={linkStyle}>
          Community
        </NavLink>
        <NavLink to="/payments" style={linkStyle}>
          Payments
        </NavLink>
      </div>
    </div>
  );
}

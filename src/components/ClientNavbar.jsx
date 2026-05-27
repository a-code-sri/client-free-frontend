import { NavLink } from "react-router-dom";
import logo from "../TalentStageLogo.png";

export default function ClientNavbar() {
  const linkStyle = ({ isActive }) => ({
    color: isActive ? "#00f5ff" : "white",
    marginRight: 20,
    textDecoration: "none"
  });

  return (
    <div className="navbar">
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src={logo} alt="" style={{ height: 40, marginRight: 10 }} />
        <h2 style={{ fontFamily: "Orbitron" }}>
          TalentStage
        </h2>
      </div>

      <div>
        <NavLink to="/client/profile" style={linkStyle}>
          My Profile
        </NavLink>

        <NavLink to="/client/post-project" style={linkStyle}>
          Post Project
        </NavLink>

        <NavLink to="/client/view-proposals" style={linkStyle}>
          View Proposals
        </NavLink>
        <NavLink to="/client/rate-review" style={linkStyle}>
          Rate & Review
        </NavLink>

        <NavLink to="/client/saved-freelancers" style={linkStyle}>
          Saved Freelancers
        </NavLink>
        <NavLink to="/payments" style={linkStyle}>
          Payment
        </NavLink>
      </div>
    </div>
  );
}
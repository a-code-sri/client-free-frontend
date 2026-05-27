import { NavLink } from "react-router-dom";
import "../freelancer.css";

export default function CommunityNavbar() {
  const linkStyle = ({ isActive }) => ({
    color: isActive ? "#00f5ff" : "white",
    marginRight: 20,
    textDecoration: "none"
  });

  return (
    <div className="community-navbar">
      <NavLink to="/community/feed" style={linkStyle}>
        Feed
      </NavLink>

      <NavLink to="/community/challenges" style={linkStyle}>
        Skill Challenges
      </NavLink>

      <NavLink to="/community/mentoring" style={linkStyle}>
        Mentoring
      </NavLink>

      <NavLink to="/community/my-posts" style={linkStyle}>
        My Posts
      </NavLink>

      <NavLink to="/community/my-challenges" style={linkStyle}>
        My Challenges
      </NavLink>

      <NavLink to="/community/my-mentorships" style={linkStyle}>
        My Mentorships
      </NavLink>
    </div>
  );
}
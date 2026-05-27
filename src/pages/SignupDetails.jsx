import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import NeuralBackground from "../components/NeuralBackground.jsx";
import ProgressScanner from "../components/ProgressScanner.jsx";
import LoaderOverlay from "../components/LoaderOverlay.jsx";
import Navbar from "../components/Navbar.jsx";
import api from "../api.js";
export default function SignupDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const role = state?.role || "Freelancer";
  const [form, setForm] = useState({});
  const { selectedRole } = useParams();
  const [loading, setLoading] = useState(false);

  const progress =
    (form.name ? 25 : 0) +
    (form.email ? 25 : 0) +
    (form.password ? 25 : 0) +
    ((form.identity || form.linkedin_url) ? 25 : 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      (!form.linkedin_url || form.linkedin_url.trim() === "") &&
      (!form.identity || form.identity.trim() === "")
    ) {
      alert("At least one of LinkedIn URL or Student ID is required");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/api/users/signup", {
        full_name: form.name,
        email: form.email,
        password: form.password,
        role: role,   // ✅ FIXED HERE
        student_id: form.identity?.trim() || null,
        linkedin_url: form.linkedin_url?.trim() || null
      });

      navigate("/", { state: { signupSuccess: true } });

    } catch (err) {
      alert(`Signup Failed: ${err.response?.data?.detail || err.message}`);
    }

    setLoading(false);
};

  return (
    <>
      <NeuralBackground />
      <Navbar />
      {loading && <LoaderOverlay message="Constructing Neural Profile..." />}

      <div style={container}>
        <div className="glow-card" style={{ width: 500 }}>
          <h2>Identity Verification</h2>
          <p>Selected Role: {role}</p>

          <ProgressScanner progress={progress} />

          <form onSubmit={handleSignup}>
            <input name="name" placeholder="Full Name" onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
            <input name="linkedin_url" placeholder="LinkedIn URL" onChange={handleChange} />
            <input name="identity" placeholder="Student ID" onChange={handleChange}/>
            <button className="neon-btn">Complete Registration</button>
          </form>
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
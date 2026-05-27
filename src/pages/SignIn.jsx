import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NeuralBackground from "../components/NeuralBackground.jsx";
import LoaderOverlay from "../components/LoaderOverlay.jsx";
import Navbar from "../components/Navbar.jsx";
import api from "../api.js";
import { AuthContext } from "../context/AuthContext.jsx";

export default function SignIn() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ NEW: form state
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  useEffect(() => {
    if (location.state?.signupSuccess) {
      setMessage("✅ Registration Complete. Please Login.");
    }
  }, [location]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ FIXED HERE
      const res = await api.post("/api/users/login", {
        email: form.email,
        password: form.password
      });

      const user_id = res.data.user_id;

      // ✅ FIX: profile endpoint is GET, not POST
      const res2 = await api.get(`/api/users/${user_id}/profile`);

      login(res2.data);

      if (res.data.role === "Freelancer") {
        navigate("/freelancer/profile");
      } else {
        navigate("/client/profile");
      }

    } catch (err) {
      alert(err.response?.data?.detail || "Invalid Credentials ❌");
    }

    setLoading(false);
  };

  return (
    <>
      <NeuralBackground />
      <Navbar />

      {loading && <LoaderOverlay message="Verifying Neural Identity..." />}

      <div style={container}>
        <div className="glow-card" style={{ width: 400 }}>
          <h2>NeuroGrid Access</h2>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />

            <button className="neon-btn">Login</button>
          </form>

          <p style={{ marginTop: 15 }}>
            No account?{" "}
            <span
              style={{ color: "#00f5ff", cursor: "pointer" }}
              onClick={() => navigate("/signup-role")}
            >
              Initialize Profile
            </span>
          </p>

          {message && <p style={{ marginTop: 10 }}>{message}</p>}
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
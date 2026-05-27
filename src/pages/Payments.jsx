import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import api from "../api.js";
import NeuralBackground from "../components/NeuralBackground.jsx";
import Navbar from "../components/Navbar.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { motion } from "framer-motion";
import "../freelancer.css";

export default function Payment() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const MOCK_MODE = true;

  const query = new URLSearchParams(location.search);
  const type = query.get("type"); 
  const [amount, setAmount] = useState(0);
  const [platformFee, setPlatformFee] = useState(0);
  const [payable, setPayable] = useState(0);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (type === "milestone") {
      const baseAmount = 1000; // Mock milestone
      const fee = baseAmount * 0.1;
      setAmount(baseAmount);
      setPlatformFee(fee);
      setPayable(baseAmount + fee);
    }

    if (type === "pro") {
      const subscriptionAmount = 200; // Mock Pro subscription
      setAmount(subscriptionAmount);
      setPlatformFee(0);
      setPayable(subscriptionAmount);
    }
  }, [type]);

  const handlePayment = async () => {
    setLoading(true);

    try {
      if (!MOCK_MODE) {
        await api.post(`/api/sandbox/subscribe-pro/${user.user_id}`, {
          user_id: user?.user_id,
          amount: payable,
          type
        });
      }

      setTimeout(() => {
        setSuccess(true);
      }, 1500);

    } catch {
      alert("Payment Failed");
    }

    setLoading(false);
  };

  if (success) {
    return (
      <>
        <NeuralBackground />
        <Navbar />

        <div className="freelancer-container">
          <div className="payment-success-card">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="success-tick"
            >
              ✅
            </motion.div>

            <h2>Payment Successful</h2>
            <p>Transaction completed securely.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NeuralBackground />
      <Navbar />

      <div className="freelancer-container">
        <h2 className="freelancer-title">
          Sandbox Payment
        </h2>

        <div className="payment-card">

          <h3>
            {type === "pro"
              ? "TalentStage Pro Subscription"
              : user?.full_name || "Freelancer"}
          </h3>

          <div className="payment-breakdown">
            <p>
              Base Amount: <strong>${amount}</strong>
            </p>

            {type === "milestone" && (
              <p>
                Platform Fee (10%):{" "}
                <strong>${platformFee}</strong>
              </p>
            )}

            <hr />

            <h2>
              Total Payable: ${payable}
            </h2>
          </div>

          <button
            className="neon-btn"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>

        </div>
      </div>
    </>
  );
}
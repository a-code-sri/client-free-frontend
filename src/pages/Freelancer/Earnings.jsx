import { useState, useEffect, useContext } from "react";
import axios from "axios";
import FreelancerNavbar from "../../components/FreelancerNavbar.jsx";
import NeuralBackground from "../../components/NeuralBackground.jsx";
import "../../freelancer.css";
import api from "../../api.js";
import { AuthContext } from "../../context/AuthContext.jsx";
export default function Earnings() {
  
  const [activeTab, setActiveTab] = useState("total");
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({
  total_earned: 0,
  total_commission_paid: 0,
  pending_payments: [],
  withdrawals: []
});
  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const res = await api.get(
        `/api/earnings/${user.user_id}/dashboard`
      );
      setData(res.data);
    } catch {
      // ✅ MOCK DATA
      setData({
        total: 18500,
        pending: [
          {
            projectId: "P123",
            clientId: "C001",
            amount: 1500
          },
          {
            projectId: "P456",
            clientId: "C002",
            amount: 2500
          }
        ],
        withdrawals: [
          { date: "2026-05-01", amount: 5000 },
          { date: "2026-04-01", amount: 3000 }
        ]
      });
    }
  };

  return (
    <>
      <NeuralBackground />
      <FreelancerNavbar />

      <div className="freelancer-container">
        <h2 className="freelancer-title">Earnings Dashboard</h2>

        {/* ✅ Tabs */}
        <div className="earnings-tabs">
          <button
            className={`neon-btn ${activeTab === "total" ? "active" : ""}`}
            onClick={() => setActiveTab("total")}
          >
            Total Earned
          </button>

          <button
            className={`neon-btn ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Payments
          </button>

          <button
            className={`neon-btn ${activeTab === "withdrawals" ? "active" : ""}`}
            onClick={() => setActiveTab("withdrawals")}
          >
            Withdrawals
          </button>
           <button
            className={`neon-btn ${activeTab === "commission" ? "active" : ""}`}
            onClick={() => setActiveTab("commission")}
          >
            Total Commission paid
          </button>
        </div>

        {/* ✅ TOTAL */}
        {activeTab === "total" && (
          <div className="earnings-total-card">
            <h1>${data.total_earned.toLocaleString()}</h1>
            <p>Total Lifetime Earnings</p>
          </div>
        )}

        {/* ✅ PENDING TABLE */}
        {activeTab === "pending" && (
          <div className="earnings-table-card">
            <table className="neon-table">
              <thead>
                <tr>
                  <th>Project ID</th>
                  <th>Client ID</th>
                  <th>Pending Amount ($)</th>
                </tr>
              </thead>
              <tbody>
                {data.pending_payments.map((p, i) => (
                  <tr key={i}>
                    <td>{p.project_id}</td>
                    <td>{p.client_id}</td>
                    <td>${p.pending_amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ✅ WITHDRAWALS TABLE */}
        {activeTab === "withdrawals" && (
          <div className="earnings-table-card">
            <table className="neon-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount ($)</th>
                </tr>
              </thead>
              <tbody>
                {data.withdrawals.map((w, i) => (
                  <tr key={i}>
                    <td>{w.date}</td>
                    <td>${w.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === "commission" && (
          <div className="earnings-total-card">
            <h1>${data.total_commission_paid.toLocaleString()}</h1>
            <p>Total Commission Paid</p>
          </div>
        )}
      </div>
    </>
  );
}
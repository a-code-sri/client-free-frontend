import { useEffect, useState } from "react";
import axios from "axios";
import FreelancerNavbar from "../../components/FreelancerNavbar";
import NeuralBackground from "../../components/NeuralBackground";
import "../../freelancer.css";
const MOCK_MODE = false;
export default function Reviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/api/users/${user_id}/profile`);
      const data = res.data.reviews;
      setReviews(data);
    } catch {
      if(MOCK_MODE){
        setReviews([
            {
            clientId: "Client_123",
            stars: 5,
            feedback: "Excellent delivery and communication!"
            }
        ]);
        return;
      }
      setReviews([
        {
            clientId : "",
            stars : 0,
            feedback : ""
        }
      ])
    }
  };

  return (
    <>
      <NeuralBackground />
      <FreelancerNavbar />

      <div className="freelancer-container">
        <h2 className="freelancer-title">Client Reviews</h2>

        {reviews.map((review, i) => (
          <div key={i} className="freelancer-card">
            <h4>{review.reviewer_id}</h4>

            <div style={{ color: "#FFD700" }}>
              {"⭐".repeat(review.rating)}
            </div>

            <p style={{ marginTop: 10 }}>
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
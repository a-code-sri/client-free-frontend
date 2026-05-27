import { useContext, useState } from "react";
import ClientNavbar from "../../components/ClientNavbar.jsx";
import NeuralBackground from "../../components/NeuralBackground.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useEffect } from "react";
import default_photo from "../../assets/defautl_photo.png";
import { useNavigate } from "react-router-dom";
import api from "../../api.js";
const MOCK_MODE = false;
export default function ClientProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const { user } = useContext(AuthContext);
  const fetchProfile = async () => {
    try {
      const res = await api.get(`/api/users/${user.user_id}/profile`);
      setProfile(res.data);
    } catch(err){
      console.log(`Failed to fetch profile data ${err}`);
      setProfile({
        bio: "",
        education: [],
        work: [],
        full_name : "",
        availability_status:"Not available",
        linkedin_url : ""
      });
    }
  };
  useEffect(() => {
      if(MOCK_MODE==true){
        return;
      }
      if (!user || user.role !== "Client") {
        navigate("/signin");
        return;
      }
      fetchProfile();
    }, [user]);
  return (
    <>
      <NeuralBackground />
      <ClientNavbar />

      <div className="freelancer-container">
        <div className="freelancer-card">

          <div style={{ textAlign: "center" }}>
            <img
              src={default_photo}
              alt=""
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                border: "3px solid #00f5ff"
              }}
            />
          </div>

          <h2 className="freelancer-title">
            Client Profile
          </h2>

          <p><strong>Name:</strong> {profile.full_name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong><a href={profile.linkedin_url} style={{ color: "white" }}> LinkedIn </a></strong></p>

        </div>
      </div>
    </>
  );
}
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import FreelancerNavbar from "../../components/FreelancerNavbar.jsx";
import NeuralBackground from "../../components/NeuralBackground.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import { motion } from "framer-motion";
import "../../freelancer.css";
import default_photo from "../../assets/defautl_photo.png";
import api from "../../api.js";

export default function MyProfile() {
  const { user } = useContext(AuthContext);
  const [skillInput, setSkillInput] = useState("");
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);

  const MOCK_MODE = false;

  useEffect(() => {
    if (MOCK_MODE) {
      setProfile({
        bio: "Vibe Coder",
        hourly_rate: 500,
        availability_status: "Available",
        profilePhoto: "",
        skills: ["React", "Node"],
        education: [],
        work_experience: [],
        projects: []
      });
      return;
    }

    if (!user) {
      navigate("/signin");
    } else {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      // ✅ Fetch user base profile
      const userRes = await api.get(`/api/users/${user.user_id}/profile`);

      // ✅ Try fetching portfolio
      try {
        const portfolioRes = await api.get(
          `/api/portfolios/${user.user_id}`
        );

        setProfile({
          ...userRes.data,
          ...portfolioRes.data
        });

      } catch (err) {
        // ✅ If portfolio not found (404), create fallback locally
        if (err.response?.status === 404) {
          setProfile({
            ...userRes.data,
            bio: "",
            skills: [],
            hourly_rate: 0,
            availability_status: "Not available",
            education: [],
            work_experience: [],
            projects: []
          });
        } else {
          console.log("Portfolio fetch error:", err);
        }
      }

    } catch (err) {
      console.log("Failed to fetch profile:", err);
      setProfile({
        bio: "",
        skills: [],
        hourly_rate: 0,
        availability_status: "Not available",
        education: [],
        work_experience: [],
        projects: []
      });
    }
  };

  const handleSkillChange = async (e) => {
    const value = e.target.value;
    setSkillInput(value);

    if (value.length > 0) {
      try {
        const res = await api.post("/api/verified_skills");
        setSuggestions(res.data);
      } catch {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const addSkill = (skill) => {
    setProfile({
      ...profile,
      skills: [...(profile.skills || []), skill]
    });
    setSkillInput("");
  };

  const saveProfile = async () => {
    try {
      // ✅ 1. Validate Skills
      const validRes = await api.post("/api/ai/valid_skills");

      const validSkills = validRes.data.skills || validRes.data;

      const enteredSkills = profile.skills || [];

      const invalidSkills = enteredSkills.filter(
        (skill) => !validSkills.includes(skill)
      );

      if (invalidSkills.length > 0) {
        alert(`Invalid Skills: ${invalidSkills.join(", ")}`);
        return;
      }

      // ✅ 2. Save portfolio
      await api.put(`/api/portfolios/${user.user_id}`, {
        user_id: user.user_id,
        bio: profile.bio,
        skills: enteredSkills,
        hourly_rate: Number(profile.hourly_rate),
        availability_status: profile.availability_status,
        education: profile.education || [],
        work_experience: profile.work_experience || [],
        projects: profile.projects || []
      });

      // ✅ 3. Fetch verified skills
      const verifiedRes = await api.post(
        `/api/verified_skills/show_valid_skills/${user.user_id}`
      );

      setProfile((prev) => ({
        ...prev,
        verified_skills: verifiedRes.data.skills || verifiedRes.data
      }));

      setEditing(false);

    } catch (err) {
      alert("Update Failed");
    }
  };
  if (!profile) return null;

  return (
    <>
      <NeuralBackground />
      <FreelancerNavbar />

      <div style={container}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glow-card"
          style={{ width: "80%", marginTop: 120 }}
        >
          <h2 style={sectionTitle}>My TalentStage Profile</h2>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
            <img
              src={profile.profilePhoto || default_photo}
              alt="Profile"
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #00f5ff",
                boxShadow: "0 0 20px #00f5ff55"
              }}
            />
          </div>

          <ProfileRow label="Full Name" value={user.full_name} />

          <EditableField
            label="Bio"
            value={profile.bio}
            editing={editing}
            onChange={(val) =>
              setProfile({ ...profile, bio: val })
            }
          />

          <EditableField
            label="Hourly Rate"
            value={profile.hourly_rate}
            editing={editing}
            onChange={(val) =>
              setProfile({ ...profile, hourly_rate: val })
            }
          />

          <EditableField
            label="Availability Status"
            value={profile.availability_status}
            editing={editing}
            onChange={(val) =>
              setProfile({ ...profile, availability_status: val })
            }
          />

          {/* ✅ Skills */}
          <div style={{ marginTop: 20 }}>
            <h3>Skills</h3>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {(profile.skills || []).map((skill, i) => {
                const skillName = typeof skill === "string" ? skill : skill?.name;

                return (
                  <div key={i} style={skillBadge}>
                    {skillName}
                    {(profile.verified_skills || []).includes(skillName) && (
                      <span style={{ marginLeft: 8, color: "#00ff88" }}>✔</span>
                    )}
                  </div>
                );
              })}
            </div>

            {editing && (
              <div style={{ marginTop: 15, display: "flex", gap: 10 }}>
                <input
                  className="freelancer-input"
                  placeholder="Add new skill..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                />

                <button
                  type="button"
                  className="neon-btn"
                  onClick={() => {
                    if (!skillInput.trim()) return;

                    if ((profile.skills || []).includes(skillInput.trim())) {
                      alert("Skill already added");
                      return;
                    }

                    setProfile({
                      ...profile,
                      skills: [...(profile.skills || []), skillInput.trim()]
                    });

                    setSkillInput("");
                  }}
                >
                  Add
                </button>
              </div>
            )}
          </div>

          {/* ✅ Education */}
          <SectionBlock
            title="Education"
            items={profile.education || []}
            editing={editing}
            fields={["institution", "degree", "start_year", "end_year"]}
            onChange={(newData) =>
              setProfile({ ...profile, education: newData })
            }
          />

          {/* ✅ Work Experience */}
          <SectionBlock
            title="Work Experience"
            items={profile.work_experience || []}
            editing={editing}
            fields={[
              "company",
              "role",
              "start_date",
              "end_date",
              "description"
            ]}
            onChange={(newData) =>
              setProfile({
                ...profile,
                work_experience: newData
              })
            }
          />

          <div style={{ marginTop: 30 }}>
            {!editing ? (
              <button
                className="neon-btn"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            ) : (
              <button
                className="neon-btn"
                onClick={saveProfile}
              >
                Save Changes
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}

/* Reusable Components */

function ProfileRow({ label, value }) {
  return (
    <div style={row}>
      <strong>{label}:</strong> <span>{value}</span>
    </div>
  );
}

function EditableField({ label, value, editing, onChange }) {
  return (
    <div style={row}>
      <strong>{label}:</strong>
      {editing ? (
        <input
          className="freelancer-input"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <span>{value || "-"}</span>
      )}
    </div>
  );
}

function SectionBlock({ title, items, editing, fields, onChange }) {
  const addBlock = () => onChange([...items, {}]);

  const updateBlock = (index, key, value) => {
    const updated = [...items];
    updated[index][key] = value;
    onChange(updated);
  };

  return (
    <div style={{ marginTop: 25 }}>
      <h3>{title}</h3>

      {items.map((item, i) => (
        <div key={i} style={blockStyle}>
          {fields.map((field) => (
            <div key={field}>
              <strong>{field}:</strong>
              {editing ? (
                <input
                  className="freelancer-input"
                  value={item[field] || ""}
                  onChange={(e) =>
                    updateBlock(i, field, e.target.value)
                  }
                />
              ) : (
                <span>{item[field] || "-"}</span>
              )}
            </div>
          ))}
        </div>
      ))}

      {editing && (
        <button
          className="neon-btn"
          style={{ marginTop: 10 }}
          onClick={addBlock}
        >
          + Add {title}
        </button>
      )}
    </div>
  );
}

/* Styles */
const container = {
  display: "flex",
  justifyContent: "center"
};

const sectionTitle = {
  fontFamily: "Orbitron",
  fontSize: 28,
  marginBottom: 20
};

const row = { marginBottom: 15 };

const skillBadge = {
  padding: "8px 14px",
  background: "linear-gradient(90deg,#00f5ff,#8b5cf6)",
  borderRadius: 20
};

const blockStyle = {
  marginTop: 15,
  padding: 15,
  border: "1px solid #00f5ff44",
  borderRadius: 10
};
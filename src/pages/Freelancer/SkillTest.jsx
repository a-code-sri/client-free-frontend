import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import FreelancerNavbar from "../../components/FreelancerNavbar.jsx";
import NeuralBackground from "../../components/NeuralBackground.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import api from "../../api.js";
import "../../freelancer.css";

export default function SkillTest() {
  const { skillName } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [practicalQuestion, setPracticalQuestion] = useState("");
  const [test_id, setTestId] = useState("");

  useEffect(() => {
    if (!user) navigate("/signin");
    else fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await api.post(
        `/api/ai/generate-skilltest`,
        {
          user_id: user.user_id,
          skill: skillName
        },
        {
          headers: {
            "x-user-id": user.user_id
          }
        }
      );

      setQuestions(res.data.mcq_questions || []);
      setPracticalQuestion(res.data.practical_question || "");
      setTestId(res.data.test_id);

    } catch (err) {
      console.log("Error fetching questions:", err);
      setQuestions([]);
    }
  };

  const submitTest = async () => {
    try {
      const res2 = await api.post("/api/ai/submit-test", {
        test_id: test_id,
        user_id: user.user_id,
        user_answers: answers
      },
    {
      headers:{
        "x-user-id" : user.user_id
      }
    });

      const passed = res2.data.passed;

      if (passed === true) {
        alert("✅ Test Cleared. Skill Verified!");
        navigate("/freelancer/skills");
      } else {
        alert("❌ Test Failed. Try Again.");
      }

    } catch (err) {
      alert("Submission failed");
    }
  };

  return (
    <>
      <NeuralBackground />
      <FreelancerNavbar />

      <div className="freelancer-container">
        <h2>{skillName} Skill Test</h2>

        {/* ✅ FIX 1: use map instead of forEach */}
        {(questions || []).map((q) => {

          // ✅ FIX 2: ensure options is always array
          const optionsArray = Array.isArray(q.options)
            ? q.options
            : Object.values(q.options || {});

          return (
            <div key={q.question_id} style={{ marginBottom: 20 }}>
              <p>{q.question_text}</p>

              {optionsArray.map((opt, j) => (
                <div key={j}>
                  <input
                    type="radio"
                    name={`q${q.question_id}`}
                    onChange={() =>
                      setAnswers({
                        ...answers,
                        [q.question_id]: opt
                      })
                    }
                  />
                  {opt}
                </div>
              ))}
            </div>
          );
        })}

        <button className="neon-btn" onClick={submitTest}>
          Submit Test
        </button>
      </div>
    </>
  );
}
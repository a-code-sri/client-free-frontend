import { useState, useEffect, useContext } from "react";
import api from "../../api";
import FreelancerNavbar from "../../components/FreelancerNavbar.jsx";
import NeuralBackground from "../../components/NeuralBackground.jsx";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../../src/freelancer.css";
import CommunityNavbar from "../../components/CommunityNavbar.jsx";

export default function MyPosts() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const MOCK_MODE = false;

  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/signin");
      return;
    }

    if (MOCK_MODE) {
      setPosts([
        {
          id: "P1",
          text: "Just launched my new AI tool!",
          likes: 15,
          comments: ["Great!", "Awesome work"]
        },
        {
          id: "P2",
          text: "Tip: Use React.memo for performance.",
          likes: 8,
          comments: ["Thanks!"]
        }
      ]);
      return;
    }

    fetchPosts();
  }, [user]);

  const fetchPosts = async () => {
    const res = await api.get(`/api/community/feed/${user.user_id}`);
    setPosts(res.data);
  };

  const createPost = async () => {
    if (!newPost.trim()) return;

    if (!MOCK_MODE) {
      await api.post("/api/community/feed", {
        author_id: user.user_id,
        content: newPost,
        tags : []
      });
    }

    setPosts([
      {
        id: Date.now().toString(),
        text: newPost,
        likes: 0,
        comments: []
      },
      ...posts
    ]);

    setNewPost("");
  };

  return (
    <>
      <NeuralBackground />
      <FreelancerNavbar />
      <CommunityNavbar />
      <div className="freelancer-container">
        <h2 className="freelancer-title">My Posts</h2>

        {/* ✅ New Post Form */}
        <div className="freelancer-card">
          <textarea
            className="freelancer-input"
            placeholder="Share something with the community..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            rows={3}
          />
          <button className="neon-btn" onClick={createPost}>
            Post
          </button>
        </div>

        {/* ✅ Existing Posts */}
        {posts.map((post) => (
          <div key={post.post_id} className="freelancer-card">
            <p>{post.content}</p>

            <div style={{ marginTop: 15 }}>
              <span style={{ color: "#00f5ff" }}>👍 {post.liked_by.length}</span>
              <span style={{ marginLeft: 20, color: "#8b5cf6" }}>
                💬 {post.comments.length}
              </span>
            </div>

            {/* ✅ Comments */}
            <div style={{ marginTop: 15 }}>
              {post.comments.map((c, i) => (
                <p key={i} style={{ fontSize: 14 }}>
                  💬 {c}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
import { useEffect, useState, useContext } from "react";
import api from "../../api";
import NeuralBackground from "../../components/NeuralBackground.jsx";
import Navbar from "../../components/Navbar.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import "../../freelancer.css";
import CommunityNavbar from "../../components/CommunityNavbar.jsx";
import FreelancerNavbar from "../../components/FreelancerNavbar.jsx";

export default function Feed() {
  const { user } = useContext(AuthContext);
  const MOCK_MODE = false;

  const [feeds, setFeeds] = useState([]);
  const [commentText, setCommentText] = useState({});

  useEffect(() => {
    if (MOCK_MODE) {
      setFeeds([
        {
          id: "1",
          username: "JohnDev",
          profilePhoto: "",
          text: "🚀 Just shipped my SaaS MVP in 3 weeks!",
          likes: 5,
          comments: []
        },
        {
          id: "2",
          username: "AIQueen",
          profilePhoto: "",
          text: "Tip: Always structure your React components cleanly.",
          likes: 10,
          comments: []
        }
      ]);
      return;
    }

    fetchFeeds();
  }, []);

  const fetchFeeds = async () => {
    const res = await api.get("/api/community/feed");
    setFeeds(res.data);
  };

  const handleLike = async (postId) => {
    if (!user) {
      alert("Please login to like posts");
      return;
    }

    if (!MOCK_MODE) {
      await api.post(`/api/community/feed/${postId}/like?user_id=${user.user_id}`);
    }

    setFeeds((prev) =>
      prev.map((f) =>
        f.id === postId ? { ...f, likes: f.likes + 1 } : f
      )
    );
  };

  const handleComment = async (postId) => {
    if (!user) {
      alert("Login to comment");
      return;
    }

    const comment = commentText[postId];
    if (!comment) return;

    if (!MOCK_MODE) {
      await api.post(`/api/community/feed/${postId}/comment`, {
        text: comment
      });
    }

    setFeeds((prev) =>
      prev.map((f) =>
        f.id === postId
          ? { ...f, comments: [...f.comments, comment] }
          : f
      )
    );

    setCommentText({ ...commentText, [postId]: "" });
  };

  return (
    <>
      <NeuralBackground />
      <FreelancerNavbar />
      <CommunityNavbar />
      <div className="freelancer-container">
        <h2 className="freelancer-title">Community Feed</h2>

        {feeds.map((post) => (
          <div key={post.post_id} className="freelancer-card">
            <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
              <div className="feed-avatar" />
              <strong>{post.author_id}</strong>
            </div>

            <p style={{ marginTop: 15 }}>{post.text}</p>

            <div style={{ marginTop: 15 }}>
              <button
                className="neon-btn"
                onClick={() => handleLike(post.post_id)}
              >
                👍 {post.liked_by? post.liked_by.length : 0}
              </button>
            </div>

            <div style={{ marginTop: 15 }}>
              <input
                className="freelancer-input"
                placeholder="Add comment..."
                value={commentText[post.post_id] || ""}
                onChange={(e) =>
                  setCommentText({
                    ...commentText,
                    [post.post_id]: e.target.value
                  })
                }
              />
              <button
                className="neon-btn"
                onClick={() => handleComment(post.post_id)}
              >
                Comment
              </button>
            </div>

            {post.comments.map((c, i) => (
              <p key={i} style={{ marginTop: 5 }}>
                💬 {c}
              </p>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Share2, Bookmark } from "react-feather";
import Header from "./Header";
import Navigation from "../components/navigation";

const ProfilePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openComments, setOpenComments] = useState(new Set());
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const response = await axios.get("/posts/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("API Response:", JSON.stringify(response.data, null, 2));
        let postsData = [];
        if (response.data.profile && Array.isArray(response.data.profile)) {
          postsData = response.data.profile;
        } else if (Array.isArray(response.data)) {
          postsData = response.data;
        } else {
          console.warn("Unexpected response structure:", response.data);
        }
        const postsWithLikeStatus = postsData.map((post) => ({
          ...post,
          isLiked: post.likes.some(
            (likeId) =>
              likeId.toString() ===
              (post.userId._id
                ? post.userId._id.toString()
                : post.userId.toString())
          ),
        }));
        console.log(
          "Processed Posts:",
          JSON.stringify(postsWithLikeStatus, null, 2)
        );
        setPosts(postsWithLikeStatus);
      } catch (err) {
        console.error("Error fetching my posts:", err);
        if (err.response) {
          console.error("Error Response:", err.response.data);
          setError(err.response.data.error || "Failed to fetch posts");
        } else {
          setError("Network error or server unreachable");
        }
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchMyPosts();
    } else {
      setError("Please log in to view your posts");
      setLoading(false);
    }
  }, [token]);

  const handleLike = async (postId) => {
    try {
      const response = await axios.post(
        `/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: response.data.likes,
                isLiked: !post.isLiked,
              }
            : post
        )
      );
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleComment = async (postId, commentText) => {
    try {
      const response = await axios.post(
        `/posts/${postId}/comment`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: response.data.comments,
              }
            : post
        )
      );
    } catch (err) {
      console.error("Error commenting on post:", err);
    }
  };

  const toggleComments = (postId) => {
    setOpenComments((prev) => {
      const next = new Set(prev);
      next.has(postId) ? next.delete(postId) : next.add(postId);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 flex">
      <div className="flex-1 ">
        <Header />
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-8 mt-7">
            My Posts
          </h1>

          {loading ? (
            <div className="animate-pulse space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-800/50 rounded-xl"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-red-400 font-mono text-center">{error}</div>
          ) : posts.length === 0 ? (
            <div className="text-cyan-400 font-mono text-center">
              No posts found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <article
                  key={post._id}
                  className="bg-gray-800/30 backdrop-blur-lg rounded-xl border border-cyan-400/20 p-6 shadow-2xl shadow-cyan-500/10 hover:border-cyan-400/40 transition-all flex flex-col"
                >
                  <header className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-cyan-400/10 rounded-full flex items-center justify-center">
                      <span className="text-cyan-400">
                        {post.userId.email?.[0]?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-cyan-400 font-semibold truncate">
                        {post.userId.email || "Unknown User"}
                      </h3>
                      <time className="text-cyan-400/50 text-sm">
                        {formatDistanceToNow(new Date(post.createdAt))} ago
                      </time>
                    </div>
                  </header>

                  <div className="flex-1 mb-4">
                    <p className="text-cyan-100 font-mono leading-relaxed line-clamp-4">
                      {post.storyText}
                    </p>

                    {post.mediaUrls?.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {post.mediaUrls.map((url, index) => (
                          <div key={index} className="aspect-square relative">
                            {url.match(/\.(mp4|webm)$/i) ? (
                              <video
                                src={url}
                                controls
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <img
                                src={url}
                                alt={`Post media ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-cyan-400/80 mt-auto">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleLike(post._id)}
                        className="flex items-center hover:text-cyan-300 transition-all"
                      >
                        <Heart
                          size={20}
                          className={`mr-1 ${
                            post.isLiked ? "fill-cyan-400" : ""
                          }`}
                        />
                        <span className="text-sm">{post.likes.length}</span>
                      </button>

                      <button
                        onClick={() => toggleComments(post._id)}
                        className="flex items-center hover:text-cyan-300 transition-all"
                      >
                        <MessageCircle
                          size={20}
                          className={`mr-1 ${
                            openComments.has(post._id) ? "text-cyan-300" : ""
                          }`}
                        />
                        <span className="text-sm">{post.comments.length}</span>
                      </button>
                    </div>

                    <div className="flex space-x-2">
                      <button className="hover:text-cyan-300 transition-all">
                        <Share2 size={18} />
                      </button>
                      <button className="hover:text-cyan-300 transition-all">
                        <Bookmark size={18} />
                      </button>
                    </div>
                  </div>

                  {openComments.has(post._id) && (
                    <div className="mt-4 space-y-2">
                      {post.comments.map((comment) => (
                        <div
                          key={comment._id}
                          className="p-2 bg-gray-900/30 rounded border border-cyan-400/10"
                        >
                          <div className="flex items-center">
                            <span className="text-cyan-400 text-sm mr-2">
                              {comment.userId.email?.split("@")[0] || "User"}:
                            </span>
                            <p className="text-cyan-200 text-sm truncate">
                              {comment.text}
                            </p>
                          </div>
                        </div>
                      ))}
                      <input
                        type="text"
                        placeholder="Add comment..."
                        className="w-full p-1 bg-gray-900/20 border border-cyan-400/20 rounded text-sm text-cyan-200"
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && e.target.value.trim()) {
                            handleComment(post._id, e.target.value.trim());
                            e.target.value = "";
                          }
                        }}
                      />
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

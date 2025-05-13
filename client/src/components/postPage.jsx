import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Share2, Bookmark } from "react-feather";
import { Link } from "react-router-dom";
import Header from "./Header";
import Navigation from "./navigation";

const PostPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openComments, setOpenComments] = useState(new Set());
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/posts");
        setPosts(response.data.posts);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

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

  const handleFollow = async (userId) => {
    try {
      await axios.post(
        `/users/${userId}/follow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Followed successfully!");
    } catch (err) {
      console.error("Error following user:", err);
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
      <div className="max-w-3xl mx-auto ">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-8 mt-7">
          Story Feeds
        </h1>

        {loading ? (
          <div className="animate-pulse space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-800/50 rounded-xl"></div>
            ))}
          </div>
        ) : (
          posts.map((post) => (
            <article
              key={post._id}
              className="bg-gray-800/30 backdrop-blur-lg rounded-xl border border-cyan-400/20 p-6 mb-6 shadow-2xl shadow-cyan-500/10 hover:border-cyan-400/40 transition-all"
            >
              <header className="flex items-center mb-4">
                <Link to={`/profile/${post.userId._id}`}>
                  <div className="w-10 h-10 bg-cyan-400/10 rounded-full flex items-center justify-center">
                    <span className="text-cyan-400">
                      {post.userId.email[0].toUpperCase()}
                    </span>
                  </div>
                </Link>
                <div className="ml-4 flex items-center justify-between w-full">
                  <div>
                    <Link to={`/profile/${post.userId._id}`}>
                      <h3 className="text-cyan-400 font-semibold">
                        {post.userId.email}
                      </h3>
                    </Link>
                    <time className="text-cyan-400/50 text-sm">
                      {formatDistanceToNow(new Date(post.createdAt))} ago
                    </time>
                  </div>
                  <button
                    onClick={() => handleFollow(post.userId._id)}
                    className="text-cyan-400 hover:text-cyan-300 transition-all"
                  >
                    Follow
                  </button>
                </div>
              </header>

              <p className="text-cyan-100 mb-6 font-mono leading-relaxed">
                {post.storyText}
              </p>

              {/* Display Media */}
              {post.mediaUrls && post.mediaUrls.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {post.mediaUrls.map((url, index) => (
                    <div key={index} className="relative">
                      {url.match(/\.(mp4|webm)$/i) ? (
                        <video
                          src={url}
                          controls
                          className="w-full h-auto rounded-lg"
                        />
                      ) : (
                        <img
                          src={url}
                          alt={`Post media ${index + 1}`}
                          className="w-full h-auto rounded-lg"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center space-x-6 text-cyan-400/80">
                <button
                  onClick={() => handleLike(post._id)}
                  className="flex items-center hover:text-cyan-300 transition-all"
                >
                  <Heart
                    size={20}
                    className={`mr-2 ${post.isLiked ? "fill-cyan-400" : ""}`}
                  />
                  <span className="text-sm">{post.likes.length}</span>
                </button>

                <button
                  onClick={() => toggleComments(post._id)}
                  className="flex items-center hover:text-cyan-300 transition-all"
                >
                  <MessageCircle
                    size={20}
                    className={`mr-2 ${
                      openComments.has(post._id) ? "text-cyan-300" : ""
                    }`}
                  />
                  <span className="text-sm">{post.comments.length}</span>
                </button>

                <button className="hover:text-cyan-300 transition-all">
                  <Share2 size={20} />
                </button>

                <button className="hover:text-cyan-300 transition-all ml-auto">
                  <Bookmark size={20} />
                </button>
              </div>

              {openComments.has(post._id) && (
                <div className="mt-6 space-y-4 animate-slideDown">
                  {post.comments.map((comment, index) => (
                    <div
                      key={index}
                      className="bg-gray-900/30 p-4 rounded-lg border border-cyan-400/10"
                    >
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 bg-cyan-400/10 rounded-full flex items-center justify-center mr-2">
                          <span className="text-cyan-400 text-xs">
                            {/* {comment.userId.email[0].toUpperCase()} */}
                          </span>
                        </div>
                        <span className="text-cyan-400 text-sm">
                          {comment.userId.email}
                        </span>
                      </div>
                      <p className="text-cyan-200 text-sm">{comment.text}</p>
                    </div>
                  ))}

                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="w-full bg-gray-900/20 border-2 border-cyan-400/20 rounded-lg px-4 py-2 text-cyan-200 placeholder-cyan-400/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && e.target.value.trim()) {
                          handleComment(post._id, e.target.value.trim());
                          e.target.value = "";
                        }
                      }}
                    />
                    <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 bg-gradient-to-r from-cyan-400/30 to-transparent transition-opacity pointer-events-none" />
                  </div>
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default PostPage;

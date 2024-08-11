import React, { useState, useEffect } from 'react';
import LogNav from '../../Components/LogNav/LogNav';
import { useNavigate } from 'react-router-dom';

import './Community.css';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from 'react-share';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const CommunityMy = ({user, userID}) => {
  const navigate = useNavigate();
  const [commentsVisible, setCommentsVisible] = useState({});
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [userVotes, setUserVotes] = useState({});
  const [showShare, setShowShare] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    backend();
  }, [comments]);

  const backend = async () => {
    //push user data 
    const push = {
      posts: posts, //id is the id of post 
      userID: userID, //user name - should pass back email instead 
      comments: comments, //where index is id of post 
      userVotes: userVotes, //whether user liked or disliked post based on post ID 
    }; 

    try {
      const response = await fetch(`${backendUrl}/push`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(push)
      });
      if (response.status === "error") {
        console.error('login error!', response.error);
      } else {
        //need to be able to pull all of this - look at structure below
        const data = await response.json();
      }
    } catch (error) {
      console.error("Error", error); 
    }
    
    // Fetch user information, e.g., username, if necessary
    const pull = {
      userID: userID, 
    }

    try {
      const response = await fetch(`${backendUrl}/my_posts`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(pull)
      });
      if (response.status === "error") {
        console.error('login error!', response.error);
      } else {
        //need to be able to pull all of this - look at structure below
        const data = await response.json();
        setPosts(data['posts']);
        setComments(data['replies']);
      }
    } catch (error) {
      console.error("Error", error); 
    }
    
  };

  const toggleComments = (postId) => {
    setCommentsVisible((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleAddComment = (postId) => {
    if (newComments[postId]?.trim() !== '') {
      setComments((prev) => ({
        ...prev,
        [postId]: [
          ...(prev[postId] || []),
          { id: Date.now()+""+userID, text: newComments[postId], likes: 0, dislikes: 0, username: user },
        ],
      }));
      setNewComments((prev) => ({
        ...prev,
        [postId]: '',
      }));
    }
  };

  const handleNewCommentChange = (postId, value) => {
    setNewComments((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  const handleLike = (postId, commentId) => {
    if (userVotes[commentId] === 'upvote') return; // Prevent multiple likes

    setComments((prev) => ({
      ...prev,
      [postId]: prev[postId].map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              likes: comment.likes + 1,
              dislikes: userVotes[commentId] === 'downvote' ? comment.dislikes - 1 : comment.dislikes,
            }
          : comment
      ),
    }));
    setUserVotes({ ...userVotes, [commentId]: 'upvote' });
  };

  const handleDislike = (postId, commentId) => {
    if (userVotes[commentId] === 'downvote') return; // Prevent multiple dislikes

    setComments((prev) => ({
      ...prev,
      [postId]: prev[postId].map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              dislikes: comment.dislikes + 1,
              likes: userVotes[commentId] === 'upvote' ? comment.likes - 1 : comment.likes,
            }
          : comment
      ),
    }));
    setUserVotes({ ...userVotes, [commentId]: 'downvote' });
  };



  const handleVote = (postId, type) => {
    if (userVotes[postId] === type) return; // Prevent multiple votes

    if (userVotes[postId] === 'upvote' && type === 'downvote') {
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                upvotes: post.upvotes - 1,
                downvotes: post.downvotes + 1,
              }
            : post
        )
      );
      setUserVotes({ ...userVotes, [postId]: type });
      return;
    }

    if (userVotes[postId] === 'downvote' && type === 'upvote') {
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                upvotes: post.upvotes + 1,
                downvotes: post.downvotes - 1,
              }
            : post
        )
      );
      setUserVotes({ ...userVotes, [postId]: type });
      return;
    }

    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              upvotes: type === 'upvote' ? post.upvotes + 1 : post.upvotes,
              downvotes: type === 'downvote' ? post.downvotes + 1 : post.downvotes,
            }
          : post
      )
    );

    setUserVotes({ ...userVotes, [postId]: type });
  };

  const toggleShareButtons = () => {
    setShowShare(!showShare);
  };

  const toggleSidebar = () => {
    // Add this function
    setSidebarOpen(!sidebarOpen);
  };

  const shareUrl = 'blank'; // need to replace with the url of the thing we're sharing
  const title = 'Check this out!';

  return (
    <>
    <div className="community-page">
        <LogNav />
        <div className="community-container">
          <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              {sidebarOpen ? '<' : '>'}
            </button>
            <h1 className="sidebar-title">Community</h1>
            <ul>
              <button onClick={() => navigate('/community')}>
                <li>Home</li>
              </button>
              <button onClick={() => navigate('/community/popular')}>
                <li>Popular</li>
              </button>
              <button onClick={() => navigate('/community/me')}>
                <li>My Posts</li>
              </button>
            </ul>
          </div>

        <div className="posts-container">
          {posts ? (
            <div>
          {posts.map((post) => (
            <div key={post.id} className="post">
              <div className="post-header">
                <span>
                  {post.username}
                </span>
              </div>
              <div className="post-title">{post.title}</div>
              <div className="post-content">
                {post.content}
              </div>
              <div className="post-footer">
                <div className="vote-buttons">
                  <span
                    className={`upvotes ${userVotes[post.id] === 'upvote' ? 'blue-likes' : ''}`}
                    onClick={() => handleVote(post.id, 'upvote')}
                  >
                    {post.upvotes}
                  </span>
                  <span className="downvotes" onClick={() => handleVote(post.id, 'downvote')}>
                    {post.downvotes}
                  </span>
                </div>
                <span className="comments-button" onClick={() => toggleComments(post.id)}>
                  Comments ({comments[post.id]?.length || 0})
                </span>
                <div>
                  <span className="share-button" onClick={toggleShareButtons}>
                    Share
                  </span>
                  {showShare && (
                    <div className="social-share-buttons">
                      <FacebookShareButton url={shareUrl} quote={title}>
                        <FacebookIcon size={32} round />
                      </FacebookShareButton>
                      <TwitterShareButton url={shareUrl} title={title}>
                        <TwitterIcon size={32} round />
                      </TwitterShareButton>
                      <LinkedinShareButton url={shareUrl}>
                        <LinkedinIcon size={32} round />
                      </LinkedinShareButton>
                      <WhatsappShareButton url={shareUrl} title={title} separator=":: ">
                        <WhatsappIcon size={32} round />
                      </WhatsappShareButton>
                    </div>
                  )}
                </div>
              </div>

              {commentsVisible[post.id] && (
                <div className="comments-section">
                  {comments[post.id]?.map((comment) => (
                    <div key={comment.id} className="comment">
                      <div className="comment-content">
                        <strong>{comment.username}</strong>: {comment.text}
                      </div>
                      <div className="comment-votes">
                        <span className="comment-like" onClick={() => handleLike(post.id, comment.id)}>
                          {comment.likes}
                        </span>
                        <span className="comment-dislike" onClick={() => handleDislike(post.id, comment.id)}>
                          {comment.dislikes}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="add-comment">
                    <input
                      type="text"
                      placeholder="Add a comment"
                      value={newComments[post.id] || ''}
                      onChange={(e) => handleNewCommentChange(post.id, e.target.value)}
                    />
                    <button onClick={() => handleAddComment(post.id)}>Post</button>
                  </div>
                </div>
              )}
            </div>
          ))}</div>) : (<div></div>)}
        </div>
      </div>
      </div>
    </>
  );
};

export default CommunityMy;

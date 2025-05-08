import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./card.scss";

function Card({ item, currentUser }) {
  if (item.status === "flagged") {
    return null; // Hide the post card if flagged
  }

  const isOwner = currentUser && item.userId === currentUser.id;
  const [postStatus, setPostStatus] = useState(item.status);
  const navigate = useNavigate();

  const toggleHidePost = async () => {
    try {
      const response = await fetch(`/api/posts/${item.id}/hide`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to toggle post status.");
      }
      const data = await response.json();
      setPostStatus(data.post.status);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="card">
      <Link to={`/${item.id}`} className="imageContainer">
        <img src={item.images[0]} alt="" />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="" />
          <span>{item.address}</span>
        </p>
        <p className="price">  {item.price} đ </p>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="" />
              <span>{item.bedroom} phòng ngủ</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>{item.bathroom} phòng tắm</span>
            </div>
          </div>
          <div className="icons">
            {!isOwner && (
              <>
                <button className="icon" aria-label="Save post">
                  <img src="/save.png" alt="Save" />
                </button>
                <button className="icon" aria-label="Send message">
                  <img src="/chat.png" alt="Chat" />
                </button>
              </>
            )}
            {isOwner && (
              <>
                <button
                  className="icon"
                  aria-label="Edit post"
                  title="Edit your post"
                  onClick={() => {
                    if (item.status !== "flagged") {
                      navigate(`/edit-post/${item.id}`);
                    }
                  }}
                  disabled={item.status === "flagged"}
                >
                  <img src="/edit.png" alt="Edit" />
                </button>
                <button
                  className="icon"
                  aria-label="Hide post"
                  title="Hide your post"
                  onClick={toggleHidePost}
                  style={{ filter: postStatus === "hidden" ? "invert(27%) sepia(91%) saturate(7491%) hue-rotate(355deg) brightness(91%) contrast(101%)" : "none" }}
                  disabled={item.status === "flagged"}
                >
                  <img src="/hide.png" alt="Hide" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;

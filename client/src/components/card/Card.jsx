import { Link } from "react-router-dom";
import "./card.scss";

function Card({ item, currentUser }) {
  const isOwner = currentUser && item.userId === currentUser.id;

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
                    window.location.href = `/edit-post/${item.id}`;
                  }}
                >
                  <img src="/edit.png" alt="Edit" />
                </button>
                <button className="icon" aria-label="Hide post" title="Hide your post">
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

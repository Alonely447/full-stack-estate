import React, { useState } from "react";
import "./userProfileHover.scss";

const UserProfileHover = ({ user, children }) => {
  const [showHover, setShowHover] = useState(false);

  return (
    <div
      className="userProfileHoverWrapper"
      onMouseEnter={() => setShowHover(true)}
      onMouseLeave={() => setShowHover(false)}
      style={{ display: "inline-block", position: "relative" }}
    >
      {children}
      {showHover && (
        <div className="userProfileHoverPopup">
          <img
            src={user.avatar || "/public/noavatar.jpg"}
            alt={user.username}
            className="hoverAvatar"
          />
          <div className="hoverInfo">
            <p className="hoverUsername">{user.username}</p>
            <p className="hoverEmail">{user.email}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileHover;

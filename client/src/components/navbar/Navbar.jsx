import { useContext, useState } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";

function Navbar() {
  const [open, setOpen] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);

  if(currentUser) fetch();

  return (
    <nav>
      <div className="left">
        <a href="/" className="logo">
          <img src="/logo.png" alt="" />
          <span>MyHome</span>
        </a>
        <a href="/">Trang chủ</a>
        <a href="/">Về chúng tôi</a>
        <a href="/">Liên hệ</a>
        <a href="/"></a>
      </div>
      <div className="right">
        {currentUser ? (
          <div className="user">
            <img src={currentUser.avatar || "/noavatar.jpg"} alt="" />
            <span>{currentUser.username}</span>
            <Link to="/profile" className="profile">
              {number > 0 && <div className="notification">{number}</div>}
              <span>Hồ sơ</span>
            </Link>
          </div>
        ) : (
          <>
            <a href="/login">Đăng nhập</a>
            <a href="/register" className="register">
              Đăng ký
            </a>
          </>
        )}
        <div className="menuIcon">
          <img
            src="/menu.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>
        <div className={open ? "menu active" : "menu"}>
          <a href="/">Trang chủ</a>
          <a href="/">Về chúng tôi</a>
          <a href="/">Liên hệ</a>
          {/*<a href="/">Agents</a>*/}
          <a href="/">Đăng nhập</a>
          <a href="/">Đăng ký</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

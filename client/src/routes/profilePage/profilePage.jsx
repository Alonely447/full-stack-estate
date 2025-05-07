import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import "./profilePage.scss";
import apiRequest from "../../lib/apiRequest";
import { Await, Link, useLoaderData, useNavigate, useLocation } from "react-router-dom";
import { Suspense, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

export async function loader() {
  // Fetch posts and chats data for profile page
  const [postResponse, chatResponse] = await Promise.all([
    apiRequest.get("/users/profilePosts"),
    apiRequest.get("/chats"),
  ]);
  return { postResponse, chatResponse };
}

function ProfilePage() {
  const data = useLoaderData();
  const location = useLocation();

  const { updateUser, currentUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const [showChatPopup, setShowChatPopup] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [chatReceiver, setChatReceiver] = useState(null);

  // Check if navigation state has chat info to open popup
  useEffect(() => {
    if (location.state && location.state.chatId && location.state.chatReceiver) {
      setChatId(location.state.chatId);
      setChatReceiver(location.state.chatReceiver);
      setShowChatPopup(true);
      // Clear state after use to prevent reopening on back/forward
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleCloseChatPopup = () => {
    setShowChatPopup(false);
    setChatId(null);
    setChatReceiver(null);
  };

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>Thông tin người dùng</h1>
            <Link to="/profile/update">
              <button>Cập nhật hồ sơ</button>
            </Link>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img src={currentUser.avatar || "noavatar.jpg"} alt="" />
            </span>
            <span>
              Username: <b>{currentUser.username}</b>
            </span>
            <span>
              E-mail: <b>{currentUser.email}</b>
            </span>
            <button onClick={handleLogout}>Logout</button>
          </div>
          <div className="title">
            <h1>Danh sách bài viết</h1>
            <Link to="/add">
              <button>Tạo bài viết mới</button>
            </Link>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) => <List posts={postResponse.data.userPosts} />}
            </Await>
          </Suspense>
          <div className="title">
            <h1>Danh sách lưu</h1>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) => <List posts={postResponse.data.savedPosts} />}
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.chatResponse}
              errorElement={<p>Error loading chats!</p>}
            >
              {(chatResponse) => <Chat chats={chatResponse.data} />}
            </Await>
          </Suspense>
        </div>
      </div>
      {showChatPopup && (
        <div
          className="chatPopup"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            backgroundColor: "white",
            borderRadius: "8px",
            width: "350px",
            height: "500px",
          }}
        >
          <Chat chatId={chatId} receiver={chatReceiver} onClose={handleCloseChatPopup} />
        </div>
      )}
    </div>
  );
}

export default ProfilePage;

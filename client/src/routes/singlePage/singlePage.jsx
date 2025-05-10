import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useNavigate, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import ReportModal from "../../components/reportModal/ReportModal";
import UserProfileHover from "../../components/userProfileHover/UserProfileHover";
import Chat from "../../components/chat/Chat";
import ReactDOM from "react-dom";

function SinglePage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const { currentUser } = useContext(AuthContext);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [chatReceiver, setChatReceiver] = useState(null);
  const chatButtonRef = useRef(null);
  const singlePageRef = useRef(null);
  const [chatPosition, setChatPosition] = useState({ top: 0, left: 0 });

  const navigate = useNavigate();

  const handleSave = async () => {
    if (currentUser && currentUser.id === post.userId) {
      // Disable save for own post
      return;
    }
    setSaved((prev) => !prev);
    if (!currentUser) {
      navigate("/login");
    }
    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (error) {
      console.log(error);
      setSaved((prev) => !prev);
    }
  };

  const handelSendMessage = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (currentUser && currentUser.id === post.userId) {
      // Disable message for own post
      return;
    }
    try {
      const res = await apiRequest.post("/chats", { receiverId: post.userId });
      setChatId(res.data.id);
      setChatReceiver({ id: post.userId, username: post.user.username, avatar: post.user.avatar });
      setShowChatPopup(true);
      const mapContainer = document.querySelector(".mapContainer");
    if (mapContainer && singlePageRef.current) {
      const mapRect = mapContainer.getBoundingClientRect();
      const containerRect = singlePageRef.current.getBoundingClientRect();
      setChatPosition({
        top: mapRect.top - containerRect.top,
        left: mapRect.left - containerRect.left,
      });
    }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenReportModal = () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setShowReportModal(true);
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
  };

  const handleCloseChatPopup = () => {
    setShowChatPopup(false);
    setChatId(null);
    setChatReceiver(null);
  };

  // Helper function to mask last 4 characters of phone number
  const maskPhoneNumber = (phoneNumber) => {
    if (!phoneNumber || phoneNumber.length <= 4) return phoneNumber;
    const visiblePart = phoneNumber.slice(0, phoneNumber.length - 4);
    return visiblePart + "****";
  };

  // State to track if phone number is unmasked for non-logged-in users
  const [unmasked, setUnmasked] = useState(false);

  const handleUnhideClick = () => {
    // Navigate to login page
    navigate("/login");
  };

  return (
    <div className="singlePage" ref={singlePageRef}>
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address},{post.city}</span>
                </div>
                <div className="price">
                  {post.price} đ{post.type === "rent" ? " / tháng" : ""}
                </div>
              </div>
              <div className="user">
                <UserProfileHover user={post.user}>
                  <img src={post.user.avatar} alt="" />
                  <span>{post.user.username}</span>
                </UserProfileHover>
              </div>
            </div>
            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.postDetail.desc),
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">Tổng quan</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>Tiện ích, nội thất</span>
                {post.postDetail.utilities === "owner" ? (
                  <p>Chủ nhà chịu trách nhiệm</p>
                ) : (
                  <p>Người thuê chịu trách nhiệm</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Thú nuôi</span>
                {post.postDetail.pet === "allowed" ? (
                  <p>Cho phép thú nuôi</p>
                ) : (
                  <p>Không cho phép thú nuôi</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/phone.png" alt="" />
              <div className="featureText">
                <span>Liên hệ</span>
                <p>
                  {currentUser
                    ? post.postDetail.phoneNumber
                    : unmasked
                    ? post.postDetail.phoneNumber
                    : maskPhoneNumber(post.postDetail.phoneNumber)}{" "}
                  {!currentUser && !unmasked && (
                    <button
                      className="unhideButton"
                      onClick={handleUnhideClick}
                      style={{
                        color: "white",
                        backgroundColor: "#0a7cfd",
                        border: "none",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Hiện
                    </button>
                  )}
                </p>
              </div>
            </div>
          </div>
          <p className="title">Diện tích</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{post.postDetail.size} m2</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{post.bedroom} phòng ngủ</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>{post.bathroom} Phòng tắm</span>
            </div>
          </div>
          <p className="title">Địa điểm gần đó</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>Trường học</span>
                <p>
                  {post.postDetail.school > 999
                    ? post.postDetail.school / 1000 + "km"
                    : post.postDetail.school + "m"}{" "}
                  away
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/bus.png" alt="" />
              <div className="featureText">
                <span>Trạm xe bus</span>
                <p>{post.postDetail.bus}m away</p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Nhà hàng</span>
                <p>{post.postDetail.restaurant}m away</p>
              </div>
            </div>
          </div>
          <p className="title">Địa chỉ</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>
          <div className="buttons">
            <button
              ref={chatButtonRef}
              onClick={handelSendMessage}
              disabled={currentUser && currentUser.id === post.userId}
              title={currentUser && currentUser.id === post.userId ? "Cannot message yourself" : ""}
            >
              <img src="/chat.png" alt="" />
              Gửi tin nhắn
            </button>
            <button
              className="buttons"
              onClick={handleOpenReportModal}
              disabled={currentUser && currentUser.id === post.userId}
              title={currentUser && currentUser.id === post.userId ? "Cannot report your own post" : ""}
            >
              Report Post
            </button>
            <button
              onClick={handleSave}
              disabled={currentUser && currentUser.id === post.userId}
              style={{
                backgroundColor: saved ? "#fece51" : "white",
                cursor: currentUser && currentUser.id === post.userId ? "not-allowed" : "pointer",
              }}
              title={currentUser && currentUser.id === post.userId ? "Cannot save your own post" : ""}
            >
              <img src="/save.png" alt="" />
              {saved ? "Đã lưu" : "Lưu bài viết"}
            </button>
          </div>
        </div>
      </div>
      {showReportModal && (
        <ReportModal postId={post.id} suspectId={post.userId} onClose={handleCloseReportModal} />
      )}
      {showChatPopup &&
        ReactDOM.createPortal(
          <div
            className="chatPopup"
            style={{
              position: "absolute",
              top: chatPosition.top,
              left: chatPosition.left,
              zIndex: 10000,
            }}
          >
            <Chat chatId={chatId} receiver={chatReceiver} onClose={handleCloseChatPopup} />
          </div>,
          document.body
        )
      }
    </div>
  );
}

export default SinglePage;

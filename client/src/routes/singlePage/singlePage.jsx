import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useNavigate, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";

function SinglePage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const { currentUser } = useContext(AuthContext);
  console.log("in single page",post);
  console.log(post.userId);
  console.log(post.latitude);
  console.log(post.longitude);
  const navigate = useNavigate();

 /* const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
    }
    // AFTER REACT 19 UPDATE TO USEOPTIMISTIK HOOK
    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };*/

  const handleSave= async ()=>{
    setSaved((prev)=> !prev);
    if(!currentUser){
      redirect("/login")
    }
      try {
        await apiRequest.post("/users/save",{postId : post.id})
      } catch (error) {
        console.log(error);
        setSaved((prev)=> !prev)
      }
   }
  
  
   const handelSendMessage =async ()=>{
        try {
          await apiRequest.post("/chats",{receiverId : post.userId})
           navigate("/profile")
        } catch (error) {
          console.log(error);
        }
   }
  
  /*const handleShowDirection = ()=>{
    const url = `https://www.google.com/maps?q=${post.latitude},${post.longitude}`;
    window.open(url, '_blank');    
  }*/

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                </div>
                <div className="price">{post.price} đ </div>
              </div>
              <div className="user">
                <img src={post.user.avatar} alt="" />
                <span>{post.user.username}</span>
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
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Lợi ích</span>
                <p>{post.postDetail.income}</p>
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
              <img src="/pet.png" alt="" />
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
            <button onClick={handelSendMessage}>
              <img src="/chat.png" alt="" />
              Gửi tin nhắn
            </button>
            {/*<button onClick={handleShowDirection}> Show Direction</button>*/}
            <button
              onClick={handleSave}
              style={{
                backgroundColor: saved ? "#fece51" : "white",
              }}
            >
              <img src="/save.png" alt="" />
              {saved ? "Đã lưu" : "Lưu bài viết"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;

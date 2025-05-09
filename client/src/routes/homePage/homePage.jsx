import { useContext, useEffect, useState } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";
import Card from "../../components/card/Card";

function HomePage() {
  const { currentUser } = useContext(AuthContext);
  const [hotPost, setHotPost] = useState(null);

  useEffect(() => {
    const fetchHotPost = async () => {
      try {
        const response = await fetch("/api/posts/hot");
        if (!response.ok) {
          throw new Error("Failed to fetch hot post");
        }
        const data = await response.json();
        setHotPost(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchHotPost();
  }, []);

  return (
    <div className="homePage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">Tìm kiếm tổ ấm mơ ước của bạn</h1>
          <p>
            Chào mừng đến với MyHome, nơi bạn không chỉ tìm thấy một ngôi nhà, 
            mà còn tìm thấy một cộng đồng, một phong cách sống. 
            Hãy bắt đầu hành trình khám phá không gian sống hoàn hảo của bạn ngay hôm nay!
          </p>
          <SearchBar />
          {hotPost && (
            <div className="hotPostContainer">
              <h2>Tin đáng chú ý</h2>
              <Card item={hotPost} currentUser={currentUser} />
            </div>
          )}
          <div className="boxes">
            <div className="box">
              <h1></h1>
              <h2></h2>
            </div>
            <div className="box">
              <h1></h1>
              <h2></h2>
            </div>
            <div className="box">
              <h1></h1>
              <h2></h2>
            </div>
          </div>
        </div>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default HomePage;

import { useContext } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";

function HomePage() {

  const {currentUser} = useContext(AuthContext)

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

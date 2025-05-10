import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../newPostPage/newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { AuthContext } from "../../context/AuthContext";

function EditPostPage() {
  const { id } = useParams();
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await apiRequest.get(`/posts/${id}`);
        const post = res.data;
        if (post.userId !== currentUser.id) {
          setError("You are not authorized to edit this post.");
          setLoading(false);
          return;
        }
        setValue(post.postDetail?.desc || "");
        setImages(post.images || []);
        setLat(post.latitude || "");
        setLon(post.longitude || "");
        // Populate form fields after loading
        const form = document.forms[0];
        if (form) {
          form.title.value = post.title || "";
          form.price.value = post.price || "";
          form.address.value = post.address || "";
          form.city.value = post.city || "";
          form.bedroom.value = post.bedroom || "";
          form.bathroom.value = post.bathroom || "";
          form.type.value = post.type || "rent";
          form.property.value = post.property || "apartment";
          form.utilities.value = post.postDetail?.utilities || "owner";
          form.pet.value = post.postDetail?.pet || "allowed";
          form.phoneNumber.value = post.postDetail?.phoneNumber || "";
          form.size.value = post.postDetail?.size || "";
          form.school.value = post.postDetail?.school || "";
          form.bus.value = post.postDetail?.bus || "";
          form.restaurant.value = post.postDetail?.restaurant || "";
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to load post data.");
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, currentUser]);

  const fetchCoordinates = async (address, city) => {
    try {
      const fullAddress = `${address}, ${city}`;
      const geocodeResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          fullAddress
        )}`
      );
      const geocodeData = await geocodeResponse.json();
      if (geocodeData.length === 0) {
        throw new Error("Unable to find location");
      }
      const { lat, lon } = geocodeData[0];
      setLat(lat);
      setLon(lon);
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      setError(" ");
    }
  };

  const handleAddressChange = (e) => {
    const form = e.target.form;
    const address = form.address.value;
    const city = form.city.value;
    if (address && city) {
      fetchCoordinates(address, city);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      currentUser.isSuspended &&
      currentUser.suspensionExpiresAt &&
      new Date(currentUser.suspensionExpiresAt) > new Date()
    ) {
      setError(
        `You are suspended until ${new Date(
          currentUser.suspensionExpiresAt
        ).toLocaleString()}. You cannot edit posts.`
      );
      return;
    }

    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      await apiRequest.put(`/posts/${id}`, {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          type: inputs.type,
          property: inputs.property,
          latitude: String(lat),
          longitude: String(lon),
          images: images,
        },
        postDetail: {
          desc: value,
          utilities: inputs.utilities,
          pet: inputs.pet,
          phoneNumber: inputs.phoneNumber,
          size: parseInt(inputs.size),
          school: parseInt(inputs.school),
          bus: parseInt(inputs.bus),
          restaurant: parseInt(inputs.restaurant),
        },
      });
      navigate("/" + id);
    } catch (err) {
      console.log(err);
      setError("Failed to update post. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading post data...</div>;
  }

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Edit Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Tiêu đề</label>
              <input id="title" name="title" type="text" />
            </div>
            <div className="item">
              <label htmlFor="price">Giá tiền</label>
              <input id="price" name="price" type="number" />
            </div>
            <div className="item">
              <label htmlFor="address">Địa chỉ</label>
              <input
                id="address"
                name="address"
                type="text"
                onChange={handleAddressChange}
              />
            </div>
            <div className="item description">
              <label htmlFor="desc">Mô tả</label>
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </div>
            <div className="item">
              <label htmlFor="city">Thành phố</label>
              <input id="city" name="city" type="text" onChange={handleAddressChange} />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Số phòng ngủ</label>
              <input min={1} id="bedroom" name="bedroom" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Số nhà tắm</label>
              <input min={1} id="bathroom" name="bathroom" type="number" />
            </div>
            <div className="item">
              <label htmlFor="latitude">Vĩ độ</label>
              <input id="latitude" name="latitude" type="text" value={lat} readOnly />
            </div>
            <div className="item">
              <label htmlFor="longitude">Kinh độ</label>
              <input id="longitude" name="longitude" type="text" value={lon} readOnly />
            </div>
            <div className="item">
              <label htmlFor="type">Loại hình</label>
              <select name="type">
                <option value="rent" defaultChecked>
                  Rent
                </option>
                <option value="buy">Buy</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="type">Kiểu nhà</label>
              <select name="property">
                <option value="apartment">Căn hộ</option>
                <option value="house">Nhà đất</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="utilities">Quản lý tiện ích</label>
              <select name="utilities">
                <option value="owner">Chủ sở hữu chịu trách nhiệm</option>
                <option value="tenant">Người thuê chịu trách nhiệm</option>
                <option value="shared">Chia</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">Thú nuôi</label>
              <select name="pet">
                <option value="allowed">Cho phép</option>
                <option value="not-allowed">Không cho phép</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="phoneNumber">Số điện thoại</label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                placeholder="Phone Number"
              />
            </div>
            <div className="item">
              <label htmlFor="size">Diện tích (m2)</label>
              <input min={0} id="size" name="size" type="number" />
            </div>
            <div className="item">
              <label htmlFor="school">Khoảng cách trường học</label>
              <input min={0} id="school" name="school" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bus">Khoảng cách bến xe buýt</label>
              <input min={0} id="bus" name="bus" type="number" />
            </div>
            <div className="item">
              <label htmlFor="restaurant">Khoảng cách nhà hàng</label>
              <input min={0} id="restaurant" name="restaurant" type="number" />
            </div>
            <button className="sendButton">Update</button>
            {error && <span>{error}</span>}
          </form>
        </div>
      </div>
      <div className="sideContainer">
        {images.map((image, index) => (
          <img src={image} key={index} alt="" />
        ))}
        <UploadWidget
          uwConfig={{
            multiple: true,
            cloudName: "datstorage",
            uploadPreset: "estate",
            folder: "posts",
          }}
          setState={setImages}
        />
      </div>
    </div>
  );
}

export default EditPostPage;

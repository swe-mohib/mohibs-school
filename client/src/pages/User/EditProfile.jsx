import { useState } from "react";
import toast from "react-hot-toast";
import { BsPersonCircle } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import HomeLayout from "../../layout/HomeLayout";
import { getUserData, updateProfile } from "../../store/slices/authSlice";

function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth).data._id;

  const [updateProfileData, setUpdateProfileData] = useState({
    id: userId,
    previewImage: "",
    fullName: "",
    avatar: "",
  });

  const handleImageUpload = (e) => {
    e.preventDefault();
    const uploadedImage = e.target.files[0];

    if (uploadedImage) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", function () {
        setUpdateProfileData({
          ...updateProfileData,
          avatar: uploadedImage,
          previewImage: this.result,
        });
      });
    }
  };
  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setUpdateProfileData({
      ...updateProfileData,
      [name]: value,
    });
  };

  const handleUpdateForm = async (e) => {
    e.preventDefault();

    if (!updateProfileData.fullName && !updateProfileData.avatar) {
      toast.error("Fill the form to update");
      return;
    }
    if (updateProfileData.fullName && updateProfileData.fullName.length < 5) {
      toast.error("Name cannot be of less than 5 characters");
      return;
    }

    const formData = new FormData();
    if (updateProfileData.fullName)
      formData.append("fullName", updateProfileData.fullName);
    if (updateProfileData.avatar)
      formData.append("avatar", updateProfileData.avatar);

    // dispatch update from action
    const res = await dispatch(updateProfile([updateProfileData.id, formData]));
    if (res?.payload?.success) {
      setUpdateProfileData({
        id: userId,
        previewImage: "",
        fullName: "",
        avatar: "",
      });
      await dispatch(getUserData());
      navigate("/user/profile");
    }
  };
  return (
    <HomeLayout>
      <div className="min-h-screen flex  justify-center items-center">
        <form
          onSubmit={handleUpdateForm}
          className="flex flex-col justify-center gap-3 p-12 rounded-lg text-white w-3/4 md:w-1/3 shadow-[0_0_10px_black]"
        >
          <div className="mb-4 flex justify-between relative items-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="absolute left-0 p-3 cursor-pointer text-xl"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-3xl font-semibold text-center m-auto relative">
              Edit Profile
            </h1>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="avatar" className="cursor-pointer">
              {updateProfileData.previewImage ? (
                <img
                  src={updateProfileData.previewImage}
                  alt="Profile Image"
                  className="w-40 h-40 rounded-full m-auto border-2"
                />
              ) : (
                <BsPersonCircle className="w-40 h-40 rounded-full m-auto border-2" />
              )}
            </label>
            <input
              type="file"
              name="avatar"
              id="avatar"
              onChange={handleImageUpload}
              className="hidden"
              accept=".png,.jpg,.jpeg,.svg "
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="fullName" className="font-semibold text-xl">
              Name:
            </label>
            <input
              type="text"
              placeholder="Enter you full name..."
              name="fullName"
              id="fullName"
              className="bg-transparent border px-2 py-1"
              value={updateProfileData.fullName}
              onChange={handleInputChange}
            />
          </div>
          <button
            type="submit"
            className="bg-yellow-600 hover:bg-yellow-400 transition-all ease-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
          >
            Submit
          </button>
        </form>
      </div>
    </HomeLayout>
  );
}

export default EditProfile;

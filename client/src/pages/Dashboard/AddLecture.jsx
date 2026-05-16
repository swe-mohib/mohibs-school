import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../layout/HomeLayout";
import { addLecture } from "../../store/slices/lectureSlice";

function AddLecture() {
  const dispacth = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [lectureData, setLectureData] = useState({
    courseId: state._id,
    title: "",
    description: "",
    lecture: "",
    previewLecture: "",
  });

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setLectureData({
      ...lectureData,
      [name]: value,
    });
  };

  const handleLectureUpload = (e) => {
    e.preventDefault();
    const uploadedLecture = e.target.files[0];
    const lectureSource = window.URL.createObjectURL(uploadedLecture);

    if (uploadedLecture) {
      setLectureData({
        ...lectureData,
        lecture: uploadedLecture,
        previewLecture: lectureSource,
      });
    }
  };

  const handleAddLecture = async (e) => {
    e.preventDefault();
    if (
      !lectureData.title ||
      !lectureData.description ||
      !lectureData.lecture
    ) {
      toast.error("All feilds are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", lectureData.title);
    formData.append("description", lectureData.description);
    formData.append("lecture", lectureData.lecture);

    const res = await dispacth(addLecture([lectureData.courseId, formData]));
    if (res?.payload?.success) {
      setLectureData({
        courseId: state?._id,
        title: "",
        description: "",
        lecture: "",
        previewLecture: "",
      });
    }
  };

  useEffect(() => {
    console.log(state);
    if (!state) navigate("/courses");
  }, []);

  return (
    <HomeLayout>
      <div className="flex justify-center items-center min-h-screen">
        <form
          onSubmit={handleAddLecture}
          className="px-14 pb-10 pt-16 my-10 rounded-lg text-white shadow-[0_0_10px_black] relative  w-3/4 md:w-1/3 overflow-hidden"
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-10 p-3 cursor-pointer text-xl"
          >
            <FaArrowLeft />
          </button>
          <h3 className="text-lg w-full text-center font-semibold bg-yellow-600 inline-block px-2 absolute top-0 right-0">
            {state.title}
          </h3>
          <h1 className="text-3xl font-bold text-center mb-4">Add Lecture</h1>

          <div className="flex flex-col gap-1 py-1">
            <label htmlFor="title" className="font-semibold text-xl">
              Title:
            </label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Enter the lecture's title"
              value={lectureData.title}
              onChange={handleInputChange}
              className="bg-transparent p-2 border"
            />
          </div>
          <div className="flex flex-col gap-1 py-1">
            <label htmlFor="description" className="font-semibold text-xl">
              Description:
            </label>
            <textarea
              type="text"
              name="description"
              id="description"
              placeholder="Enter the lecture's description"
              value={lectureData.description}
              onChange={handleInputChange}
              className="bg-transparent p-2 border resize-none h-24"
            />
          </div>
          <div className="flex flex-col gap-1 py-1">
            <label htmlFor="lecture" className="cursor-pointer w-full">
              {lectureData.previewLecture ? (
                <div className="w-full h-auto border mt-2 relative">
                  <video
                    controls
                    src={lectureData.previewLecture}
                    alt="lecture video"
                    className="max-w-full max-h-full"
                  />
                  <button
                    onClick={() =>
                      setLectureData({ ...lectureData, previewLecture: "" })
                    }
                    className="text-red-600 text-4xl p-1 absolute top-0 right-0"
                  >
                    <RxCross2 />
                  </button>
                </div>
              ) : (
                <div className="font-semibold text-xl">
                  Lecture:
                  <div className="w-full h-48 border mt-1 flex justify-center items-center">
                    Upload course lecture
                  </div>
                </div>
              )}
            </label>
            <input
              type="file"
              name="lecture"
              id="lecture"
              className="hidden"
              accept=".mp4"
              onChange={handleLectureUpload}
            />
          </div>

          <button
            type="submit"
            className="my-4 w-full bg-yellow-700 rounded-md border p-2 text-xl font-semibold"
          >
            Add Lecture
          </button>
        </form>
      </div>
    </HomeLayout>
  );
}

export default AddLecture;

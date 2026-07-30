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
    courseId: state?._id,
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
    if (!state) navigate("/courses");
  }, [navigate, state]);

  return (
    <HomeLayout>
      <div className="page-wrap flex justify-center items-center">
        <form
          onSubmit={handleAddLecture}
          className="surface relative my-6 w-full max-w-xl overflow-hidden px-8 pb-8 pt-16"
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-10 p-3 cursor-pointer text-xl"
          >
            <FaArrowLeft />
          </button>
          <h3 className="w-full text-center font-semibold bg-blue-600 text-white inline-block px-2 py-3 absolute top-0 right-0">
            {state?.title}
          </h3>
          <h1 className="display-font text-3xl font-bold text-center mb-5">
            Add lesson
          </h1>

          <div className="flex flex-col gap-1 py-1">
            <label htmlFor="title" className="font-semibold">
              Title:
            </label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Enter the lecture's title"
              value={lectureData.title}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3"
            />
          </div>
          <div className="flex flex-col gap-1 py-1">
            <label htmlFor="description" className="font-semibold">
              Description:
            </label>
            <textarea
              type="text"
              name="description"
              id="description"
              placeholder="Enter the lecture's description"
              value={lectureData.description}
              onChange={handleInputChange}
              className="h-24 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3"
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

          <button type="submit" className="btn-primary my-4 w-full">
            Add Lecture
          </button>
        </form>
      </div>
    </HomeLayout>
  );
}

export default AddLecture;

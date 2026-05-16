import { useState } from "react";
import toast from "react-hot-toast";
import { FaRegImage } from "react-icons/fa6";
import { useDispatch } from "react-redux";

import HomeLayout from "../../layout/HomeLayout";
import { createCourse } from "../../store/slices/courseSlice";

function CreateCourse() {
  const dispacth = useDispatch();

  const [previewImage, setPreviewImage] = useState("");
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "",
    createdBy: "",
    thumbnail: "",
  });

  const handleThumbnailUpload = (e) => {
    e.preventDefault();

    // getting the thumbnail
    const thumnailUpload = e.target.files[0];

    if (thumnailUpload) {
      setCourseData({
        ...courseData,
        thumbnail: thumnailUpload,
      });

      const fileReader = new FileReader();
      fileReader.readAsDataURL(thumnailUpload);
      fileReader.addEventListener("load", function () {
        setPreviewImage(this.result);
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData({
      ...courseData,
      [name]: value,
    });
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();

    if (
      !courseData.title ||
      !courseData.description ||
      !courseData.category ||
      !courseData.createdBy ||
      !courseData.thumbnail
    ) {
      return toast.error("All feilds are required");
    }

    const formData = new FormData();
    formData.append("title", courseData.title);
    formData.append("description", courseData.description);
    formData.append("category", courseData.category);
    formData.append("createdBy", courseData.createdBy);
    formData.append("thumbnail", courseData.thumbnail);

    // dispatch create course action
    console.log(courseData);
    const res = await dispacth(createCourse(formData));
    console.log(res);
    if (res?.payload?.success) {
      setCourseData({
        title: "",
        description: "",
        category: "",
        createdBy: "",
        thumbnail: "",
      });
      setPreviewImage("");
    }
  };

  return (
    <HomeLayout>
      <div className="flex justify-center items-center min-h-screen ">
        <form
          onSubmit={handleCreateCourse}
          className="px-14 py-5 rounded-lg text-white shadow-[0_0_10px_black] w-3/4 md:w-fit"
        >
          <h1 className="text-3xl font-bold text-center mb-4">Create Course</h1>
          <div className="grid md:grid-cols-2 md:gap-12">
            <div>
              <div className="flex flex-col gap-1 py-1">
                <label htmlFor="title" className="font-semibold text-xl">
                  Title:
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Enter the course title"
                  value={courseData.title}
                  onChange={handleInputChange}
                  className="bg-transparent p-2 border"
                />
              </div>
              <div className="flex flex-col gap-1 py-1">
                <label htmlFor="thumbnail" className="cursor-pointer w-full">
                  {previewImage ? (
                    <div className="w-full h-80 overflow-hidden border mt-2">
                      <img
                        src={previewImage}
                        alt="thumnail image"
                        className="max-w-full max-h-full"
                      />
                    </div>
                  ) : (
                    <div className="font-semibold text-xl">
                      Thumbnail:
                      <FaRegImage className="w-full h-72 overflow-hidden border mt-1" />
                    </div>
                  )}
                </label>
                <input
                  type="file"
                  name="thumbnail"
                  id="thumbnail"
                  className="hidden"
                  accept=".jpg,jpeg,.png,.svg"
                  onChange={handleThumbnailUpload}
                />
              </div>
            </div>
            <div>
              <div className="flex flex-col gap-1 py-1">
                <label htmlFor="category" className="font-semibold text-xl">
                  Category:
                </label>
                <input
                  type="text"
                  name="category"
                  id="category"
                  placeholder="Enter the course category"
                  value={courseData.category}
                  onChange={handleInputChange}
                  className="bg-transparent p-2 border"
                />
              </div>
              <div className="flex flex-col gap-1 py-1">
                <label htmlFor="title" className="font-semibold text-xl">
                  Created By:
                </label>
                <input
                  type="text"
                  name="createdBy"
                  id="createdBy"
                  placeholder="Enter the course instructor"
                  value={courseData.createdBy}
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
                  placeholder="Enter the course description"
                  value={courseData.description}
                  onChange={handleInputChange}
                  className="bg-transparent p-2 border resize-none h-40"
                />
              </div>

              <button
                type="submit"
                className="my-4 w-full bg-yellow-700 rounded-md border p-2 text-xl font-semibold"
              >
                Create Course
              </button>
            </div>
          </div>
        </form>
      </div>
    </HomeLayout>
  );
}
export default CreateCourse;

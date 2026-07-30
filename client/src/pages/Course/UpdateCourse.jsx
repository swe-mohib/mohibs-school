import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaRegImage } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../layout/HomeLayout";
import { updateCourse } from "../../store/slices/courseSlice";

function UpdateCourse() {
  const dispacth = useDispatch();
  const navigate = useNavigate();

  const { state } = useLocation();
  const { _id, title, description, category, createdBy, thumbnail } =
    state || {};

  const [previewImage, setPreviewImage] = useState(thumbnail?.secure_url);
  const [courseData, setCourseData] = useState({
    id: _id,
    title: title,
    description: description,
    category: category,
    createdBy: createdBy,
    newthumbnail: "",
  });

  const handleThumbnailUpload = (e) => {
    e.preventDefault();

    // getting the newthumbnail
    const thumnailUpload = e.target.files[0];

    if (thumnailUpload) {
      setCourseData({
        ...courseData,
        newthumbnail: thumnailUpload,
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

  const handleUpdateCourse = async (e) => {
    e.preventDefault();

    if (
      !courseData.title ||
      !courseData.description ||
      !courseData.category ||
      !courseData.createdBy
    ) {
      return toast.error("Please fill all the field");
    }

    const formData = new FormData();
    formData.append("title", courseData.title);
    formData.append("description", courseData.description);
    formData.append("category", courseData.category);
    formData.append("createdBy", courseData.createdBy);
    if (courseData.newthumbnail instanceof File) {
      formData.append("thumbnail", courseData.newthumbnail);
    }

    // dispatch create course action
    const res = await dispacth(updateCourse([courseData.id, formData]));
    if (res?.payload?.success) navigate("/admin/dashboard");
  };

  useEffect(() => {
    if (!state) {
      navigate("/admin/dashboard");
    }
  }, [navigate, state]);

  return (
    <HomeLayout>
      <div className="page-wrap flex justify-center items-center">
        <form
          onSubmit={handleUpdateCourse}
          className="surface w-full max-w-4xl px-6 py-7 md:px-10"
        >
          <h1 className="section-title text-center mb-6">Update course</h1>
          <div className="grid md:grid-cols-2 md:gap-12">
            <div>
              <div className="flex flex-col gap-1 py-1">
                <label htmlFor="title" className="font-semibold">
                  Title:
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Enter the course title"
                  value={courseData.title}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3"
                />
              </div>
              <div className="flex flex-col gap-1 py-1">
                <label htmlFor="newthumbnail" className="cursor-pointer w-full">
                  {previewImage ? (
                    <div className="w-full h-80 overflow-hidden border mt-2">
                      <img
                        src={previewImage}
                        alt="newthumbnail image"
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
                  name="newthumbnail"
                  id="newthumbnail"
                  className="hidden"
                  accept=".jpg,jpeg,.png,.svg"
                  onChange={handleThumbnailUpload}
                />
              </div>
            </div>
            <div>
              <div className="flex flex-col gap-1 py-1">
                <label htmlFor="category" className="font-semibold">
                  Category:
                </label>
                <input
                  type="text"
                  name="category"
                  id="category"
                  placeholder="Enter the course category"
                  value={courseData.category}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3"
                />
              </div>
              <div className="flex flex-col gap-1 py-1">
                <label htmlFor="title" className="font-semibold">
                  Created By:
                </label>
                <input
                  type="text"
                  name="createdBy"
                  id="createdBy"
                  placeholder="Enter the course instructor"
                  value={courseData.createdBy}
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
                  placeholder="Enter the course description"
                  value={courseData.description}
                  onChange={handleInputChange}
                  className="h-40 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3"
                />
              </div>

              <button type="submit" className="btn-primary my-4 w-full">
                Update Course
              </button>
            </div>
          </div>
        </form>
      </div>
    </HomeLayout>
  );
}
export default UpdateCourse;

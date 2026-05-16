import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../layout/HomeLayout";

function CourseDescription() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { title, description, numberOfLectures, createdBy, thumbnail } = state;

  const { role, data } = useSelector((state) => state.auth);
  return (
    <HomeLayout>
      <div className="min-h-screen flex justify-center items-center text-white pt-5 px-20">
        <div className="grid md:grid-cols-2 grid-cols-1  gap-10 py-10">
          <div className="space-y-5">
            <div className="w-full h-64 overflow-hidden border border-white">
              <img
                src={thumbnail.secure_url}
                alt="thumbnail"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="space-y-4">
              <div className="text-xl text-center">
                <p className="font-semibold">
                  <span className="text-yellow-500 font-bold">
                    Total lectures :{" "}
                  </span>
                  {numberOfLectures}
                </p>
                <p className="font-semibold">
                  <span className="text-yellow-500 font-bold">
                    Instructor :{" "}
                  </span>{" "}
                  {createdBy}
                </p>
              </div>
              {role === "ADMIN" || data?.subscription?.status === "active" ? (
                <button
                  onClick={() =>
                    navigate("/course/displaylectures", { state: { ...state } })
                  }
                  className="bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 font-bold rounded-md p-3 text-xl w-full"
                >
                  Watch Lectures
                </button>
              ) : (
                <button
                  onClick={() => navigate("/payment/checkout")}
                  className="bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 font-bold rounded-md p-3 text-xl w-full"
                >
                  Subscribe
                </button>
              )}
            </div>
          </div>
          <div className="space-y-2 text-xl">
            <h3 className="text-3xl font-bold text-yellow-500 mb-5 text-center">
              {title}
            </h3>
            <p className="text-yellow-500">Course description: </p>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export default CourseDescription;

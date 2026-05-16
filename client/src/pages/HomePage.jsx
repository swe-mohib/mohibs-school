import { useNavigate } from "react-router-dom";

import homepageHeroImg from "../assets/images/homepageHeroImg.png";
import HomeLayout from "../layout/HomeLayout";

function HomePage() {
  const navigate = useNavigate();
  return (
    <HomeLayout>
      <div className="flex flex-col-reverse md:flex-row items-center justify-center text-white gap-10 px-5 md:px-10 py-10">
        {/* Left Section */}
        <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
            Find out best
            <span className="text-yellow-500 font-bold"> Online Courses</span>
          </h1>

          <p className="text-gray-200 text-base md:text-xl">
            We have a large library of courses taught by highly skilled and
            qualified faculties at a very affordable cost.
          </p>

          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <button
              onClick={() => navigate("/courses")}
              className="bg-yellow-500 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-yellow-600 transition-all duration-300"
            >
              Explore Courses
            </button>

            <button
              onClick={() => navigate("/contact")}
              className="border border-yellow-500 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-yellow-600 transition-all duration-300"
            >
              Contact Us
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 items-center justify-center">
          <img
            src={homepageHeroImg}
            alt="homepage"
            className="w-full max-w-md"
          />
        </div>
      </div>
    </HomeLayout>
  );
}

export default HomePage;

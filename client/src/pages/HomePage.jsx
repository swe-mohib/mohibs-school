import {
  FiArrowRight,
  FiBookOpen,
  FiPlayCircle,
  FiUsers,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import homepageHeroImg from "../assets/images/homepageHeroImg.png";
import HomeLayout from "../layout/HomeLayout";

function HomePage() {
  const navigate = useNavigate();
  return (
    <HomeLayout>
      <div className="page-wrap !pt-10 md:!pt-16">
        <section className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <span className="eyebrow">Learn without limits</span>
            <h1 className="display-font mt-5 max-w-2xl text-5xl font-bold leading-[1.04] text-slate-900 md:text-7xl">
              Build skills that <span className="text-blue-600">move you</span>{" "}
              forward.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Short, focused lessons from experts. Learn at your pace, track
              your progress, and turn curiosity into confidence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/courses")}
                className="btn-primary flex items-center gap-2"
              >
                Explore courses <FiArrowRight />
              </button>
              <button
                onClick={() => navigate("/about")}
                className="btn-secondary flex items-center gap-2"
              >
                <FiPlayCircle /> How it works
              </button>
            </div>
            <div className="mt-12 flex flex-wrap gap-7 text-sm">
              <div>
                <p className="font-bold text-slate-900">10k+</p>
                <p className="text-slate-500">Active learners</p>
              </div>
              <div className="border-l border-slate-200 pl-7">
                <p className="font-bold text-slate-900">60+</p>
                <p className="text-slate-500">Expert courses</p>
              </div>
              <div className="border-l border-slate-200 pl-7">
                <p className="font-bold text-slate-900">4.9/5</p>
                <p className="text-slate-500">Learner rating</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-8 -z-0 rounded-[2rem] bg-blue-100"></div>
            <img
              src={homepageHeroImg}
              alt="Student learning online"
              className="relative z-10 mx-auto w-full max-w-lg"
            />
            <div className="surface absolute bottom-7 left-0 z-20 flex items-center gap-3 p-3 text-sm">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-100 text-emerald-600">
                <FiBookOpen />
              </span>
              <div>
                <p className="font-bold">New lessons weekly</p>
                <p className="text-slate-500">Keep your momentum going</p>
              </div>
            </div>
          </div>
        </section>
        <section className="mt-20 grid gap-4 md:grid-cols-3">
          <div className="surface p-6">
            <FiBookOpen className="mb-4 text-2xl text-blue-600" />
            <h2 className="font-bold text-slate-900">Practical content</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Lessons designed for useful, real-world progress.
            </p>
          </div>
          <div className="surface p-6">
            <FiUsers className="mb-4 text-2xl text-blue-600" />
            <h2 className="font-bold text-slate-900">Learn together</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              A focused place for ambitious, lifelong learners.
            </p>
          </div>
          <div className="surface p-6">
            <FiPlayCircle className="mb-4 text-2xl text-blue-600" />
            <h2 className="font-bold text-slate-900">Your pace</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Watch, revisit, and pick up exactly where you stopped.
            </p>
          </div>
        </section>
      </div>
    </HomeLayout>
  );
}
export default HomePage;

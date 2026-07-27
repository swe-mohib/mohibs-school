import { FiBookOpen, FiCheckCircle, FiPlay } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../layout/HomeLayout";
function CourseDescription() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { role, data } = useSelector((s) => s.auth);
  if (!state)
    return (
      <HomeLayout>
        <div className="page-wrap text-center text-slate-500">
          Choose a course from the library to see its details.
        </div>
      </HomeLayout>
    );
  const {
    title,
    description,
    numberOfLectures,
    createdBy,
    thumbnail,
    category,
  } = state;
  const hasAccess = role === "ADMIN" || data?.subscription?.status === "active";
  return (
    <HomeLayout>
      <div className="page-wrap">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 text-sm font-bold text-slate-500 hover:text-blue-600"
        >
          ← Back to courses
        </button>
        <div className="grid gap-10 lg:grid-cols-[1.12fr_.88fr]">
          <div>
            <img
              src={thumbnail?.secure_url}
              alt={title}
              className="h-[270px] w-full rounded-2xl object-cover shadow-lg md:h-[410px]"
            />
            <div className="mt-8">
              <span className="eyebrow">{category || "Course"}</span>
              <h1 className="section-title mt-4">{title}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                {description}
              </p>
            </div>
          </div>
          <aside className="surface h-fit p-6 lg:sticky lg:top-28">
            <p className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Course details
            </p>
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-600">
                  <FiBookOpen />
                </span>
                <div>
                  <p className="text-sm text-slate-500">Course length</p>
                  <p className="font-bold">{numberOfLectures} lessons</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                  <FiCheckCircle />
                </span>
                <div>
                  <p className="text-sm text-slate-500">Created by</p>
                  <p className="font-bold">{createdBy}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() =>
                navigate(
                  hasAccess ? "/course/displaylectures" : "/payment/checkout",
                  hasAccess ? { state: { ...state } } : undefined,
                )
              }
              className="btn-primary mt-8 flex w-full items-center justify-center gap-2"
            >
              {hasAccess ? (
                <>
                  <FiPlay /> Start learning
                </>
              ) : (
                "Get full access"
              )}
            </button>
            <p className="mt-3 text-center text-xs text-slate-500">
              {hasAccess
                ? "Pick up where you left off, anytime."
                : "One subscription unlocks every course."}
            </p>
          </aside>
        </div>
      </div>
    </HomeLayout>
  );
}
export default CourseDescription;

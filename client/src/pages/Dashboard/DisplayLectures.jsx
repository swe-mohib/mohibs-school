import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import PlaylistCard from "../../components/LectureComponents/PlaylistCard";
import HomeLayout from "../../layout/HomeLayout";
import {
  getCourseLectures,
  removeLecture,
} from "../../store/slices/lectureSlice";
function DisplayLectures() {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { lectures } = useSelector((s) => s.lecture);
  const { role } = useSelector((s) => s.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLecture, setCurrentLecture] = useState(0);
  const getLectures = async () => {
    if (!state) return;
    await dispatch(getCourseLectures(state._id));
    setIsLoading(false);
  };
  useEffect(() => {
    if (!state) navigate("/courses");
    else getLectures();
  }, [state, navigate]);
  const remove = async (idx) => {
    const res = await dispatch(
      removeLecture({ courseId: state._id, lectureId: lectures[idx]._id }),
    );
    if (res?.payload?.success) getLectures();
  };
  if (!state) return null;
  return (
    <HomeLayout>
      <div className="page-wrap !pt-7">
        {isLoading ? (
          <p className="text-slate-500">Loading classroom…</p>
        ) : lectures?.length ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <section>
              <p className="eyebrow">{state.title}</p>
              <video
                src={lectures[currentLecture]?.lecture?.secure_url}
                controls
                controlsList="nodownload"
                className="mt-4 aspect-video w-full rounded-2xl bg-slate-900 shadow-lg"
              />
              <div className="mt-6">
                <p className="text-sm font-bold text-blue-600">
                  Lesson {currentLecture + 1} of {lectures.length}
                </p>
                <h1 className="display-font mt-2 text-3xl font-bold">
                  {lectures[currentLecture]?.title}
                </h1>
                <p className="mt-3 max-w-3xl leading-7 text-slate-600">
                  {lectures[currentLecture]?.description}
                </p>
              </div>
            </section>
            <aside className="surface h-fit overflow-hidden lg:sticky lg:top-28">
              <div className="border-b border-slate-100 p-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold">Course lessons</h2>
                  <span className="text-sm text-slate-400">
                    {lectures.length}
                  </span>
                </div>
                {role === "ADMIN" && (
                  <button
                    onClick={() => navigate("/course/addlecture", { state })}
                    className="btn-primary mt-4 flex w-full items-center justify-center gap-2 !py-2 text-sm"
                  >
                    <FiPlus /> Add lesson
                  </button>
                )}
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-3">
                {lectures.map((item, idx) => (
                  <PlaylistCard
                    key={item._id}
                    data={item}
                    count={idx + 1}
                    selectedIndex={currentLecture + 1}
                    role={role}
                    playLecture={() => setCurrentLecture(idx)}
                    removeLectureFunc={() => remove(idx)}
                  />
                ))}
              </div>
            </aside>
          </div>
        ) : (
          <div className="surface mx-auto max-w-lg p-10 text-center">
            <h1 className="text-xl font-bold">No lessons yet</h1>
            <p className="mt-2 text-slate-500">
              This course is being prepared. Check back shortly.
            </p>
            {role === "ADMIN" && (
              <button
                onClick={() => navigate("/course/addlecture", { state })}
                className="btn-primary mt-5"
              >
                Add the first lesson
              </button>
            )}
          </div>
        )}
      </div>
    </HomeLayout>
  );
}
export default DisplayLectures;

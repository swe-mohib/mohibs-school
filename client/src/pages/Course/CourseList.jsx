import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import CourseCard from "../../components/CourseCard";
import HomeLayout from "../../layout/HomeLayout";
import { getAllCourses } from "../../store/slices/courseSlice";
function CourseList() {
  const dispatch = useDispatch();
  const { courseData } = useSelector((state) => state.course);
  useEffect(() => {
    dispatch(getAllCourses());
  }, [dispatch]);
  return (
    <HomeLayout>
      <div className="page-wrap">
        <div className="max-w-2xl">
          <span className="eyebrow">Course library</span>
          <h1 className="section-title mt-4">
            Find your next <span className="text-blue-600">breakthrough.</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Explore clear, expert-led courses and choose the skill you want to
            grow today.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courseData?.map((elem) => (
            <CourseCard key={elem._id} data={elem} />
          ))}
        </div>
        {courseData?.length === 0 && (
          <div className="surface mt-10 p-10 text-center text-slate-500">
            Courses are loading, or none have been published yet.
          </div>
        )}
      </div>
    </HomeLayout>
  );
}
export default CourseList;

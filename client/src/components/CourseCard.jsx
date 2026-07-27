/* eslint-disable react/prop-types */
import { FiArrowUpRight, FiBookOpen } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
function CourseCard({ data }) {
  const navigate = useNavigate();
  const {
    thumbnail,
    title,
    numberOfLectures,
    description,
    category,
    createdBy,
  } = data;
  return (
    <article
      onClick={() => navigate("/course/description", { state: { ...data } })}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={thumbnail?.secure_url}
          alt={title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-blue-600">
          {category}
        </span>
      </div>
      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h2 className="line-clamp-2 text-lg font-bold leading-6 text-slate-900">
            {title}
          </h2>
          <FiArrowUpRight className="shrink-0 text-xl text-blue-600" />
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-slate-600">
          {description}
        </p>
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
          <span className="font-semibold text-slate-500">By {createdBy}</span>
          <span className="flex items-center gap-1 font-bold text-slate-700">
            <FiBookOpen /> {numberOfLectures} lessons
          </span>
        </div>
      </div>
    </article>
  );
}
export default CourseCard;

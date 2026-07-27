/* eslint-disable react/prop-types */
import { FiPlay, FiTrash2 } from "react-icons/fi";
function PlaylistCard({
  data,
  count,
  selectedIndex = 1,
  role,
  playLecture,
  removeLectureFunc,
}) {
  const active = selectedIndex === count;
  return (
    <div
      className={`group mb-2 flex overflow-hidden rounded-xl border transition ${active ? "border-blue-200 bg-blue-50" : "border-transparent hover:bg-slate-50"}`}
    >
      <button
        onClick={playLecture}
        className="flex min-w-0 flex-1 items-center gap-3 p-3 text-left"
      >
        <span
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs ${active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}
        >
          <FiPlay />
        </span>
        <span className="min-w-0">
          <span
            className={`block truncate text-sm font-bold ${active ? "text-blue-700" : "text-slate-700"}`}
          >
            {count}. {data.title}
          </span>
          <span className="mt-1 block truncate text-xs text-slate-500">
            {data.description}
          </span>
        </span>
      </button>
      {role === "ADMIN" && (
        <button
          onClick={removeLectureFunc}
          className="px-3 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
          aria-label="Delete lesson"
        >
          <FiTrash2 />
        </button>
      )}
    </div>
  );
}
export default PlaylistCard;

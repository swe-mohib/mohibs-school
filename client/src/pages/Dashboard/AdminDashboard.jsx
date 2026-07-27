import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as chartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { BsCollectionPlayFill, BsTrash } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { FaPen } from "react-icons/fa6";
import { FcSalesPerformance } from "react-icons/fc";
import { GiMoneyStack } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import HomeLayout from "../../layout/HomeLayout";
import { deleteCourse, getAllCourses } from "../../store/slices/courseSlice";
import { getAllPayments } from "../../store/slices/razorpaySlice";
import { getStatsData } from "../../store/slices/statSlice";

chartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  Title,
  Tooltip,
);

function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allUserCount, subscribedCount } = useSelector((state) => state.stat);
  const { allPayments, monthlySalesRecord } = useSelector(
    (state) => state.razorpay,
  );
  const { courseData } = useSelector((state) => state.course);

  const deleteCourseFunc = async (id) => {
    if (window.confirm("Are you sure you want to delete the course ?")) {
      const res = await dispatch(deleteCourse(id));
      if (res?.payload?.success) {
        await dispatch(getAllCourses());
      }
    }
  };

  const userData = {
    labels: ["Registered User", "Enrolled User"],
    fontColor: "white",
    datasets: [
      {
        label: "User Details",
        data: [allUserCount, subscribedCount],
        backgroundColor: ["yellow", "green"],
        borderWidth: 1,
        borderColor: ["yellow", "green"],
      },
    ],
  };

  const salesData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    fontColor: "white",
    datasets: [
      {
        label: "Sales / Month",
        data: monthlySalesRecord,
        backgroundColor: ["red"],
        borderWidth: 2,
        borderColor: ["white"],
      },
    ],
  };

  useEffect(() => {
    (async () => {
      await dispatch(getAllPayments());
      await dispatch(getStatsData());
      await dispatch(getAllCourses());
    })();
  }, []);
  return (
    <HomeLayout>
      <div className="page-wrap !pt-8 flex flex-col gap-8 text-slate-900">
        {/* Heading */}
        <h1 className="section-title text-center">Admin Dashboard</h1>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Users Chart */}
          <div className="surface flex flex-col items-center gap-6 p-4 sm:p-6">
            <div className="w-full max-w-[280px] sm:max-w-[380px]">
              <Pie data={userData} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="stat-card flex items-center justify-between">
                <div className="font-bold">
                  <p className="text-sm sm:text-base">Registered Users</p>
                  <h3 className="text-2xl sm:text-3xl">{allUserCount}</h3>
                </div>

                <FaUsers className="text-4xl sm:text-5xl text-blue-500" />
              </div>

              <div className="stat-card flex items-center justify-between">
                <div className="font-bold">
                  <p className="text-sm sm:text-base">Subscribed Users</p>
                  <h3 className="text-2xl sm:text-3xl">{subscribedCount}</h3>
                </div>

                <FaUsers className="text-4xl sm:text-5xl text-green-500" />
              </div>
            </div>
          </div>

          {/* Sales Chart */}
          <div className="surface flex flex-col items-center gap-6 p-4 sm:p-6">
            <div className="w-full h-[300px] sm:h-[400px]">
              <Bar
                data={salesData}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="stat-card flex items-center justify-between">
                <div className="font-bold">
                  <p className="text-sm sm:text-base">Subscription Count</p>
                  <h3 className="text-2xl sm:text-3xl">
                    {allPayments?.count || 0}
                  </h3>
                </div>

                <FcSalesPerformance className="text-4xl sm:text-5xl" />
              </div>

              <div className="stat-card flex items-center justify-between">
                <div className="font-bold">
                  <p className="text-sm sm:text-base">Total Revenue</p>
                  <h3 className="text-2xl sm:text-3xl">
                    ₹{allPayments?.count * 499 || 0}
                  </h3>
                </div>

                <GiMoneyStack className="text-4xl sm:text-5xl text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="w-full overflow-x-auto">
          <div className="surface flex min-w-max flex-col gap-5 p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl sm:text-3xl font-semibold">
                Course Overview
              </h1>

              <button
                onClick={() => {
                  navigate("/course/create");
                }}
                className="btn-primary text-sm sm:text-lg"
              >
                Create new course
              </button>
            </div>

            {/* Table */}
            <table className="table-auto border-collapse w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="p-3">S. No.</th>
                  <th className="p-3">Course Title</th>
                  <th className="hidden lg:table-cell p-3">Course Category</th>
                  <th className="hidden lg:table-cell p-3">Instructor</th>
                  <th className="hidden lg:table-cell p-3">Total Lectures</th>
                  <th className="hidden lg:table-cell p-3">Description</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {courseData?.map((course, idx) => {
                  return (
                    <tr
                      key={course._id}
                      className={`border-b border-slate-100 ${
                        (idx + 1) % 2 === 0 ? "bg-slate-50" : ""
                      }`}
                    >
                      <td className="p-3">{idx + 1}</td>

                      <td className="p-3">
                        <textarea
                          readOnly
                          value={course.title}
                          className="w-40 resize-none bg-transparent font-semibold outline-none sm:w-56"
                        />
                      </td>

                      <td className="hidden lg:table-cell p-3">
                        {course.category}
                      </td>

                      <td className="hidden lg:table-cell p-3">
                        {course.createdBy}
                      </td>

                      <td className="hidden lg:table-cell p-3">
                        {course.numberOfLectures}
                      </td>

                      <td className="hidden lg:table-cell p-3">
                        <textarea
                          readOnly
                          value={course.description}
                          className="w-72 resize-none bg-transparent text-slate-500 outline-none"
                        />
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <button
                            className="bg-yellow-500 hover:bg-yellow-600 transition-all duration-300 text-lg py-2 px-3 rounded-md"
                            onClick={() =>
                              navigate("/course/displaylectures", {
                                state: { ...course },
                              })
                            }
                          >
                            <BsCollectionPlayFill />
                          </button>

                          <button
                            className="bg-green-500 hover:bg-green-600 transition-all duration-300 text-lg py-2 px-3 rounded-md"
                            onClick={() =>
                              navigate("/course/update", {
                                state: { ...course },
                              })
                            }
                          >
                            <FaPen />
                          </button>

                          <button
                            className="bg-red-500 hover:bg-red-600 transition-all duration-300 text-lg py-2 px-3 rounded-md"
                            onClick={() => deleteCourseFunc(course?._id)}
                          >
                            <BsTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export default AdminDashboard;

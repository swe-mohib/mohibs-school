import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PageNotFound() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(9);

  useEffect(() => {
    if (countdown === 0) {
      navigate("/");
      return; // exit early if countdown reaches zero
    }

    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    // Clear the interval when component unmounts or countdown changes
    return () => clearInterval(intervalId);
  }, [countdown, navigate]);
  return (
    <div className="app-shell h-screen w-full flex flex-col justify-center items-center text-slate-700">
      <div className="flex justify-center items-center ">
        <h1 className="font-extrabold text-9xl text-slate-900 tracking-widest">
          404
        </h1>
        <p className="bg-blue-600 text-white px-3 py-1 rounded mt-5 text-sm absolute rotate-12">
          Page Not Found...
        </p>
      </div>
      <button className="btn-primary mt-5" onClick={() => navigate(-1)}>
        Go Back
      </button>
      <p>
        Redirecting to &apos;
        <span
          onClick={() => navigate("/")}
          className={"link text-accent cursor-pointer"}
        >
          Homepage
        </span>
        &apos; in <span className="text-yellow-500">{countdown}</span>{" "}
        seconds...
      </p>
    </div>
  );
}

export default PageNotFound;

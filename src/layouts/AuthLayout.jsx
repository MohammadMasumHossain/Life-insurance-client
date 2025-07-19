import React from "react";
import authImg from "../assets/loginimg.jpg";
import { Outlet } from "react-router"; // ✅ FIXED to `react-router-dom`

const AuthLayout = () => {
  return (
    <div className="px-4 py-8 bg-base-200 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-6xl flex flex-col-reverse lg:flex-row items-center gap-10">
        
        {/* Left: Form */}
        <div className="w-full lg:w-1/2">
          <Outlet />
        </div>

        {/* Right: Image */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src={authImg}
            alt="Authentication"
            className="w-full max-w-sm rounded-lg shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

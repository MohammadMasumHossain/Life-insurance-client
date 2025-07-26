import React from 'react';
import { NavLink, Outlet } from 'react-router'; // ✅ make sure this is from 'react-router-dom'

const DashboardLayout = () => {
  return (
    <div className="drawer drawer-mobile lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      
      {/* Main content */}
      <div className="drawer-content flex flex-col">
        {/* Top navbar for mobile */}
        <div className="navbar bg-base-200 lg:hidden px-4">
          <div className="flex-none">
            <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
          </div>
          <div className="flex-1 text-xl font-semibold ml-2">Dashboard</div>
        </div>

        {/* Outlet */}
        <div className="p-4 w-full">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="menu p-4 w-72 min-h-full bg-gray-800 text-white space-y-2">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => isActive ? "bg-fuchsia-500 text-black font-bold rounded" : ""}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/mypolicy"
              className={({ isActive }) => isActive ? "bg-fuchsia-500 text-black font-bold rounded" : ""}
            >
              My Policy
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/manageApplication"
              className={({ isActive }) => isActive ? "bg-fuchsia-500 text-black font-bold rounded" : ""}
            >
              ManageApplicaton
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/manageuser"
              className={({ isActive }) => isActive ? "bg-fuchsia-500 text-black font-bold rounded" : ""}
            >
              ManageUsers
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/managepolicies"
              className={({ isActive }) => isActive ? "bg-fuchsia-500 text-black font-bold rounded" : ""}
            >
              ManagePolicies
            </NavLink>
          </li>
          {/* Add more links here */}
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;

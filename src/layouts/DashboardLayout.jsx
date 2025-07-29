import React from "react";
import { NavLink, Outlet } from "react-router";
import {
  FiHome,
  FiShield,
  FiClipboard,
  FiUsers,
  FiFileText,
  FiUserCheck,
  FiBookOpen,
  FiCreditCard,
  FiAlertCircle,
  FiCheckCircle,
  FiDollarSign,
} from "react-icons/fi";
import useUserRole from "../hooks/useUserRole";
import Navbar2 from "../pages/shared/Navbar/Navbar2";



const linkClasses = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2 rounded transition text-lg font-medium ${
    isActive
      ? "bg-fuchsia-500 text-black font-bold"
      : "hover:bg-fuchsia-500/20 text-white"
  }`;

  

const DashboardLayout = () => {

  const { role , roleLoading } = useUserRole();
  console.log(role);

  return (
    <div>
     
       <Navbar2 ></Navbar2>
     
     
      <div className="drawer drawer-mobile lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      {/* Main content */}
      <div className="drawer-content flex flex-col">
        {/* Top navbar for mobile */}
        <div className="navbar bg-base-200 lg:hidden px-4">
          <div className="flex-none">
            <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7" // Increased icon size
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
          </div>
          <div className="flex-1 text-2xl font-bold ml-2">Dashboard</div>
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
            <NavLink to="/dashboard" className={linkClasses}>
              <FiHome size={22} /> Home
            </NavLink>
          </li>

        { 
        !roleLoading && role === 'admin' &&
          <>
            <li>
            <NavLink to="/dashboard/manageApplication" className={linkClasses}>
              <FiClipboard size={22} /> Manage Application
            </NavLink>
          </li>

          <li>
            <NavLink to="/dashboard/manageuser" className={linkClasses}>
              <FiUsers size={22} /> Manage Users
            </NavLink>
          </li>

          <li>
            <NavLink to="/dashboard/managepolicies" className={linkClasses}>
              <FiFileText size={22} /> Manage Policies
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/manageblogs" className={linkClasses}>
              <FiBookOpen size={22} /> Manage Blogs
            </NavLink>
          </li>

          <li>
            <NavLink to="/dashboard/manage-transactions" className={linkClasses}>
              <FiDollarSign size={22} /> Manage Transactions
            </NavLink>
          </li>
          </>
        }

          { !roleLoading && role === 'agent' &&
            <>
            <li>
            <NavLink to="/dashboard/assignedcustomers" className={linkClasses}>
              <FiUserCheck size={22} /> Assigned Customers
            </NavLink>
          </li>

          <li>
            <NavLink to="/dashboard/manageblogs" className={linkClasses}>
              <FiBookOpen size={22} /> Manage Blogs
            </NavLink>
          </li>

           <li>
            <NavLink to="/dashboard/policy-clearance" className={linkClasses}>
              <FiCheckCircle size={22} /> Policy Clearance
            </NavLink>
          </li>
            </>
          }

          {
            !roleLoading && role === 'customer' &&
            <>
            <li>
            <NavLink to="/dashboard/mypolicy" className={linkClasses}>
              <FiShield size={22} /> My Policy
            </NavLink>
          </li>

          <li>
            <NavLink to="/dashboard/payment-status" className={linkClasses}>
              <FiCreditCard size={22} /> Payment Status
            </NavLink>
          </li>

          <li>
            <NavLink to="/dashboard/claimrequestpage" className={linkClasses}>
              <FiAlertCircle size={22} /> Claim Request Page
            </NavLink>
          </li>
            </>
          }

        </ul>
      </div>
    </div>
    </div>
  );
};

export default DashboardLayout;

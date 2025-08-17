import React from 'react';
import { Link, NavLink } from 'react-router'; // ✅ FIXED
import logo from '../../../assets/logo.png';
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2'; // ✅ Import SweetAlert

const Navbar = () => {
  const { logOut, user } = useAuth();

  const handleSignOut = () => {
    logOut()
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Logged out successfully',
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Logout failed',
          text: error.message,
        });
      });
  };

  const navItems = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `font-semibold ${isActive ? "text-primary border-b-2 border-primary" : "text-gray-600"}`
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/AllPolicies"
          className={({ isActive }) =>
            `font-semibold ${isActive ? "text-primary border-b-2 border-primary" : "text-gray-600"}`
          }
        >
          All Policies
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/blog"
          className={({ isActive }) =>
            `font-semibold ${isActive ? "text-primary border-b-2 border-primary" : "text-gray-600"}`
          }
        >
          Blog
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/aboutus"
          className={({ isActive }) =>
            `font-semibold ${isActive ? "text-primary border-b-2 border-primary" : "text-gray-600"}`
          }
        >
          About Us
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `font-semibold ${isActive ? "text-primary border-b-2 border-primary" : "text-gray-600"}`
          }
        >
          Dashboard
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="fixed top-0 left-0 w-full bg-base-100 shadow-sm z-50">
      <div className="navbar px-4 py-2 max-w-7xl mx-auto">
        
        {/* Left Side */}
        <div className="navbar-start">
          <div className="dropdown lg:hidden">
            <label tabIndex={0} className="btn btn-ghost">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-10 p-2 shadow bg-base-100 rounded-box w-52"
            >
              {navItems}
            </ul>
          </div>

          <Link to="/" className="flex items-center gap-2 btn btn-ghost text-xl normal-case">
            <img src={logo} alt="LifeSecure Logo" className="w-10 h-10" />
            <span>LifeSecure</span>
          </Link>
        </div>

        {/* Center */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{navItems}</ul>
        </div>

        {/* Right Side */}
        <div className="navbar-end space-x-2">
          {user ? (
            <>
              <Link to="/profile" className="btn btn-sm btn-outline">
                Profile
              </Link>
              <button onClick={handleSignOut} className="btn btn-sm btn-primary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-sm btn-outline">Login</Link>
              <Link to="/register" className="btn btn-sm btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

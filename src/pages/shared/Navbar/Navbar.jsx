import React from 'react';
import { Link, NavLink } from 'react-router';
import logo from '../../../assets/logo.png';

const Navbar = () => {
  const navItems = (
    <>
      <li><NavLink to="/" className="font-semibold">Home</NavLink></li>
      <li><NavLink to="/policies" className="font-semibold">All Policies</NavLink></li>
      <li><NavLink to="/blog" className="font-semibold">Blog</NavLink></li>
      <li><NavLink to="/dashboard" className="font-semibold">Dashboard</NavLink></li>
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-sm px-4 py-2">
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

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {navItems}
        </ul>
      </div>

      <div className="navbar-end space-x-2">
        <Link to="/login" className="btn btn-sm btn-outline">Login</Link>
        <Link to="/register" className="btn btn-sm btn-primary">Register</Link>
      </div>
    </div>
  );
};

export default Navbar;

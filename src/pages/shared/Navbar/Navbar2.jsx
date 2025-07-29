import React from 'react';
import { Link, NavLink } from 'react-router'; // ✅ Use react-router-dom
import logo from '../../../assets/logo.png';
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';
import useUserRole from '../../../hooks/useUserRole';

const Navbar2 = () => {
  const { logOut, user } = useAuth();
  const { role } = useUserRole();

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

  const getBadgeColor = () => {
    if (role === 'admin') return 'badge-error';
    if (role === 'agent') return 'badge-primary';
    return 'badge-success';
  };

  const navItems = (
    <>
      
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-sm px-4 py-2">
      <div className="navbar-start flex items-center gap-3">
        {/* {user && role && (
          <span className={`badge ${getBadgeColor()} font-semibold capitalize`}>
            {role}
          </span>
        )} */}

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

        {user && role && (
          <span className={`badge ${getBadgeColor()} font-semibold capitalize`}>
            {role}
          </span>
        )}
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navItems}</ul>
      </div>

      <div className="navbar-end space-x-2">
        {user ? (
          <>
            <Link to="/dashboard/profile" className="btn btn-sm btn-outline">
              Profile
            </Link>
            <button onClick={handleSignOut} className="btn btn-sm btn-primary">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-sm btn-outline">Login</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar2;

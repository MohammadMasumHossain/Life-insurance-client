import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import Swal from 'sweetalert2';            // <-- import SweetAlert2
import SocialLogin from '../SocialLogin/SocialLogin';
import useAuth from '../../../hooks/useAuth';

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || '/';

  const onSubmit = (data) => {
    console.log('Login data:', data);
    signIn(data.email, data.password)
      .then((result) => {
        console.log(result.user);
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: `Welcome back, ${result.user.displayName || result.user.email}!`,
          timer: 2000,
          showConfirmButton: false,
        });
        navigate(from, { replace: true });
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error.message || 'Please check your credentials and try again.',
        });
      });
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className="card bg-base-100 w-full max-w-sm shadow-2xl py-6 px-6">
        <h2 className="font-semibold text-2xl text-center mb-4">Login Your Account</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              {...register('email', { required: true })}
              className="input input-bordered w-full"
              placeholder="Email"
            />
            {errors.email?.type === 'required' && (
              <p className="text-red-500 text-sm mt-1">Email is required</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              {...register('password', {
                required: true,
                minLength: 6,
                pattern: /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
              })}
              className="input input-bordered w-full"
              placeholder="Password"
            />
            {errors.password?.type === 'required' && (
              <p className="text-red-500 text-sm mt-1">Password is required</p>
            )}
            {errors.password?.type === 'minLength' && (
              <p className="text-red-500 text-sm mt-1">
                Password must be at least 6 characters
              </p>
            )}
            {errors.password?.type === 'pattern' && (
              <p className="text-red-500 text-sm mt-1">
                Must include at least one uppercase and one lowercase letter
              </p>
            )}
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <a className="link link-hover text-sm">Forgot password?</a>
          </div>

          {/* Login Button */}
          <button type="submit" className="btn btn-neutral w-full">
            Login
          </button>

          {/* Register Link */}
          <p className="text-center text-sm pt-4 font-semibold">
            Don’t have an account?{' '}
            <Link state={{ from }} to="/register" className="text-red-500">
              Register
            </Link>
          </p>
        </form>
        <SocialLogin mode="login" />
      </div>
    </div>
  );
};

export default Login;
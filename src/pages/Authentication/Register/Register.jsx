import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router'; // ✅ FIXED
import useAuth from '../../../hooks/useAuth';
import SocialLogin from '../SocialLogin/SocialLogin';

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
   const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from || '/';

  const {createUser}=useAuth();

  const onSubmit = (data) => {
    console.log(data);
    console.log(createUser);
    createUser  (data.email ,data.password)
     .then(result =>{
        console.log(result.user)
        navigate(from);
     })
     .catch(error =>{
        console.log(error);
     })
    
   

    // handle register logic (e.g., upload photo, create user)
  };

  return (
    <div className="flex items-center justify-center w-full px-4">
      <div className="card bg-base-100 w-full max-w-sm shadow-2xl py-5 px-6">
        <h2 className="font-semibold text-2xl text-center mb-4">Create an Account</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              {...register('name', { required: true })}
              className="input input-bordered w-full"
              placeholder="Your Name"
            />
            {errors.name?.type === 'required' && (
              <p className="text-red-500 text-sm mt-1">Name is required</p>
            )}
          </div>

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

          {/* Photo Upload */}
          <div>
            <label className="label">Upload Photo</label>
            <input
              type="file"
              {...register('photo')}
              accept="image/*"
              className="file-input file-input-bordered w-full"
            />
          </div>

          {/* Register Button */}
          <button type="submit" className="btn btn-neutral w-full mt-2">Register</button>

          {/* Login Link */}
          <p className="text-center font-semibold pt-4 text-sm">
            Already have an account?{' '}
            <Link className="text-red-500" to="/login">Login</Link>
          </p>
        </form>
        <SocialLogin></SocialLogin>
      </div>
    </div>
  );
};

export default Register;

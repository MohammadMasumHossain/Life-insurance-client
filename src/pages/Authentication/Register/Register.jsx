import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import SocialLogin from '../SocialLogin/SocialLogin';

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const { createUser, updateUserProfile } = useAuth();

  const createUserInDB = useMutation({
    mutationFn: (userData) => axios.post('http://localhost:3000/users', userData),
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: 'Your account has been created successfully.',
        timer: 2000,
        showConfirmButton: false,
      });
      navigate(from, { replace: true });
    },
    onError: (err) => {
      if (err.response?.status === 409) {
        Swal.fire({
          icon: 'info',
          title: 'Already Registered',
          text: 'An account with this email already exists. Please log in.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: 'Unable to save your information. Please try again later.',
        });
      }
    },
  });

  const onSubmit = async (data) => {
    const { name, email, password } = data;

    try {
      const result = await createUser(email, password);
      const loggedUser = result.user;

      // Upload image to ImgBB if photo selected
      let imageUrl = '';
      const photoFile = data.photo?.[0];
      if (photoFile) {
        const formData = new FormData();
        formData.append('image', photoFile);

        const res = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
          formData
        );

        imageUrl = res.data?.data?.url || '';
      }

      // Update Firebase profile with displayName and photoURL
      await updateUserProfile({
        displayName: name,
        photoURL: imageUrl,
      });

      // Prepare user info for MongoDB
      const userInfo = {
        name,
        email,
        role: 'customer',
        photo: imageUrl,
      };

      // Save user info to backend
      createUserInDB.mutate(userInfo);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Registration Error',
        text: error.message || 'Something went wrong during registration.',
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="card bg-base-100 w-full max-w-sm shadow-2xl py-5 px-6">
        <h2 className="font-semibold text-2xl text-center mb-4">Create an Account</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              {...register('name', { required: true })}
              className="input input-bordered w-full"
              placeholder="Your Name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">Name is required</p>}
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
            {errors.email && <p className="text-red-500 text-sm mt-1">Email is required</p>}
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
              <p className="text-red-500 text-sm mt-1">Minimum 6 characters</p>
            )}
            {errors.password?.type === 'pattern' && (
              <p className="text-red-500 text-sm mt-1">
                Must include at least one uppercase and lowercase letter
              </p>
            )}
          </div>

          {/* Photo Upload */}
          <div>
            <label className="label">Upload Profile Photo</label>
            <input
              type="file"
              {...register('photo')}
              accept="image/*"
              className="file-input file-input-bordered w-full"
            />
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-neutral w-full mt-2">
            Register
          </button>

          {/* Link to Login */}
          <p className="text-center font-semibold pt-4 text-sm">
            Already have an account?{' '}
            <Link className="text-blue-500" to="/login">
              Login
            </Link>
          </p>
        </form>

        <SocialLogin mode="register" />
      </div>
    </div>
  );
};

export default Register;

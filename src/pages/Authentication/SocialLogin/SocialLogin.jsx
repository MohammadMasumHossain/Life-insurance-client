import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';

import useAuth from '../../../hooks/useAuth.jsx';
import axiosSecure from '../../../hooks/axiosSecure.js';

const SocialLogin = ({ mode = 'login' }) => {
  const { signInWithGoogle } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || '/';

  // Mutation to save user info to the backend
  const mutation = useMutation({
    mutationFn: async (userInfo) => {
      const res = await axiosSecure.post('/users', userInfo);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire('Success', 'Signed in successfully!', 'success');
      navigate(from, { replace: true });
    },
    onError: (error) => {
      if (error.response?.status === 409) {
        if (mode === 'register') {
          Swal.fire('Already Registered!', 'You already have an account. Please login.', 'info');
        } else {
          Swal.fire('Success', 'Signed in successfully!', 'success');
        }
        navigate(from, { replace: true });
      } else {
        Swal.fire('Error', 'Something went wrong during Google login.', 'error');
      }
    },
  });

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;

      const userInfo = {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        role: 'customer',
      };

      mutation.mutate(userInfo);
    } catch (error) {
      console.error('Google sign-in error:', error);
      Swal.fire('Error', 'Google sign-in failed.', 'error');
    }
  };

  return (
    <div>
      <div className="divider mt-6">OR</div>
      <button
        onClick={handleGoogleSignIn}
        className="btn w-full bg-white text-black border border-gray-300 hover:bg-gray-100"
      >
        <svg width="20" height="20" viewBox="0 0 512 512" className="mr-2">
          <g>
            <path d="M0 0h512v512H0z" fill="#fff" />
            <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341" />
            <path fill="#4285f4" d="M386 400a140 175 0 0053-179H260v74h102q-7 37-38 57" />
            <path fill="#fbbc02" d="M90 341a208 200 0 010-171l63 49q-12 37 0 73" />
            <path fill="#ea4335" d="M153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55" />
          </g>
        </svg>
        {mode === 'register' ? 'Register with Google' : 'Login with Google'}
      </button>
    </div>
  );
};

export default SocialLogin;

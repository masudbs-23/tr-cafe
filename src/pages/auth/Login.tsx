import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/reducers/auth/authSlice';
import type { AppDispatch, RootState } from '../../redux/reducers/store';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import showToast from '../../utils/toast';
import { useForm, type SubmitHandler } from "react-hook-form";

type FormValues = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { status, errorMessage, isAuthenticated } = useSelector((state: RootState) => state.user);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    dispatch(loginUser({ email: data.email, password: data.password }));
  };

  useEffect(() => {
    if (isAuthenticated === 'success') {
      const redirectTo = location.state?.from || '/';
      navigate(redirectTo, { replace: true });
      showToast('success', 'Logged in successfully');
    }
  }, [isAuthenticated, navigate, location.state]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-sm w-full space-y-8 rounded-md shadow-sm p-6">
        <div>
          <h2 className="mt-6 text-start text-xl font-medium text-gray-900">
            Sign in to your account
          </h2>
        </div>
        {errorMessage && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                {...register("rememberMe")}
                className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <button
                type="button"
                className="font-medium text-gray-600 hover:text-gray-500 bg-transparent border-none cursor-pointer"
                onClick={() => console.log('Forgot password clicked')}
              >
                Forgot your password?
              </button>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
          <div className="text-center">
            <span className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/auth/register">
                <button
                  type="button"
                  className="font-medium text-gray-600 hover:text-gray-500 bg-transparent border-none cursor-pointer"
                  onClick={() => console.log('Sign up clicked')}
                >
                  Sign up
                </button>
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
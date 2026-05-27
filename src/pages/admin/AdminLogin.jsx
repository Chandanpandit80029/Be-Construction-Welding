import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSignInAlt, FaHardHat } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, currentUser, isAdmin, authReady } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  // If already authenticated as admin, redirect immediately
  useEffect(() => {
    if (authReady && currentUser && isAdmin()) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [authReady, currentUser, isAdmin, navigate]);

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);

    const result = await login(data.email, data.password);
    
    if (result.success) {
      // Use React Router navigation instead of hard redirect
      // The auth state is already cached in sessionStorage, so the redirect
      // will work immediately without a full page reload
      navigate('/admin/dashboard', { replace: true });
    } else {
      setError(result.error || 'Failed to login');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <FaHardHat className="text-white text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Admin Portal</h1>
          <p className="text-[#64748b] mt-2">BE Construction & Welding Works</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl shadow-black/5 p-8 border border-[#e2e8f0]">
          <h2 className="text-xl font-bold text-[#0f172a] mb-6 text-center">
            Sign In to Dashboard
          </h2>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="text-[#94a3b8]" />
                </div>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                  })}
                  className="w-full pl-11 pr-4 py-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all"
                  placeholder="admin@beconstruction.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-[#94a3b8]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required' })}
                  className="w-full pl-11 pr-12 py-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#94a3b8] hover:text-[#475569]"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-[#cbd5e1]" defaultChecked />
                <span className="ml-2 text-sm text-[#475569]">Remember me</span>
              </label>
              <Link to="/admin/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 shadow-sm hover:shadow-md"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <>
                  <FaSignInAlt />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
            <p className="text-sm text-[#64748b] mb-2">Demo Credentials:</p>
            <p className="text-sm font-mono text-[#0f172a]">
              Email: admin@beconstruction.com<br />
              Password: admin123
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-[#94a3b8] mt-6">
          © 2024 BE Construction & Welding Works. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Layout = ({ children }) => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800'>
        <div className='animate-pulse flex flex-col items-center'>
          <div className='h-12 w-12 bg-blue-400 dark:bg-blue-600 rounded-full mb-4'></div>
          <div className='h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300'>
      <header className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700'>
        <div className='max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex justify-between items-center'>
          <div className='flex items-center space-x-2'>
            <svg className='w-6 h-6 text-blue-600 dark:text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2'
              />
            </svg>
            <h1 className='font-bold text-gray-800 dark:text-white text-lg md:text-xl tracking-tight'>MediCare Scheduler</h1>
          </div>

          <div className='flex items-center space-x-4'>
            <span className='text-sm font-medium text-gray-600 dark:text-gray-300 hidden sm:inline-block'>{user?.email}</span>
            <button
              onClick={handleLogout}
              className='px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-1'
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>{children}</main>
    </div>
  );
};

export default Layout;

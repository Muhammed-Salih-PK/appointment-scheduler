import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
const clinicImage = "/images/clinic-image.png";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (login(email, password)) {
        navigate("/calendar");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      setError("Invalid credentials. Try email: staff@clinic.com, password: 123456");
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const imageVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 60,
        delay: 0.2,
      },
    },
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 overflow-hidden'>
      <motion.div
        className='w-full max-w-4xl flex rounded-2xl shadow-xl overflow-hidden'
        initial='hidden'
        animate='visible'
        variants={containerVariants}
      >
        {/* Image Section */}
        <motion.div className='hidden md:flex md:w-1/2 bg-blue-600 relative overflow-hidden' variants={imageVariants}>
          <img src={clinicImage} alt='Clinic Staff' className='w-full h-full object-cover opacity-90' />
          <div className='absolute inset-0 bg-gradient-to-t from-blue-800/70 to-blue-600/50'></div>
          <motion.div
            className='absolute bottom-8 left-8 right-8 text-white'
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className='text-xl font-bold mb-2'>Welcome Back</h2>
            <h2 className='text-2xl font-bold mb-2'>MediCare Scheduler</h2>
            <p className='text-blue-100'>Secure access to your clinic management system</p>
          </motion.div>
        </motion.div>

        {/* Form Section */}
        <motion.div className='w-full md:w-1/2 bg-white dark:bg-gray-800 p-8 sm:p-10' variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <div className='text-center mb-8'>
              <motion.div
                className='mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4'
                whileHover={{ scale: 1.05 }}
              >
                <svg className='w-8 h-8 text-blue-600 dark:text-blue-300' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' clipRule='evenodd' />
                </svg>
              </motion.div>
              <h1 className='text-2xl font-bold text-gray-800 dark:text-white'>Clinic Portal</h1>
              <p className='text-gray-500 dark:text-gray-400 mt-1'>Staff Login</p>
            </div>
          </motion.div>

          {error && (
            <motion.div
              className='mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-3 rounded-lg flex items-start'
              variants={itemVariants}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            >
              <svg className='w-5 h-5 mr-2 mt-0.5 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                  clipRule='evenodd'
                />
              </svg>
              <span>{error}</span>
            </motion.div>
          )}

          <form className='space-y-6' onSubmit={handleSubmit}>
            <motion.div variants={itemVariants}>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Email Address
              </label>
              <motion.div className='relative' whileHover={{ scale: 1.01 }} whileFocus={{ scale: 1.01 }}>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <svg className='h-5 w-5 text-gray-400 dark:text-gray-500' fill='currentColor' viewBox='0 0 20 20'>
                    <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                    <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
                  </svg>
                </div>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm'
                  placeholder='staff@clinic.com'
                />
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Password
              </label>
              <motion.div className='relative' whileHover={{ scale: 1.01 }} whileFocus={{ scale: 1.01 }}>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <svg className='h-5 w-5 text-gray-400 dark:text-gray-500' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <input
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='current-password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm'
                  placeholder='••••••••'
                />
              </motion.div>
            </motion.div>

            <motion.div className='flex items-center justify-between' variants={itemVariants}>
              <div className='flex items-center'>
                <input
                  id='remember-me'
                  name='remember-me'
                  type='checkbox'
                  className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700'
                />
                <label htmlFor='remember-me' className='ml-2 block text-sm text-gray-700 dark:text-gray-300'>
                  Remember me
                </label>
              </div>

              <div className='text-sm'>
                <a href='#' className='font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500'>
                  Forgot password?
                </a>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                type='submit'
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
              >
                {isLoading ? (
                  <>
                    <svg className='animate-spin -ml-1 mr-2 h-4 w-4 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </motion.button>
            </motion.div>
          </form>

          <motion.div className='mt-8 pt-5 border-t border-gray-200 dark:border-gray-600 text-center' variants={itemVariants}>
            <p className='text-xs text-gray-500 dark:text-gray-400'>© {new Date().getFullYear()} Clinic Management System. All rights reserved.</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;

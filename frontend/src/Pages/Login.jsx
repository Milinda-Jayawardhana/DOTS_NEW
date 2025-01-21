import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    setError('');
    console.log("Email:", email);
    console.log("Password:", password);
    // Add further login logic here
  };

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/register');
  };

  return (
    <div className="flex items-center justify-center py-20">
      <div className="p-8 bg-gray-800 rounded-lg shadow-lg h-[370px] w-96">
        <h2 className="mb-6 text-3xl font-bold text-center text-white">Login</h2>
        {error && <p className="mb-4 text-center text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-[16px] font-semibold text-white">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder='Enter your email'
              className="block w-full px-4 py-2 mt-1 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 placeholder:text-[14px]"
            />
          </div>

          <div className="relative mb-4">
            <label htmlFor="password" className="block text-[16px] font-semibold text-white">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder='Enter your password'
              className="block w-full px-4 py-2 mt-1 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 placeholder:text-[14px]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute text-gray-500 right-3 top-10 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="flex justify-center pt-3">
            <button
              type="submit"
              className="w-[90%] py-2 text-white bg-black rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800"
            >
              Login
            </button>
          </div>
          <div className='flex justify-center pt-2'>
            <button className='text-blue-800/80 text-[12px]' onClick={handleNavigate}>Create an account.</button>
          </div>
        </form>
      </div>
    </div>
  );
}

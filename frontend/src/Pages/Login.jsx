import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token); // Store token
        navigate("/"); // Redirect after login
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      setError("Server error. Please try again.");
    }
  };

  const handleNavigate = () => {
    navigate('/register'); // Navigate to register page
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full px-4 py-2 mt-1 text-black border border-gray-300 rounded-md"
            />
          </div>

          <div className="relative mb-4">
            <label htmlFor="password" className="block text-[16px] font-semibold text-white">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full px-4 py-2 mt-1 text-black border border-gray-300 rounded-md"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute text-gray-500 right-3 top-10"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="flex justify-center pt-3">
            <button type="submit" className="w-[90%] py-2 text-white bg-black rounded-md">
              Login
            </button>
          </div>

          {/* Create Account Button */}
          <div className='flex justify-center pt-2'>
            <button className='text-blue-800/80 text-[12px]' onClick={handleNavigate}>
              Create an account.
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

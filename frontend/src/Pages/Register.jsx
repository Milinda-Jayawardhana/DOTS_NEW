import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";  // Vite typically uses react-router-dom for routing

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Using react-router for navigation

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.message === "Email already exists") {
          setError("This email is already registered. Please use a different email.");
        } else {
          setError(result.message || "Registration failed");
        }
        return;
      }

      navigate("/"); // Navigate to the login page upon success
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center py-10 pb-10">
      <div className="p-8 bg-gray-800 rounded-lg shadow-lg w-[400px] sm:w-[430px]">
        <h2 className="mb-6 text-3xl font-bold text-center text-white">Register</h2>
        {error && <p className="mb-4 text-center text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-[16px] font-semibold text-white">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
              className="block w-full px-4 py-2 mt-1 text-black border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-[16px] font-semibold text-white">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="block w-full px-4 py-2 mt-1 text-black border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>

          <div className="relative mb-4">
            <label htmlFor="password" className="block text-[16px] font-semibold text-white">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="block w-full px-4 py-2 mt-1 text-black border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute text-gray-500 right-3 top-10 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="flex justify-center pt-3">
            <button
              type="submit"
              className="w-[90%] py-2 text-[15px] font-semibold text-white bg-black rounded-md hover:bg-gray-900"
            >
              Register
            </button>
          </div>
          <div className="flex justify-center pt-2">
            <button className="text-white/80 text-[12px] cursor-pointer" onClick={() => navigate("/login")}>
              Already have an account?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
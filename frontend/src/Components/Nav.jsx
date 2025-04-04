{/*import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Nav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const getActiveClass = (path) => {
    return currentPath === path 
      ? 'text-gray-500 border-gray-500 font-semibold' 
      : 'text-current border-transparent hover:text-gray-500 font-semibold';
  };

  return (
    <nav className="">
      <div className='items-center justify-end hidden font-normal lg:flex md:flex sm:flex lg:flex-1'>
        <div className=' flex-10'>
          <ul className='flex lg:gap-20 md:gap-16 font-noto font-bold text-[18px]'>
            <Link to="/">
              <li className={`transition border-b-2 cursor-pointer ${getActiveClass('/')}`}>
                Home
              </li>
            </Link>
            <Link to="/shop">
              <li className={`transition border-b-2 cursor-pointer ${getActiveClass('/shop')}`}>
                Shop
              </li>
            </Link>
            <Link to="/blogs">
              <li className={`transition border-b-2 cursor-pointer ${getActiveClass('/blogs')}`}>
                Blogs
              </li>
            </Link>
            <Link to="/contact">
              <li className={`transition border-b-2 cursor-pointer ${getActiveClass('/contact')}`}>
                Contact
              </li>
            </Link>
            
          </ul>
        </div>
      </div>
    </nav>
  );
}
*/}

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Nav() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [role, setRole] = useState(null);

  useEffect(() => {
    const updateRole = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setRole(decoded.role);
        } catch (error) {
          console.error("Invalid token:", error);
          setRole(null);
        }
      } else {
        setRole(null); // Clear role on logout
      }
    };

    updateRole(); // Initial check
    window.addEventListener("authChange", updateRole); // Listen for login/logout updates

    return () => window.removeEventListener("authChange", updateRole); // Cleanup
  }, []);

  const getActiveClass = (path) => {
    return currentPath === path
      ? "text-gray-500 border-gray-500 font-semibold"
      : "text-current border-transparent hover:text-gray-500 font-semibold";
  };

  return (
    <nav>
      <div className="items-center justify-end hidden font-normal lg:flex md:flex sm:flex lg:flex-1">
        <div className="flex-10">
          <ul className="flex lg:gap-20 md:gap-16 font-noto font-bold text-[18px]">
            <Link to="/">
              <li className={`transition border-b-2 cursor-pointer ${getActiveClass("/")}`}>
                Home
              </li>
            </Link>
            <Link to="/shop">
              <li className={`transition border-b-2 cursor-pointer ${getActiveClass("/shop")}`}>
                Shop
              </li>
            </Link>
            <Link to="/blogs">
              <li className={`transition border-b-2 cursor-pointer ${getActiveClass("/blogs")}`}>
                Blogs
              </li>
            </Link>
            <Link to="/contact">
              <li className={`transition border-b-2 cursor-pointer ${getActiveClass("/contact")}`}>
                Contact
              </li>
            </Link>
            {role === "admin" && (
              <Link to="/admin">
                <li className={`transition border-b-2 cursor-pointer ${getActiveClass("/admin")}`}>
                  Admin
                </li>
              </Link>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

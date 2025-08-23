import React, { useState } from "react";
import { CiMenuFries } from "react-icons/ci";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function MobileNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const getActiveClass = (path) => {
    return currentPath === path ? "text-gray-500" : "hover:text-gray-500";
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Menu Trigger */}
      <button className="flex items-center justify-center" onClick={toggleMenu}>
        <CiMenuFries className="text-[20px] text-white" />
      </button>

      {/* Menu Content */}
      <div
        className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-all duration-300 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        {/* Sidebar */}
        <div
          className={`fixed top-0 right-0 h-full w-[80vw] bg-black p-8 transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Close Button */}
          <button
            className="absolute text-2xl text-white top-6 right-4"
            onClick={toggleMenu}
          >
            &times;
          </button>

          {/* Logo */}
          <div className="flex items-center justify-center py-4 pt-10">
            <Link to="/" onClick={toggleMenu}>
              <img src="/logo.png" alt="Logo" className="h-8" />
            </Link>
          </div>

          {/* Navigation Links */}
          <ul className="pt-10 space-y-2 text-xl text-center text-white">
            <Link to="/" onClick={toggleMenu}>
              <li
                className={`transition py-6 cursor-pointer ${getActiveClass(
                  "/"
                )}`}
              >
                Home
              </li>
            </Link>
            <Link to="/shop" onClick={toggleMenu}>
              <li
                className={`transition py-6 cursor-pointer ${getActiveClass(
                  "/shop"
                )}`}
              >
                Shop
              </li>
            </Link>
            <Link to="/contact" onClick={toggleMenu}>
              <li
                className={`transition py-6 cursor-pointer ${getActiveClass(
                  "/contact"
                )}`}
              >
                Contacts
              </li>
            </Link>
          </ul>
        </div>

        {/* Clickable Area to Close */}
        <div className="flex-1 h-full" onClick={toggleMenu}></div>
      </div>
    </>
  );
}

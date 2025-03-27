import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Nav from "./Nav";
import { TiUserAdd } from "react-icons/ti";
import { FaCircleUser } from "react-icons/fa6";
import MobileNav from "./MobileNav";
import { useState, useEffect } from "react";

export default function Header() {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const updateAuthState = () => {
      setToken(localStorage.getItem("token"));
    };

    updateAuthState(); // Initial check
    window.addEventListener("authChange", updateAuthState); // Listen for login/logout updates

    return () => window.removeEventListener("authChange", updateAuthState); // Cleanup
  }, []);
  const handleLogOut = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("authChange")); // ✅ Notify Nav and Header to update
    navigate("/"); // Changed from router.push to navigate
  };
  return (
    <div>
      <div className="relative z-50 px-10 py-8 lg:px-12 xl:px-14 xl:py-10">
        <div className="container flex items-center justify-between mx-auto">
          <Link to="/">
            <img src="/logo.png" alt="Logo" className="h-8 md:h-10" />
          </Link>
          <div className="z-10 items-center hidden gap-8 md:flex">
            <Nav />
          </div>
          <div className="flex items-center gap-4">
            {token ? (
              <button onClick={handleLogOut}>Log Out</button>
            ) : (
              <>
                <Link to="/register" className="text-xl hover:text-slate-600">
                  <TiUserAdd />
                </Link>
                <Link to="/login" className="text-xl hover:text-slate-600">
                  <FaCircleUser />
                </Link>
              </>
            )}
            <div className="md:hidden">
              <MobileNav />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

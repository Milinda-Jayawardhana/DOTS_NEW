import React from "react";
import { Link } from "react-router-dom";
import Nav from "./Nav";
import { TiUserAdd } from "react-icons/ti";
import { FaCircleUser } from "react-icons/fa6";
import MobileNav from "./MobileNav";

export default function Header() {
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
            <Link to="/register" className="text-xl hover:text-gray-500">
              <TiUserAdd />
            </Link>
            <Link to="/login" className="text-xl hover:text-gray-500">
              <FaCircleUser />
            </Link>
            <div className="md:hidden">
              <MobileNav />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

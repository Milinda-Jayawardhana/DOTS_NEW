import React from "react";
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <div className="py-10 text-white bg-blue-950/20">
      <div className="flex justify-center mb-6">
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((dot) => (
            <span
              key={dot}
              className="w-2 h-2 bg-gray-400 rounded-full cursor-pointer hover:bg-gray-200"
            ></span>
          ))}
        </div>
      </div>


      <div className=" h-[20px] flex justify-center items-center gap-2"> 
         <div className="h-full w-[30%] flex items-center">
         <div className=" h-[1px] bg-gray-600 w-full "></div>
         </div>
        <div className=" flex gap-[5px] ">
          <FaFacebook></FaFacebook>
          <FaInstagram></FaInstagram>
          <FaTwitter></FaTwitter>
        </div>
        <div className=" h-[1px] bg-gray-600 w-[30%]"></div>
        
      </div>


      {/* Bottom Section: Links and Logo */}
      <div className=" flex justify-center items-center mt-8 px-8 text-sm lg:gap-[100px] md:gap-[70px] sm:gap-[40px]">
        <div className=" hidden sm:flex gap-3 lg:gap-7 md:gap-5 sm:gap-3 xl:gap-10 w-[40%] justify-end">
          <a href="#" className="hover:text-gray-400"> About Us   </a>
          <a href="#" className="hover:text-gray-400"> Contact   </a>
          <a href="#" className="hover:text-gray-400"> Shop   </a>
          <a href="#" className="hover:text-gray-400"> Helps   </a>

        </div>
        <div className="flex flex-col items-center ">
          <h2 className="text-2xl font-bold">DOTS</h2>
          <div className="flex gap-5 sm:hidden">
            <a href="#" className="hover:text-gray-400"> About Us   </a>
            <a href="#" className="hover:text-gray-400"> Contact   </a>
            <a href="#" className="hover:text-gray-400"> Shop   </a>
            <a href="#" className="hover:text-gray-400"> Helps   </a>
            
          </div>
          <div className="flex gap-3 sm:hidden">
            <a href="#" className="hover:text-gray-400">Products</a>
            <a href="#" className="hover:text-gray-400">Designs</a>
            <a href="#" className="hover:text-gray-400">Suport</a>
          </div>
        </div>
        <div className=" hidden sm:flex lg:gap-7 md:gap-5 sm:gap-3 gap-3 w-[40%] justify-start">
          <a href="#" className="hover:text-gray-400">Products</a>
          <a href="#" className="hover:text-gray-400">Designs</a>
          <a href="#" className="hover:text-gray-400">Suport</a>
        </div>
      </div>
        <div className="flex justify-center pt-5">
        <p className=" text-[12px] md:text-sm font-light text-white/50">Copyright &copy; 2024 DOTS. All Rights Reserved. </p>
        </div>
    </div>
  )
}

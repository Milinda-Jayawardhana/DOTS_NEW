import React from "react";
import { FlipWordsDemo } from "../Ui/FlipWords/FlipWordsDemo";
import { FiShoppingCart } from "react-icons/fi";
import Stats from "../Components/Stats";
import { AnimatedCard } from "../Ui/AnimatedCards/AnimatedCard";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";

export default function Home() {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/shop');
  };

  return (
    <div>
      <div className=" w-[100%] px-6 xl:px-10 lg:px-8 md:px-5 items-center">
        <div className=" w-[100%]  flex flex-col md:flex-row items-center md:justify-between justify-evenly mx-auto  bg-[url('/12.png')] bg-cover  bg-center rounded-[40px] md:h-[400px] lg:h-[430px] xl:h-[470px]">
          <div className="flex-col block w-full md:hidden">
            <div className="flex justify-center ">
              <h2 className="absolute flex justify-center gap-[12px] sm:gap-[30px] font-bold font-lilita-one text-gray-950 text-[120px] sm:text-[150px] z-0 ">
                <p>D</p>
                <p>O</p>
                <p>T</p>
                <p>S</p>
              </h2>
            </div>
            <div className="flex items-end justify-center w-full">
              <div className="flex flex-col gap-2 w-[40%] sm:w-[35%] pl-10 pb-4">
                <div className="flex justify-center w-full rounded-xl">
                  <div className="flex justify-center w-full">
                    <img
                      src="/t3.png"
                      alt=""
                      className="h-[120px] sm:h-[140px]"
                    />
                  </div>
                </div>
                <div className="flex justify-center w-full">
                  <button className="relative flex items-center justify-center rounded-lg w-full sm:w-[65%]  h-9 text-[18px] sm:text-xl  bg-white text-black font-bold overflow-hidden group" onClick={handleClick}>
                    <span className="absolute transition-transform duration-300 transform group-hover:translate-x-[160%]">
                      Shop Now
                    </span>
                    <FiShoppingCart
                      className="absolute transition-transform duration-500 transform -translate-x-full opacity-0 group-hover:left-1/2 group-hover:-translate-x-1/2 group-hover:opacity-100"
                      size={20}
                    />
                  </button>
                </div>
              </div>
              <div className="flex ">
                <img
                  src="/2.png"
                  alt=""
                  className=" h-[340px]  sm:h-[400px] z-10 "
                />
              </div>
            </div>
          </div>

          <div className="hidden h-full md:flex">
            <div className="flex flex-col justify-end md:gap-3 lg:gap-3 xl:gap-3 md:w-[28vw] lg:w-[25vw] xl:w-[20vw]  h-full ">
              <div className="flex justify-center w-full  xl:pb-5 rounded-xl pt-[150px]">
                <div className="flex justify-center w-full">
                  <img
                    src="/t3.png"
                    alt=""
                    className=" h-[140px] lg:h-[190px] xl:h-[220px] md:h-[170px] "
                  />
                </div>
              </div>
              <div className="flex justify-center w-full lg:pb-5 xl:pb-10 md:pb-4">
                <button className="relative flex items-center justify-center rounded-lg w-[65%] xl:w-[70%] h-11 px-2 py-3 text-xl xl:text-2xl bg-white text-black font-bold overflow-hidden group" onClick={handleClick}>
                  <span className="absolute transition-transform duration-300 transform group-hover:translate-x-[160%]">
                    Shop Now
                  </span>
                  <FiShoppingCart
                    className="absolute transition-transform duration-500 transform -translate-x-full opacity-0 group-hover:left-1/2 group-hover:-translate-x-1/2 group-hover:opacity-100"
                    size={24}
                  />
                </button>
              </div>
            </div>

            <div className="md:w-[40vw] lg:w-[45vw]  xl:w-[50vw]  h-full flex flex-col items-center ">
              <h2 className="relative flex md:gap-[20px]  lg:gap-[35px]  xl:gap-[50px]  font-bold font-lilita-one text-gray-950  md:text-[170px] lg:text-[200px] xl:text-[230px] z-0 ">
                <p>D</p>
                <p>O</p>
                <p>T</p>
                <p>S</p>
              </h2>
              <img
                src="/2.png"
                alt=""
                className=" absolute h-[400px] md:h-[430px] lg:h-[460px] xl:h-[500px] md:top-[75px] lg:top-[75px] xl:top-[90px] z-10 items-center"
              />
            </div>
            <div className="md:w-[27vw] lg:w-[25vw] xl:w-[20vw] h-full hidden md:flex flex-col items-start justify-end">
              <div className="flex gap-2 pb-10">
                <FlipWordsDemo></FlipWordsDemo>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="">
        <Stats></Stats>
      </div>
      <div className="">
        <div className="flex flex-col items-center gap-10 pt-16">
          <div className=" w-[90%] h-2 bg-gray-600 rounded-lg"></div>
          <h2 className="text-3xl font-bold text-white/80 font-noto">What We Do?</h2>
        </div>

        <AnimatedCard></AnimatedCard>
        <Footer></Footer>
      </div>
    </div>
  );
}

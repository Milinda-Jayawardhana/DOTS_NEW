import React from 'react'
import CountUp from "react-countup";

export default function Stats() {

  const stats = [
    {
      num: 700,
      mark: "+",
      text: "Days of Experience",
    },
    {
      num: 13,
      mark: "+",
      text: "Material",
    },
    {
      num: 16,
      mark: "+",
      text: "Colours",
    },
    {
      num: 50,
      mark: "+",
      text: "Projects",
    },
  ];

  return (
    <section className="pt-10 mx- lg:mx-20 md:pb-none">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 gap-6 md:flex md:justify-evenly flex-wrap max-w-[80vw] mx-auto md:max-w-none">
          {stats.map((item, index) => {
            return (
              <div 
                className="flex items-center justify-center"
                key={index}
              >
                <div className="flex items-center justify-center gap-3 lg:gap-4">
                  <div className="flex items-center justify-center gap-1">
                    <CountUp
                      end={item.num}
                      duration={5}
                      delay={1}
                      className="text-2xl font-semibold sm:text-3xl lg:text-5xl md:text-4xl"
                    />
                    <p className="text-xl">{item.mark}</p>
                  </div>
                  <p className={`${
                    item.text.length < 15 ? "max-w-[100px]" : "max-w-[100px]"
                  } leading-snug text-white/80 text-[14px] sm:text-[18px] font-semibold`}>
                    {item.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

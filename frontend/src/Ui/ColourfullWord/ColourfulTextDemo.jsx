"use client";
import React from "react";
import { ColourfulText } from "./ColourfulText";

export function ColourfulTextDemo() {
  return (
    (<div
      className="relative flex items-center justify-center w-full overflow-hidden ">
      <h1
        className="relative font-sans text-3xl sm:text-4xl font-bold text-center text-white md:text-5xl lg:text-7xl z-2 pb-4">
        The best <ColourfulText text="components" /> <br /> you will ever find
      </h1>
    </div>)
  );
}

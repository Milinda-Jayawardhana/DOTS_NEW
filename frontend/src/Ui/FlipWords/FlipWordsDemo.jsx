import React from "react";
import { FlipWords } from "./FlipWords";


export function FlipWordsDemo() {
  const words = ["quality", "price", "material", "designs"];

  return (
    (<div className="">
      <div
        className="lg:text-[23px] xl:text-[26px] md:text-[18px] font-semibold text-neutral-600 dark:text-neutral-400">
        Best
        <FlipWords words={words} /> <br />
        Campus Tshirts
      </div>
    </div>)
  );
}

"use client";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export const Animated = ({ testimonials, autoplay = false }) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  return (
    <div className="z-[50] max-w-sm px-4 py-20 mx-auto font-sans antialiased md:max-w-4xl md:px-8 lg:px-12">
      <div className="relative grid grid-cols-1 gap-20 md:gap-[90px] lg:gap-[220px] md:grid-cols-2">
        <div className="flex justify-center">
          <div className="relative w-[230px] h-[260px] md:w-[250px] md:h-[280px] lg:w-[290px] lg:h-[320px]">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={`${testimonial.src}-${index}`} // Ensure unique keys
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                    y: 50,
                    rotateX: -10,
                    rotateY: 10,
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.8,
                    scale: isActive(index) ? 1 : 0.95,
                    y: isActive(index) ? 0 : 30,
                    rotateX: isActive(index) ? 0 : -5,
                    rotateY: isActive(index) ? 0 : 5,
                    zIndex: isActive(index) ? 1 : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    y: -50,
                    rotateX: 10,
                    rotateY: -10,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.42, 0, 0.58, 1], // Smooth cubic-bezier
                  }}
                  className="absolute inset-0 origin-center"
                >
                  <img
                    src={testimonial.src}
                    alt={testimonial.name}
                    width={500}
                    height={500}
                    draggable={false}
                    className="object-cover object-center w-full h-full shadow-lg rounded-3xl"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex flex-col justify-between py-4">
          <motion.div
            key={active}
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
          >
            <h3 className="text-[20px] md:text-2xl font-bold text-white">
              {testimonials[active].name}
            </h3>
            <p className="text-[14px] md:text-sm text-gray-500">
              {testimonials[active].designation}
            </p>
            <motion.p className="mt-8 text-[15px] md:text-lg text-white/80">
              {testimonials[active].quote.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{
                    filter: "blur(10px)",
                    opacity: 0,
                    y: 5,
                  }}
                  animate={{
                    filter: "blur(0px)",
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.02 * index,
                  }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
          </motion.div>
          <div className="flex gap-4 pt-12 md:pt-0">
            <button
              onClick={handlePrev}
              className="flex items-center justify-center rounded-full h-7 w-7 bg-neutral-800 group/button hover:bg-yellow-600"
            >
              <IconArrowLeft className="w-5 h-5 text-black transition-transform duration-300 dark:text-neutral-400 group-hover/button:text-white" />
            </button>
            <button
              onClick={handleNext}
              className="flex items-center justify-center rounded-full h-7 w-7 bg-neutral-800 group/button hover:bg-yellow-600"
            >
              <IconArrowRight className="w-5 h-5 text-black transition-transform duration-300 dark:text-neutral-400 group-hover/button:text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from "react";

const products = [
  { img: "/t1.jpeg", name: "Classic Polo" },
  { img: "/t2.jpeg", name: "Sport Tee" },
  { img: "/t1.jpeg", name: "Casual Fit" },
  { img: "/t2.jpeg", name: "Premium Cotton" },
  { img: "/t1.jpeg", name: "Summer Edition" },
  { img: "/t2.jpeg", name: "Urban Style" },
];

export default function ProductShowCase() {
  return (
    <div className="w-full py-10 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-white mb-6">Pre-Created Projects</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        {products.map((p, idx) => (
          <div
            key={idx}
            className="bg-gray-800 rounded-xl shadow-lg flex flex-col items-center p-4 hover:scale-105 transition-transform duration-300"
          >
            <img
              src={p.img}
              alt={p.name}
              className="w-32 h-32 object-contain mb-3 rounded-lg bg-white"
            />
            <span className="text-white font-semibold">{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
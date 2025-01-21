import React from "react";

export default function Tcount({ onClose }) {
  return (
    <div className="inset-0 z-50 flex items-center justify-center bg-black">
      <div className="w-[150px] h-[180px] bg-white rounded-lg shadow-lg p-4 relative">
        {/* Close Button */}
        <button
          className="absolute top-[-10px] right-[-10px] bg-red-500 text-white px-3 py-1 rounded-full"
          onClick={onClose}
        >
          X
        </button>
        {/* Add your content inside the Tcount popup */}
        <p className="text-center text-black">Tcount Component</p>
      </div>
    </div>
  );
}

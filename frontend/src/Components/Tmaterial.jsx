import React, { useState } from "react";

export default function Tmaterial({ onClose }) {
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  const materials = [
    "Cotton",
    "Crocodile",
    "Baby-Crocodile",
    "Polyester",
    "Silk",
    "Denim",
    "Wool",
  ];

  // Handle checkbox change
  const handleMaterialChange = (material) => {
    setSelectedMaterials(
      (prev) =>
        prev.includes(material)
          ? prev.filter((m) => m !== material) // Remove if already selected
          : [...prev, material] // Add if not selected
    );
  };

  return (
    <div className="inset-0 z-50 flex items-center justify-center ">
      <div className="w-[280px] py-5 bg-white rounded-lg shadow-lg p-4 relative">
        {/* Close Button */}
        <button
          className="absolute top-[-10px] right-[-10px] bg-red-500 text-white px-3 py-1 rounded-full"
          onClick={onClose}
        >
          X
        </button>
        {/* Add your content inside the Tcount popup */}
        <p className="text-center text-black font-semibold text-[20px] pb-7">
          Select Material
        </p>
        <div className="flex flex-col items-start gap-2 pl-5">
          {materials.map((material, index) => (
            <label
              key={index}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedMaterials.includes(material)}
                onChange={() => handleMaterialChange(material)}
                className="hidden" // Hide default checkbox
              />
              <div
                className={`w-5 h-5 flex items-center justify-center border-2 rounded-md transition-all ${
                  selectedMaterials.includes(material)
                    ? "bg-gray-500 border-gray-500" // Change color when checked
                    : "border-gray-400"
                }`}
              >
                {selectedMaterials.includes(material) && (
                  <svg
                    className="w-4 h-4 text-white" // Checkmark icon
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 00-1.414 0L7 13.586 4.707 11.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l9-9a1 1 0 000-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className="text-black">{material}</span>
            </label>
          ))}
        </div>

        {/* Close & Confirm Buttons */}
        <div className="flex justify-center mt-9">
          <button
            className="px-3 py-2 text-white bg-gray-700 rounded"
            onClick={() => {
              console.log("Selected Materials:", selectedMaterials);
              onClose();
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

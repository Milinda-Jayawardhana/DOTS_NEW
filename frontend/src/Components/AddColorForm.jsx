import React, { useState } from "react";

export default function AddColorForm() {
  const [colorName, setColorName] = useState("");
  const [colorPrice, setColorPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!colorName || !colorPrice) {
      alert("Please enter both color name and price.");
      return;
    }

    const newColor = { name: colorName, price: parseFloat(colorPrice) };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/colors`, { // ✅ Backend API URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newColor),
      });

      if (!response.ok) {
        throw new Error("Failed to add color");
      }

      const data = await response.json();
      console.log("Color added:", data);

      // Clear input fields after successful submission
      setColorName("");
      setColorPrice("");

    } catch (error) {
      console.error("Error:", error);
    }
  };

    return (
    <div className="p-8 bg-gray-800 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Add New Color</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          type="text"
          placeholder="Enter color name"
          value={colorName}
          onChange={(e) => setColorName(e.target.value)}
          className="p-3 bg-white text-black border border-gray-300 rounded-md"
          required
        />
        <input
          type="number"
          placeholder="Enter color price"
          value={colorPrice}
          onChange={(e) => setColorPrice(e.target.value)}
          className="p-3 bg-white text-black border border-gray-300 rounded-md"
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-black text-white rounded-md hover:bg-black/80 font-semibold"
        >
          Add Color
        </button>
      </form>
    </div>
  );
}
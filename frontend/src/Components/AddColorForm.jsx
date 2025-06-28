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
      const response = await fetch("http://localhost:3000/api/colors", { // ✅ Backend API URL
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
    <div className="p-5 bg-white rounded-lg shadow-lg w-80">
      <h2 className="text-lg font-semibold text-gray-800">Add New Color</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-4">
        <input
          type="text"
          placeholder="Enter color name"
          value={colorName}
          onChange={(e) => setColorName(e.target.value)}
          className="p-2 text-black border rounded"
          required
        />
        <input
          type="number"
          placeholder="Enter color price"
          value={colorPrice}
          onChange={(e) => setColorPrice(e.target.value)}
          className="p-2 text-black border rounded"
          required
        />
        <button
          type="submit"
          className="py-2 text-white transition bg-black hover:bg-black/80"
        >
          Add Color
        </button>
      </form>
    </div>
  );
}
import React, { useState } from "react";

export default function AddMaterialForm() {
  const [materialName, setMaterialName] = useState("");
  const [materialPrice, setMaterialPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!materialName || !materialPrice) {
      alert("Please enter both material name and price.");
      return;
    }

    const newMaterial = {
      name: materialName,
      price: parseFloat(materialPrice),
    };

    try {
      const response = await fetch("http://localhost:3000/api/material", {
        // ✅ Backend API URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMaterial),
      });

      if (!response.ok) {
        throw new Error("Failed to add material");
      }

      const data = await response.json();
      console.log("Material added:", data);

      // Clear input fields after successful submission
      setMaterialName("");
      setMaterialPrice("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-8 bg-gray-800 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Add New Material
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          type="text"
          placeholder="Enter material name"
          value={materialName}
          onChange={(e) => setMaterialName(e.target.value)}
          className="p-3 bg-white text-black border border-gray-300 rounded-md"
          required
        />
        <input
          type="number"
          placeholder="Enter material price"
          value={materialPrice}
          onChange={(e) => setMaterialPrice(e.target.value)}
          className="p-3 bg-white text-black border border-gray-300 rounded-md"
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-black text-white rounded-md hover:bg-black/80 font-semibold"
        >
          Add Material
        </button>
      </form>
    </div>
  );
}

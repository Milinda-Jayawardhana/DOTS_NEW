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

    const newMaterial = { name: materialName, price: parseFloat(materialPrice) };

    try {
      const response = await fetch("http://localhost:3000/api/material", { // ✅ Backend API URL
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
    <div className="p-5 bg-white rounded-lg shadow-lg w-80">
      <h2 className="text-lg font-semibold text-gray-800">Add New Material</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-4">
        <input
          type="text"
          placeholder="Enter material name"
          value={materialName}
          onChange={(e) => setMaterialName(e.target.value)}
          className="p-2 text-black border rounded"
          required
        />
        <input
          type="number"
          placeholder="Enter material price"
          value={materialPrice}
          onChange={(e) => setMaterialPrice(e.target.value)}
          className="p-2 text-black border rounded"
          required
        />
        <button
          type="submit"
          className="py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700"
        >
          Add Material
        </button>
      </form>
    </div>
  );
}
import React, { useState } from "react";

export default function AddTtypeForm() {
  const [typeName, setTypeName] = useState("");
  const [typePrice, setTypePrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!typeName || !typePrice) {
      alert("Please enter both T-shirt type name and price.");
      return;
    }

    const newType = { name: typeName, price: parseFloat(typePrice) };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/types`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newType),
      });

      if (!response.ok) {
        throw new Error("Failed to add T-shirt type");
      }

      const data = await response.json();
      console.log("T-shirt type added:", data);

      // Clear fields
      setTypeName("");
      setTypePrice("");
    } catch (error) {
      console.error("Error adding T-shirt type:", error);
    }
  };

  return (
    <div className="p-8 bg-gray-800 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Add New T-Shirt Type
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          type="text"
          placeholder="Enter T-shirt type name"
          value={typeName}
          onChange={(e) => setTypeName(e.target.value)}
          className="p-3 bg-white text-black border border-gray-300 rounded-md"
          required
        />
        <input
          type="number"
          placeholder="Enter T-shirt type price"
          value={typePrice}
          onChange={(e) => setTypePrice(e.target.value)}
          className="p-3 bg-white text-black border border-gray-300 rounded-md"
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-black text-white rounded-md hover:bg-black/80 font-semibold"
        >
          Add Type
        </button>
      </form>
    </div>
  );
}

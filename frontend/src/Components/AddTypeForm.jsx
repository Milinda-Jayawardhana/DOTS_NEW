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
      const response = await fetch("http://localhost:3000/api/types", {
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
    <div className="p-5 bg-white rounded-lg shadow-lg w-80">
      <h2 className="text-lg font-semibold text-gray-800">Add New T-Shirt Type</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-4">
        <input
          type="text"
          placeholder="Enter T-shirt type name"
          value={typeName}
          onChange={(e) => setTypeName(e.target.value)}
          className="p-2 text-black border rounded"
          required
        />
        <input
          type="number"
          placeholder="Enter T-shirt type price"
          value={typePrice}
          onChange={(e) => setTypePrice(e.target.value)}
          className="p-2 text-black border rounded"
          required
        />
        <button
          type="submit"
          className="py-2 text-white transition bg-black hover:bg-black/80"
        >
          Add Type
        </button>
      </form>
    </div>
  );
}
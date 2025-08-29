import React, { useState } from "react";

export default function AddCollarForm() {
  const [collarName, setCollarName] = useState("");
  const [collarPrice, setCollarPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!collarName || !collarPrice) {
      alert("Please enter both collar name and price.");
      return;
    }

    const newCollar = { name: collarName, price: parseFloat(collarPrice) };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/collar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCollar),
      });

      if (!response.ok) {
        throw new Error("Failed to add collar type");
      }

      const data = await response.json();
      console.log("Collar type added:", data);

      // Clear fields
      setCollarName("");
      setCollarPrice("");
    } catch (error) {
      console.error("Error adding collar type:", error);
    }
  };

  return (
    <div className="p-8 bg-gray-800 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Add New Collar Type
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          type="text"
          placeholder="Enter collar name"
          value={collarName}
          onChange={(e) => setCollarName(e.target.value)}
          className="p-3 bg-white text-black border border-gray-300 rounded-md"
          required
        />
        <input
          type="number"
          placeholder="Enter collar price"
          value={collarPrice}
          onChange={(e) => setCollarPrice(e.target.value)}
          className="p-3 bg-white text-black border border-gray-300 rounded-md"
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-black text-white rounded-md hover:bg-black/80 font-semibold"
        >
          Add Collar
        </button>
      </form>
    </div>
  );
}

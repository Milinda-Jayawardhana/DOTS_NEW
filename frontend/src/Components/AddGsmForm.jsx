import React, { useState } from "react";

export default function AddGsmForm() {
  const [gsmName, setGsmName] = useState("");
  const [gsmPrice, setGsmPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!gsmName || !gsmPrice) {
      alert("Please enter both GSM name and price.");
      return;
    }

    const newGSM = { name: gsmName, price: parseFloat(gsmPrice) };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/gsm`, // ✅ Backend API URL for GSM
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newGSM),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add GSM");
      }

      const data = await response.json();
      console.log("GSM added:", data);

      // Clear input fields after successful submission
      setGsmName("");
      setGsmPrice("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-8 bg-gray-800 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Add New GSM
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          type="text"
          placeholder="Enter GSM name (e.g., 180 GSM)"
          value={gsmName}
          onChange={(e) => setGsmName(e.target.value)}
          className="p-3 bg-white text-black border border-gray-300 rounded-md"
          required
        />
        <input
          type="number"
          placeholder="Enter GSM price"
          value={gsmPrice}
          onChange={(e) => setGsmPrice(e.target.value)}
          className="p-3 bg-white text-black border border-gray-300 rounded-md"
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-black text-white rounded-md hover:bg-black/80 font-semibold"
        >
          Add GSM
        </button>
      </form>
    </div>
  );
}

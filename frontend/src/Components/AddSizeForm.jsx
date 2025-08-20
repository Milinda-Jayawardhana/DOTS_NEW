import React, { useState } from "react";

export default function AddSizeForm() {
  const [sizeName, setSizeName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sizeName) {
      alert("Please enter a size name.");
      return;
    }

    const newSize = { name: sizeName };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/sizes`, {
        // ✅ Backend API URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSize),
      });

      if (!response.ok) {
        throw new Error("Failed to add size");
      }

      const data = await response.json();
      console.log("Size added:", data);

      // Clear input field after successful submission
      setSizeName("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-8 bg-gray-800 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Add New Size
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          type="text"
          placeholder="Enter size name"
          value={sizeName}
          onChange={(e) => setSizeName(e.target.value)}
          className="p-3 bg-white text-black border border-gray-300 rounded-md"
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-black text-white rounded-md hover:bg-black/80 font-semibold"
        >
          Add Size
        </button>
      </form>
    </div>
  );
}

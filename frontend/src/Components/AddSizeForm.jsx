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
      const response = await fetch("http://localhost:3000/api/sizes", { // ✅ Backend API URL
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
    <div className="p-5 bg-white rounded-lg shadow-lg w-80">
      <h2 className="text-lg font-semibold text-gray-800">Add New Size</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-4">
        <input
          type="text"
          placeholder="Enter size name"
          value={sizeName}
          onChange={(e) => setSizeName(e.target.value)}
          className="p-2 text-black border rounded"
          required
        />
        <button
          type="submit"
          className="py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700"
        >
          Add Size
        </button>
      </form>
    </div>
  );
}
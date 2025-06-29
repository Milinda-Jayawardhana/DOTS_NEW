import React, { useState } from "react";
import axios from "axios";

export default function AddCountForm() {
  const [countName, setCountName] = useState("");
  const [countValue, setCountValue] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token is missing.");
      return;
    }

    if (!countName || !countValue) {
      setError("Please enter both name and value.");
      return;
    }

    const newCount = {
      name: countName,
      price: parseFloat(countValue), // optionally rename "price" to "value" in backend for clarity
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/counts",
        newCount,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Count added successfully!");
      setCountName("");
      setCountValue("");
    } catch (err) {
      console.error("Error adding count:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to add count.");
    }
  };

  return (
    <div className="p-8 bg-gray-800 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Add New Count
      </h2>


      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          type="text"
          placeholder="Enter count name"
          value={countName}
          onChange={(e) => setCountName(e.target.value)}
          className="p-3 bg-white text-black border border-gray-300 rounded-md"
          required
        />
        <input
          type="number"
          placeholder="Enter count value"
          value={countValue}
          onChange={(e) => setCountValue(e.target.value)}
          className="p-3 bg-white text-black border border-gray-300 rounded-md"
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-black text-white rounded-md hover:bg-black/80 font-semibold"
        >
          Add Count
        </button>
      </form>
    </div>
  );
}

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
    <div className="p-5 bg-white rounded-lg shadow-lg w-80">
      <h2 className="text-lg font-semibold text-gray-800">Add New Count</h2>

      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-4">
        <input
          type="text"
          placeholder="Enter count name"
          value={countName}
          onChange={(e) => setCountName(e.target.value)}
          className="p-2 text-black border rounded"
          required
        />
        <input
          type="number"
          placeholder="Enter count value"
          value={countValue}
          onChange={(e) => setCountValue(e.target.value)}
          className="p-2 text-black border rounded"
          required
        />
        <button
          type="submit"
          className="py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700"
        >
          Add Count
        </button>
      </form>
    </div>
  );
}

import React, { useState } from "react";
import axios from "axios";

export default function AddStatForm() {
  const [num, setNum] = useState("");
  const [mark, setMark] = useState("+");
  const [text, setText] = useState("");

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

    if (!num || !mark || !text) {
      setError("Please fill in all fields.");
      return;
    }

    const newStat = {
      num: parseInt(num),
      mark,
      text,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/stats",
        newStat,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Stat added successfully!");
      setNum("");
      setMark("+");
      setText("");
    } catch (err) {
      console.error("Error adding stat:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to add stat.");
    }
  };

  return (
    <div className="p-5 bg-white rounded-lg shadow-lg w-80">
      <h2 className="text-lg font-semibold text-gray-800">Add New Stat</h2>

      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-4">
        <input
          type="number"
          placeholder="Enter number"
          value={num}
          onChange={(e) => setNum(e.target.value)}
          className="p-2 text-black border rounded"
          required
        />
        <input
          type="text"
          placeholder="Enter mark (e.g., +)"
          value={mark}
          onChange={(e) => setMark(e.target.value)}
          className="p-2 text-black border rounded"
          required
        />
        <input
          type="text"
          placeholder="Enter description"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="p-2 text-black border rounded"
          required
        />
        <button
          type="submit"
          className="py-2 text-white transition bg-black hover:bg-black/80"
        >
          Add Stat
        </button>
      </form>
    </div>
  );
}

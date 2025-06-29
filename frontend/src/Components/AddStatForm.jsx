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
    <div className="p-8 bg-gray-800 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Add New Stat
      </h2>
      {message && <p className="text-green-400 mb-2 text-center">{message}</p>}
      {error && <p className="text-red-400 mb-2 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          type="number"
          placeholder="Enter number"
          value={num}
          onChange={(e) => setNum(e.target.value)}
          className="p-3 bg-white text-black border border-gray-300 rounded-md"
          required
        />
        <input
          type="text"
          placeholder="Enter mark (e.g., +)"
          value={mark}
          onChange={(e) => setMark(e.target.value)}
          className="p-3 bg-white text-black border border-gray-300 rounded-md"
          required
        />
        <input
          type="text"
          placeholder="Enter description"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="p-3 bg-white text-black border border-gray-300 rounded-md"
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-black text-white rounded-md hover:bg-black/80 font-semibold"
        >
          Add Stat
        </button>
      </form>
    </div>
  );
}

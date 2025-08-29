import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function Counts({ onClose, onSelectCount }) {
  const [inputValue, setInputValue] = useState("");
  const [counts, setCounts] = useState([]);
  const [role, setRole] = useState(null);
  const [editingCount, setEditingCount] = useState(null);

  useEffect(() => {
    const updateRole = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setRole(decoded.role);
        } catch (error) {
          console.error("Invalid token:", error);
          setRole(null);
        }
      } else {
        setRole(null);
      }
    };
    updateRole();
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/counts`);
        if (response.data && Array.isArray(response.data.tshirtCounts)) {
          setCounts(response.data.tshirtCounts);
        } else {
          console.error("Counts data is not in expected format", response.data);
        }
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };
    fetchCounts();
  }, []);

  const startEditing = (count) => {
    setEditingCount({ ...count });
  };

  const handleUpdate = async () => {
    if (!editingCount) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/counts/${editingCount._id}`,
        { name: editingCount.name, price: editingCount.price },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setCounts((prev) =>
          prev.map((count) =>
            count._id === editingCount._id ? editingCount : count
          )
        );
        setEditingCount(null);
      }
    } catch (error) {
      console.error("Error updating count:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/counts/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setCounts((prev) => prev.filter((count) => count._id !== id));
      }
    } catch (error) {
      console.error("Error deleting count:", error);
    }
  };

  const handleConfirm = () => {
    const value = Number(inputValue);
    if (!value || value <= 24) return;

    // Find the range for the unit price
    const range = counts.find((c) => {
      const [min, max] = c.name.split("-").map(Number);
      return value >= min && value <= max;
    });
    const unitPrice = range ? range.price : counts[counts.length - 1]?.price || 0;

    // Send object with name and unit price so Shop page can display it
    onSelectCount({ name: `${value}`, price: unitPrice });
    onClose();
  };

  return (
    <div className="inset-0 z-50 flex items-center justify-center">
      <div className="relative px-10 py-5 bg-white rounded-lg shadow-lg">
        <button
          className="absolute top-[-10px] right-[-10px] bg-red-500 text-white px-3 py-1 rounded-full"
          onClick={onClose}
        >
          X
        </button>

        <p className="text-center text-black font-semibold text-[20px] pb-7">
          Enter Count
        </p>

        <div className="flex flex-col items-start gap-3">
          <input
            type="number"
            placeholder="Enter count (min 25)"
            min={25}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="px-3 py-2 border rounded w-full text-black"
          />

          {role === "admin" && counts.length > 0 && (
            <div className="mt-4">
              {counts.map((count) => (
                <div key={count._id} className="flex items-center justify-between mt-2">
                  <span className="text-black">{count.name} : Rs {count.price}</span>
                  <div>
                    <button
                      onClick={() => startEditing(count)}
                      className="px-2 py-1 text-white bg-blue-500 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(count._id)}
                      className="px-2 py-1 ml-2 text-white bg-red-500 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {editingCount && (
          <div className="flex items-center mt-4 space-x-2">
            <input
              type="text"
              value={editingCount.name}
              onChange={(e) =>
                setEditingCount({ ...editingCount, name: e.target.value })
              }
              className="px-2 py-1 text-black border rounded"
            />
            <input
              type="number"
              value={editingCount.price}
              onChange={(e) =>
                setEditingCount({ ...editingCount, price: Number(e.target.value) })
              }
              className="w-16 px-2 py-1 text-black border rounded"
            />
            <button
              onClick={handleUpdate}
              className="px-2 py-1 text-white bg-green-500 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditingCount(null)}
              className="px-2 py-1 text-white bg-gray-500 rounded"
            >
              Cancel
            </button>
          </div>
        )}

        <div className="flex justify-center mt-9">
          <button
            className="px-3 py-2 text-white bg-gray-700 rounded"
            onClick={handleConfirm}
            disabled={!inputValue || inputValue <= 24}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

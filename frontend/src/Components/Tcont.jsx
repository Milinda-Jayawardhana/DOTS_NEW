import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function Counts({ onClose, onSelectCount }) {
  const [selectedCount, setSelectedCount] = useState(null);
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

  const handleCountChange = (count) => {
    setSelectedCount(count);
  };

  const startEditing = (count) => {
    setEditingCount({ ...count });
  };

  const handleUpdate = async () => {
    if (!editingCount) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/counts/${editingCount._id}`,
        {
          name: editingCount.name,
          price: editingCount.price,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setCounts((prev) =>
          prev.map((count) =>
            count._id === editingCount._id ? editingCount : count
          )
        );
        setEditingCount(null);
        console.log("Count updated successfully");
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setCounts((prev) => prev.filter((count) => count._id !== id));
        console.log("Count deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting count:", error);
    }
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
          Select a Count Range
        </p>

        <div className="flex flex-col items-start gap-3">
          {counts.length > 0 ? (
            counts.map((count) => (
              <div key={count._id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="countSelection"
                  checked={selectedCount?._id === count._id}
                  onChange={() => handleCountChange(count)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-black">
                  {count.name}
                </span>

                {role === "admin" && (
                  <div className="ml-4">
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
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No counts available.</p>
          )}
        </div>

        {editingCount && (
          <div className="flex items-center mt-4 space-x-2">
            <input
              type="text"
              value={editingCount.name}
              onChange={(e) =>
                setEditingCount({
                  ...editingCount,
                  name: e.target.value,
                })
              }
              className="px-2 py-1 text-black border rounded"
            />
            <input
              type="number"
              value={editingCount.price}
              onChange={(e) =>
                setEditingCount({
                  ...editingCount,
                  price: Number(e.target.value),
                })
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
            onClick={() => {
              onSelectCount(selectedCount);
              onClose();
            }}
            disabled={!selectedCount}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

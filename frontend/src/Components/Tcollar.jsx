import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function CollarType({ onClose, onSelectCollar }) {
  const [selectedCollar, setSelectedCollar] = useState(null);
  const [collars, setCollars] = useState([]);
  const [role, setRole] = useState(null);
  const [editingCollar, setEditingCollar] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
      } catch (error) {
        console.error("Invalid token:", error);
        setRole(null);
      }
    }
  }, []);

  useEffect(() => {
    const fetchCollars = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/collars`);
        if (response.data && Array.isArray(response.data.collars)) {
          setCollars(response.data.collars);
        } else {
          console.error("Collar data is not in expected format", response.data);
        }
      } catch (error) {
        console.error("Error fetching collars:", error);
      }
    };
    fetchCollars();
  }, []);

  const handleCollarChange = (collar) => {
    setSelectedCollar(collar);
  };

  const startEditing = (collar) => {
    setEditingCollar({ ...collar });
  };

  const handleUpdate = async () => {
    if (!editingCollar) return;
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/collars/${editingCollar._id}`,
        {
          name: editingCollar.name,
          price: editingCollar.price,
        }
      );

      if (response.status === 200) {
        setCollars((prev) =>
          prev.map((collar) =>
            collar._id === editingCollar._id ? editingCollar : collar
          )
        );
        setEditingCollar(null);
        console.log("Collar updated successfully");
      }
    } catch (error) {
      console.error("Error updating collar:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/collars/${id}`);
      if (response.status === 200) {
        setCollars((prev) => prev.filter((collar) => collar._id !== id));
        console.log("Collar deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting collar:", error);
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
          Select a Collar Type
        </p>

        <div className="flex flex-col items-start gap-3">
          {collars.length > 0 ? (
            collars.map((collar) => (
              <div key={collar._id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="collarSelection"
                  checked={selectedCollar?._id === collar._id}
                  onChange={() => handleCollarChange(collar)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-black">{collar.name}</span>

                {role === "admin" && (
                  <div className="ml-4">
                    <button
                      onClick={() => startEditing(collar)}
                      className="px-2 py-1 text-white bg-blue-500 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(collar._id)}
                      className="px-2 py-1 ml-2 text-white bg-red-500 rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No collar types available.</p>
          )}
        </div>

        {editingCollar && (
          <div className="flex items-center mt-4 space-x-2">
            <input
              type="text"
              value={editingCollar.name}
              onChange={(e) =>
                setEditingCollar({
                  ...editingCollar,
                  name: e.target.value,
                })
              }
              className="px-2 py-1 text-black border rounded"
            />
            <input
              type="number"
              value={editingCollar.price}
              onChange={(e) =>
                setEditingCollar({
                  ...editingCollar,
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
              onClick={() => setEditingCollar(null)}
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
              onSelectCollar(selectedCollar);
              onClose();
            }}
            disabled={!selectedCollar}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

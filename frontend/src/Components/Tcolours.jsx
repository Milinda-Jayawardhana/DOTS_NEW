import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Assuming jwtDecode is imported

export default function Tcolours({ onClose, onSelectColours }) {
  const [selectedColors, setSelectedColors] = useState([]); // Tracks selected colors
  const [colors, setColors] = useState([]); // Default is an empty array
  const [role, setRole] = useState(null); // To store the user role
  const [editingColor, setEditingColor] = useState(null); // Tracks which color is being edited

  // Fetch the role from the token
  useEffect(() => {
    const updateRole = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setRole(decoded.role); // Assuming role is part of the decoded token
        } catch (error) {
          console.error("Invalid token:", error);
          setRole(null);
        }
      } else {
        setRole(null); // Clear role on logout
      }
    };

    updateRole();
  }, []);

  // Fetch colors from the backend
  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/colors`);
        if (response.data && Array.isArray(response.data.colors)) {
          setColors(response.data.colors);
        } else {
          console.error("Colors data is not in expected format");
        }
      } catch (error) {
        console.error("Error fetching colors:", error);
      }
    };

    fetchColors();
  }, []);

  // Handle checkbox change
  const handleColorChange = (color) => {
    setSelectedColors((prev) =>
      prev.some((c) => c._id === color._id)
        ? prev.filter((c) => c._id !== color._id)
        : [...prev, color]
    );
  };

  // Start editing the color
  const startEditing = (color) => {
    setEditingColor({ ...color });
  };

  // Handle update color
  const handleUpdate = async () => {
    if (!editingColor) return;

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/colors/${editingColor._id}`,
        {
          name: editingColor.name,
          price: editingColor.price,
        }
      );

      if (response.status === 200) {
        setColors((prev) =>
          prev.map((color) =>
            color._id === editingColor._id ? editingColor : color
          )
        );
        setEditingColor(null);
        console.log("Color updated successfully");
      }
    } catch (error) {
      console.error("Error updating color:", error);
    }
  };

  // Handle delete color
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/colors/${id}`
      );
      if (response.status === 200) {
        setColors((prev) => prev.filter((color) => color._id !== id));
        console.log("Color deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting color:", error);
    }
  };

  return (
    <div className="inset-0 z-50 flex items-center justify-center">
      <div className="relative py-5 bg-white rounded-lg shadow-lg px-14">
        {/* Close Button */}
        <button
          className="absolute top-[-10px] right-[-10px] bg-red-500 text-white px-3 py-1 rounded-full"
          onClick={onClose}
        >
          X
        </button>

        {/* Title */}
        <p className="text-center text-black font-semibold text-[20px] pb-7">
          Select Colours
        </p>

        {/* Color List */}
        <div className="flex flex-col items-start gap-3">
          {colors.length > 0 ? (
            colors.map((color) => (
              <div key={color._id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedColors.some((c) => c._id === color._id)}
                  onChange={() => handleColorChange(color)}
                  className="w-4 h-4 cursor-pointer"
                />

                {/* Display edit or delete if user is admin */}
                {editingColor && editingColor._id === color._id ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={editingColor.name}
                      onChange={(e) =>
                        setEditingColor({
                          ...editingColor,
                          name: e.target.value,
                        })
                      }
                      className="px-2 py-1 text-black border rounded"
                    />
                    <input
                      type="number"
                      value={editingColor.price}
                      onChange={(e) =>
                        setEditingColor({
                          ...editingColor,
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
                      onClick={() => setEditingColor(null)}
                      className="px-2 py-1 text-white bg-gray-500 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-black">{color.name}</span>
                    {role === "admin" && (
                      <div className="ml-4">
                        <button
                          onClick={() => startEditing(color)}
                          className="px-2 py-1 text-white bg-blue-500 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(color._id)}
                          className="px-2 py-1 ml-2 text-white bg-red-500 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No colors available.</p>
          )}
        </div>

        {/* Confirm Button */}
        <div className="flex justify-center mt-9">
          <button
            className="px-3 py-2 text-white bg-gray-700 rounded cursor-pointer"
            onClick={() => {
              console.log("Selected Colors:", selectedColors); // Debugging
              onSelectColours(selectedColors); // Make sure this updates the parent state
              onClose(); // Close the popup
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

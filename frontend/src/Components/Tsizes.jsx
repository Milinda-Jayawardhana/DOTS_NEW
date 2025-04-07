import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; 

export default function Sizes({ onClose, onSelectSizes }) {
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [role, setRole] = useState(null);
  const [editingSize, setEditingSize] = useState(null);

  // Fetch the role from the token
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

  // Fetch sizes from backend
  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/sizes");
        if (response.data && Array.isArray(response.data.sizes)) {
          setSizes(response.data.sizes);
        } else {
          console.error("Sizes data is not in expected format");
        }
      } catch (error) {
        console.error("Error fetching sizes:", error);
      }
    };
    fetchSizes();
  }, []);

  // Handle checkbox change (multi-selection)
  const handleSizeChange = (size) => {
    setSelectedSizes((prev) =>
      prev.some((s) => s._id === size._id)
        ? prev.filter((s) => s._id !== size._id)
        : [...prev, size]
    );
  };

  // Handle delete size
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/sizes/${id}`
      );
      if (response.status === 200) {
        setSizes((prev) => prev.filter((size) => size._id !== id));
        console.log("Size deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting size:", error);
    }
  };

  // Handle edit size
  const startEditing = (size) => {
    setEditingSize({ ...size });
  };

  // Handle update size
  const handleUpdate = async () => {
    if (!editingSize) return;

    try {
      const response = await axios.put(
        `http://localhost:3000/api/sizes/${editingSize._id}`,
        {
          name: editingSize.name,
        }
      );

      if (response.status === 200) {
        setSizes((prev) =>
          prev.map((size) =>
            size._id === editingSize._id ? editingSize : size
          )
        );
        setEditingSize(null);
        console.log("Size updated successfully");
      }
    } catch (error) {
      console.error("Error updating size:", error);
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
          Select Sizes
        </p>

        {/* Size List */}
        <div className="flex flex-col items-start gap-3">
          {sizes.length > 0 ? (
            sizes.map((size) => (
              <div key={size._id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedSizes.some((s) => s._id === size._id)}
                  onChange={() => handleSizeChange(size)}
                  className="w-4 h-4 cursor-pointer"
                />
                {editingSize && editingSize._id === size._id ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={editingSize.name}
                      onChange={(e) =>
                        setEditingSize({
                          ...editingSize,
                          name: e.target.value,
                        })
                      }
                      className="px-2 py-1 text-black border rounded"
                    />
                    <button
                      onClick={handleUpdate}
                      className="px-2 py-1 text-white bg-green-500 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingSize(null)}
                      className="px-2 py-1 text-white bg-gray-500 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-black">{size.name}</span>
                    {role === "admin" && (
                      <div className="ml-4">
                        <button
                          onClick={() => startEditing(size)}
                          className="px-2 py-1 text-white bg-blue-500 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(size._id)}
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
            <p className="text-gray-500">No sizes available.</p>
          )}
        </div>

        {/* Confirm Button */}
        <div className="flex justify-center mt-9">
          <button
            className="px-3 py-2 text-white bg-gray-700 rounded"
            onClick={() => {
              onSelectSizes(selectedSizes); // Send selected sizes back
              onClose();
            }}
            disabled={selectedSizes.length === 0} // Disable if no selection
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function Tmaterial({ onClose, onSelectMaterial }) {
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [role, setRole] = useState(null);
  const [editingMaterial, setEditingMaterial] = useState(null);

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

  // Fetch materials from backend
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/material`);
        if (response.data && Array.isArray(response.data.materials)) {
          setMaterials(response.data.materials);
        } else {
          console.error("Materials data is not in expected format");
        }
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
    };
    fetchMaterials();
  }, []);

  // Handle radio button change (single selection)
  const handleMaterialChange = (material) => {
    setSelectedMaterial(material);
  };

  // Handle delete material
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/material/${id}`);
      if (response.status === 200) {
        setMaterials((prev) => prev.filter((material) => material._id !== id));
        console.log("Material deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting material:", error);
    }
  };

  // Handle edit button click
  const startEditing = (material) => {
    setEditingMaterial({ ...material });
  };

  // Handle update material
  const handleUpdate = async () => {
    if (!editingMaterial) return;
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/material/${editingMaterial._id}`,
        {
          name: editingMaterial.name,
          price: editingMaterial.price,
        }
      );
      if (response.status === 200) {
        setMaterials((prev) =>
          prev.map((material) =>
            material._id === editingMaterial._id ? editingMaterial : material
          )
        );
        setEditingMaterial(null);
        console.log("Material updated successfully");
      }
    } catch (error) {
      console.error("Error updating material:", error);
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
          Select Material
        </p>

        {/* Material List */}
        <div className="flex flex-col items-start gap-3">
          {materials.length > 0 ? (
            materials.map((material) => (
              <div key={material._id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="material"
                  checked={selectedMaterial?._id === material._id}
                  onChange={() => handleMaterialChange(material)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-black">{material.name}</span>
                {role === "admin" && (
                  <div className="ml-4">
                    <button
                      onClick={() => startEditing(material)}
                      className="px-2 py-1 text-white bg-blue-500 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(material._id)}
                      className="px-2 py-1 ml-2 text-white bg-red-500 rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}
                {editingMaterial && editingMaterial._id === material._id && (
                  <div className="flex items-center ml-4 space-x-2">
                    <input
                      type="text"
                      value={editingMaterial.name}
                      onChange={(e) =>
                        setEditingMaterial({
                          ...editingMaterial,
                          name: e.target.value,
                        })
                      }
                      className="px-2 py-1 text-black border rounded"
                    />
                    <input
                      type="number"
                      value={editingMaterial.price}
                      onChange={(e) =>
                        setEditingMaterial({
                          ...editingMaterial,
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
                      onClick={() => setEditingMaterial(null)}
                      className="px-2 py-1 text-white bg-gray-500 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No materials available.</p>
          )}
        </div>

        {/* Confirm Button */}
        <div className="flex justify-center mt-9">
          <button
            className="px-3 py-2 text-white bg-gray-700 rounded"
            onClick={() => {
              onSelectMaterial(selectedMaterial);
              onClose();
            }}
            disabled={!selectedMaterial} // Disable confirm if no material selected
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

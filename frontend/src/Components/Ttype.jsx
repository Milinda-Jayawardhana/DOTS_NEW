import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function Ttype({ onClose, onSelectType }) {
  const [selectedType, setSelectedType] = useState(null);
  const [types, setTypes] = useState([]);
  const [role, setRole] = useState(null);
  const [editingType, setEditingType] = useState(null);

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
    const fetchTypes = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/types");
        if (response.data && Array.isArray(response.data.types)) {
          setTypes(response.data.types);
        } else {
          console.error("Types data is not in expected format", response.data);
        }
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };
    fetchTypes();
  }, []);

  const handleTypeChange = (type) => {
    setSelectedType(type);
  };

  const startEditing = (type) => {
    setEditingType({ ...type });
  };

  const handleUpdate = async () => {
    if (!editingType) return;
    try {
      const response = await axios.put(
        `http://localhost:3000/api/types/${editingType._id}`,
        {
          name: editingType.name,
          price: editingType.price,
        }
      );

      if (response.status === 200) {
        setTypes((prev) =>
          prev.map((type) =>
            type._id === editingType._id ? editingType : type
          )
        );
        setEditingType(null);
        console.log("Type updated successfully");
      }
    } catch (error) {
      console.error("Error updating type:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/types/${id}`);
      if (response.status === 200) {
        setTypes((prev) => prev.filter((type) => type._id !== id));
        console.log("Type deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting type:", error);
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
          Select a T-Shirt Type
        </p>

        <div className="flex flex-col items-start gap-3">
          {types.length > 0 ? (
            types.map((type) => (
              <div key={type._id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="typeSelection"
                  checked={selectedType?._id === type._id}
                  onChange={() => handleTypeChange(type)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-black">
                  {type.name} - Rs. {type.price}
                </span>

                {role === "admin" && (
                  <div className="ml-4">
                    <button
                      onClick={() => startEditing(type)}
                      className="px-2 py-1 text-white bg-blue-500 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(type._id)}
                      className="px-2 py-1 ml-2 text-white bg-red-500 rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No types available.</p>
          )}
        </div>

        {editingType && (
          <div className="flex items-center mt-4 space-x-2">
            <input
              type="text"
              value={editingType.name}
              onChange={(e) =>
                setEditingType({
                  ...editingType,
                  name: e.target.value,
                })
              }
              className="px-2 py-1 text-black border rounded"
            />
            <input
              type="number"
              value={editingType.price}
              onChange={(e) =>
                setEditingType({
                  ...editingType,
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
              onClick={() => setEditingType(null)}
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
              onSelectType(selectedType);
              onClose();
            }}
            disabled={!selectedType}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
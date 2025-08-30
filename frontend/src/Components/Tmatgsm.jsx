import React, { useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

export default function Tmatgsm({ onClose, onSelectGsm }) {
  const [selectedGsm, setSelectedGsm] = useState(null);
  const [gsmList, setGsmList] = useState([]);
  const [role, setRole] = useState(null);
  const [editingGsm, setEditingGsm] = useState(null);

  // decode token for role
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

  // fetch GSM options
  useEffect(() => {
    const fetchGsmList = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/gsm`);
        if (response.data && Array.isArray(response.data.gsmList)) {
          setGsmList(response.data.gsmList);
        } else {
          console.error("Unexpected GSM response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching GSM:", error);
      }
    };
    fetchGsmList();
  }, []);

  const handleGsmChange = (gsm) => {
    setSelectedGsm(gsm);
  };

  const startEditing = (gsm) => {
    setEditingGsm({ ...gsm });
  };

  const handleUpdate = async () => {
    if (!editingGsm) return;
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/gsm/${editingGsm._id}`,
        {
          name: editingGsm.name,
          price: editingGsm.price,
        }
      );

      if (response.status === 200) {
        setGsmList((prev) =>
          prev.map((g) => (g._id === editingGsm._id ? editingGsm : g))
        );
        setEditingGsm(null);
        console.log("GSM updated successfully");
      }
    } catch (error) {
      console.error("Error updating GSM:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/gsm/${id}`);
      if (response.status === 200) {
        setGsmList((prev) => prev.filter((g) => g._id !== id));
        console.log("GSM deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting GSM:", error);
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
          Select GSM
        </p>

        <div className="flex flex-col items-start gap-3">
          {gsmList.length > 0 ? (
            gsmList.map((gsm) => (
              <div key={gsm._id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="gsmSelection"
                  checked={selectedGsm?._id === gsm._id}
                  onChange={() => handleGsmChange(gsm)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-black">
                  {gsm.name} GSM
                </span>

                {role === "admin" && (
                  <div className="ml-4">
                    <button
                      onClick={() => startEditing(gsm)}
                      className="px-2 py-1 text-white bg-blue-500 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(gsm._id)}
                      className="px-2 py-1 ml-2 text-white bg-red-500 rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No GSM options available.</p>
          )}
        </div>

        {editingGsm && (
          <div className="flex items-center mt-4 space-x-2">
            <input
              type="number"
              value={editingGsm.name}
              onChange={(e) =>
                setEditingGsm({
                  ...editingGsm,
                  name: e.target.value,
                })
              }
              className="w-20 px-2 py-1 text-black border rounded"
              placeholder="GSM"
            />
            <input
              type="number"
              value={editingGsm.price}
              onChange={(e) =>
                setEditingGsm({
                  ...editingGsm,
                  price: Number(e.target.value),
                })
              }
              className="w-20 px-2 py-1 text-black border rounded"
              placeholder="Price"
            />
            <button
              onClick={handleUpdate}
              className="px-2 py-1 text-white bg-green-500 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditingGsm(null)}
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
              onSelectGsm(selectedGsm);
              onClose();
            }}
            disabled={!selectedGsm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

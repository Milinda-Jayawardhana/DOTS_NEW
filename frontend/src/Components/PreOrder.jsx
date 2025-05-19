import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function PreOrder({ onClose }) {
  const [formData, setFormData] = useState({
    customerName: "",
    address: "",
    telephone: "",
    material: "",
    printingType: "",
    quantity: "",
    quantities: {},
  });

  const [materials, setMaterials] = useState([]);
  const [types, setTypes] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [matRes, typeRes, sizeRes] = await Promise.all([
          axios.get("http://localhost:3000/api/material"),
          axios.get("http://localhost:3000/api/types"),
          axios.get("http://localhost:3000/api/sizes"),
        ]);

        setMaterials(matRes.data.materials || []);
        setTypes(typeRes.data.types || []);
        const sizeList = sizeRes.data.sizes || [];
        setSizes(sizeList);

        const initialQuantities = {};
        sizeList.forEach((size) => {
          initialQuantities[size.name] = 0;
        });

        setFormData((prev) => ({
          ...prev,
          quantities: initialQuantities,
        }));
      } catch (error) {
        console.error("Error fetching materials/types/sizes:", error);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("size-")) {
      const sizeKey = name.replace("size-", "");
      setFormData((prev) => ({
        ...prev,
        quantities: {
          ...prev.quantities,
          [sizeKey]: value === "" ? "" : Math.max(0, parseInt(value, 10)),
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return setMessage("Please log in to place an order");

      const decoded = jwtDecode(token);

      const formattedQuantities = Object.entries(formData.quantities).map(
        ([size, count]) => ({
          size,
          count,
        })
      );

      const payload = {
        userEmail: decoded.email,
        customerName: formData.customerName,
        address: formData.address,
        telephone: formData.telephone,
        quantity: formData.quantity,
        material: formData.material,
        printingType: formData.printingType,
        quantities: formattedQuantities,
      };

      const response = await axios.post(
        "http://localhost:3000/api/order",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message || "Order placed successfully!");

      const resetQuantities = {};
      sizes.forEach((size) => {
        resetQuantities[size.name] = 0;
      });

      setFormData({
        customerName: "",
        address: "",
        telephone: "",
        material: "",
        printingType: "",
        quantity: "",
        quantities: resetQuantities,
      });
    } catch (error) {
      console.error("Order error:", error);
      setMessage(error.response?.data?.message || "Error placing order.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex justify-center items-center px-4">
      <div className="bg-gray-900 rounded-lg p-6 max-w-lg w-full relative overflow-y-auto max-h-[90vh] text-white">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 text-3xl hover:text-red-600"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4">
          Place Your T-Shirt Order
        </h2>
        {message && <p className="mb-4 text-green-400">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="customerName"
            placeholder="Enter Customer Name"
            value={formData.customerName}
            onChange={handleChange}
            className="w-full bg-black text-white border border-gray-600 rounded px-3 py-2 placeholder-gray-400"
            required
          />

          <input
            type="text"
            name="address"
            placeholder="Enter Delivery Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full bg-black text-white border border-gray-600 rounded px-3 py-2 placeholder-gray-400"
            required
          />

          <input
            type="text"
            name="telephone"
            placeholder="Enter Telephone Number (10 digits)"
            value={formData.telephone}
            onChange={handleChange}
            pattern="[0-9]{10}"
            className="w-full bg-black text-white border border-gray-600 rounded px-3 py-2 placeholder-gray-400"
            required
          />

          <input
            type="text"
            name="quantity"
            placeholder="Total Quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full bg-black text-white border border-gray-600 rounded px-3 py-2 placeholder-gray-400"
            required
          />

          <select
            name="material"
            value={formData.material}
            onChange={handleChange}
            className="w-full bg-black text-white border border-gray-600 rounded px-3 py-2 placeholder-gray-400"
            required
          >
            <option value="" disabled>
              Select Material
            </option>
            {materials.map((mat) => (
              <option key={mat._id} value={mat.name}>
                {mat.name}
              </option>
            ))}
          </select>

          <select
            name="printingType"
            value={formData.printingType}
            onChange={handleChange}
            className="w-full bg-black text-white border border-gray-600 rounded px-3 py-2 placeholder-gray-400"
            required
          >
            <option value="" disabled>
              Select Printing Type
            </option>
            {types.map((type) => (
              <option key={type._id} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>

          <div>
            <h4 className="font-medium mb-2">Quantities</h4>
            {sizes.map((size) => (
              <div key={size._id} className="flex items-center space-x-3 mb-2">
                <label className="w-20">{size.name}</label>
                <input
                  type="number"
                  name={`size-${size.name}`}
                  value={
                    formData.quantities[size.name] === 0
                      ? ""
                      : formData.quantities[size.name]
                  }
                  onChange={handleChange}
                  min="0"
                  className="bg-black text-white border border-gray-600 rounded px-3 py-1 w-full placeholder-gray-400"
                  placeholder={`Quantity of ${size.name}`}
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 transition-colors text-white w-full py-3 rounded font-semibold"
          >
            Submit Order
          </button>
        </form>
      </div>
    </div>
  );
}

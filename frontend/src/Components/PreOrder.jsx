import React, { useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom"; // Re-added this

export default function PreOrder({ onClose }) {
  const navigate = useNavigate(); // Re-added this
  const initialFormData = {
    customerName: "",
    address: "",
    telephone: "",
    material: "",
    printingType: "",
    quantity: "",
    quantities: {},
    collars: [],
    piping: [],
    finishing: [],
    label: [],
    buttons: { count: "", colour: "" },
    outlines: [],
    sleeve: [],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [materials, setMaterials] = useState([]);
  const [types, setTypes] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [message, setMessage] = useState("");

  const multiOptions = {
    collars: ["Ready Made", "Half in", "Half out", "Full Collar"],
    piping: ["Arm Whole", "Cuff", "Placket"],
    finishing: [
      "Side Open",
      "Single Plackets",
      "Front Packets",
      "Under Packets",
    ],
    label: ["Label-DOTS", "Label-Size"],
    outlines: [
      "Shoulder-1/8",
      "Shoulder-1/16",
      "Armwhole-1/8",
      "Armwhole-1/16",
      "Collar-1/8",
      "Collar-1/16",
      "Contras-1/8",
      "Contras-1/16",
    ],
    sleeve: ["Normal", "Cuff", "DB Hem"],
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [matRes, typeRes, sizeRes, colorRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/material`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/types`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/sizes`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/colors`),
        ]);

        setMaterials(matRes.data.materials || []);
        setTypes(typeRes.data.types || []);
        const sizeList = sizeRes.data.sizes || [];
        setSizes(sizeList);
        setColors(colorRes.data.colors || []);

        const initialQuantities = {};
        sizeList.forEach((size) => {
          initialQuantities[size.name] = 0;
        });

        setFormData((prev) => ({
          ...initialFormData,
          quantities: initialQuantities,
        }));
      } catch (error) {
        console.error("Error fetching materials/types/sizes:", error);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("size-")) {
      const sizeKey = name.replace("size-", "");
      setFormData((prev) => ({
        ...prev,
        quantities: {
          ...prev.quantities,
          [sizeKey]: value === "" ? "" : Math.max(0, parseInt(value, 10)),
        },
      }));
    } else if (multiOptions[name]) {
      setFormData((prev) => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter((item) => item !== value),
      }));
    } else if (name === "buttonCount" || name === "buttonColour") {
      setFormData((prev) => ({
        ...prev,
        buttons: {
          ...prev.buttons,
          [name === "buttonCount" ? "count" : "colour"]: value,
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

      // Enhanced token validation
      try {
        const decoded = jwtDecode(token);
        console.log("Token decoded successfully:", decoded);
        
        // Check if token is expired
        const now = Date.now() / 1000;
        if (decoded.exp && decoded.exp < now) {
          localStorage.removeItem("token");
          setMessage("Session expired. Please log in again.");
          navigate("/login");
          return;
        }
      } catch (decodeError) {
        console.error("Token decode failed:", decodeError);
        localStorage.removeItem("token");
        setMessage("Invalid session. Please log in again.");
        navigate("/login");
        return;
      }

      // Filter out empty quantities to avoid sending zeros
      const formattedQuantities = Object.entries(formData.quantities)
        .filter(([size, count]) => count && count > 0)
        .map(([size, count]) => ({ size, count: parseInt(count, 10) }));

      const payload = {
        customerName: formData.customerName.trim(),
        address: formData.address.trim(),
        telephone: formData.telephone.trim(),
        quantity: parseInt(formData.quantity, 10), // Convert to number
        material: formData.material,
        printingType: formData.printingType,
        quantities: formattedQuantities,
        collars: formData.collars,
        piping: formData.piping,
        finishing: formData.finishing,
        label: formData.label,
        buttons: {
          count: formData.buttons.count ? parseInt(formData.buttons.count, 10) : 0,
          colour: formData.buttons.colour
        },
        outlines: formData.outlines,
        sleeve: formData.sleeve,
      };

      console.log("Sending payload:", payload);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/order`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setMessage(response.data.message || "Order placed successfully!");

      // Reset formData after successful submit:
      const resetQuantities = {};
      sizes.forEach((size) => {
        resetQuantities[size.name] = 0;
      });

      setFormData({
        ...initialFormData,
        quantities: resetQuantities,
      });
    } catch (error) {
      console.error("Order error:", error);
      console.error("Response data:", error.response?.data);
      console.error("Response status:", error.response?.status);
      
      const serverMessage = error.response?.data?.message || "Error placing order.";
      setMessage(serverMessage);

      // Handle authentication errors
      if (error.response?.status === 401 || 
          error.response?.status === 403 ||
          serverMessage.toLowerCase().includes("invalid") ||
          serverMessage.toLowerCase().includes("unauthorized")) {
        localStorage.removeItem("token");
        setMessage("Session invalid. Please log in again.");
        navigate("/login");
      }
    }
  };

  const renderCheckboxGroup = (label, name, options) => (
    <div>
      <h4 className="font-medium mt-4">{label}</h4>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-1">
            <input
              type="checkbox"
              name={name}
              value={option}
              checked={formData[name].includes(option)}
              onChange={handleChange}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex justify-center items-center px-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full relative overflow-y-auto max-h-[90vh] text-white">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 text-3xl hover:text-black"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl text-center font-semibold mb-4">
          Place Your T-Shirt Order
        </h2>
        {message && (
          <p className={`mb-4 ${message.includes('Error') || message.includes('invalid') ? 'text-red-400' : 'text-green-400'}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex gap-8">
            {/* LEFT COLUMN - INPUT FIELDS */}
            <div className="flex-1 space-y-4">
              <input
                type="text"
                name="customerName"
                placeholder="Customer Name"
                value={formData.customerName}
                onChange={handleChange}
                className="w-full bg-white text-black border border-gray-600 rounded px-3 py-2"
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-white text-black border border-gray-600 rounded px-3 py-2"
                required
              />
              <input
                type="tel"
                name="telephone"
                placeholder="Telephone (10 digits)"
                value={formData.telephone}
                onChange={handleChange}
                className="w-full bg-white text-black border border-gray-600 rounded px-3 py-2"
                pattern="[0-9]{10}"
                title="Please enter exactly 10 digits"
                required
              />
              <input
                type="number"
                name="quantity"
                placeholder="Total Quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full bg-white text-black border border-gray-600 rounded px-3 py-2"
                min="1"
                required
              />

              <select
                name="material"
                value={formData.material}
                onChange={handleChange}
                className="w-full bg-white text-black border border-gray-600 rounded px-3 py-2"
                required
              >
                <option value="">Select Material</option>
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
                className="w-full bg-white text-black border border-gray-600 rounded px-3 py-2"
                required
              >
                <option value="">Select Printing Type</option>
                {types.map((type) => (
                  <option key={type._id} value={type.name}>
                    {type.name}
                  </option>
                ))}
              </select>

              <div>
                <h4 className="font-medium">Size Quantities</h4>
                {sizes.map((size) => (
                  <div
                    key={size._id}
                    className="flex items-center space-x-3 mb-2"
                  >
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
                      className="bg-white text-black border border-gray-600 rounded px-3 py-1 w-full"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN - CHECKBOX GROUPS */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 min-h-full">
              {renderCheckboxGroup("Collars", "collars", multiOptions.collars)}
              {renderCheckboxGroup("Piping", "piping", multiOptions.piping)}
              {renderCheckboxGroup(
                "Finishing",
                "finishing",
                multiOptions.finishing
              )}
              {renderCheckboxGroup("Label", "label", multiOptions.label)}
              {renderCheckboxGroup(
                "Outlines",
                "outlines",
                multiOptions.outlines
              )}
              {renderCheckboxGroup("Sleeve", "sleeve", multiOptions.sleeve)}

              <div>
                <h4 className="font-medium">Button Count</h4>
                <input
                  type="number"
                  name="buttonCount"
                  value={formData.buttons.count}
                  onChange={handleChange}
                  className="w-full bg-white text-black border border-gray-600 rounded px-3 py-2"
                  placeholder="Number of buttons"
                  min="0"
                />
              </div>

              <div>
                <h4 className="font-medium">Button Colour</h4>
                <select
                  name="buttonColour"
                  value={formData.buttons.colour}
                  onChange={handleChange}
                  className="w-full bg-white text-black border border-gray-600 rounded px-3 py-2"
                >
                  <option value="">Select Button Colour</option>
                  {colors.map((color) => (
                    <option key={color._id} value={color.name}>
                      {color.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="bg-black hover:bg-black/40 transition-colors text-white w-full py-3 rounded font-semibold mt-4"
          >
            Submit Order
          </button>
        </form>
      </div>
    </div>
  );
}
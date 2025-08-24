import React, { useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

export default function PreOrder({ onClose }) {
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

  // Debug function to check token
  const debugToken = () => {
    const token = localStorage.getItem("token");
    console.log("=== TOKEN DEBUG INFO ===");
    console.log("Token exists:", !!token);
    console.log("Token length:", token ? token.length : 0);
    console.log("Token (first 50 chars):", token ? token.substring(0, 50) + "..." : "No token");
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);
        console.log("Token expiry:", new Date(decoded.exp * 1000));
        console.log("Current time:", new Date());
        console.log("Is token expired:", decoded.exp * 1000 < Date.now());
        
        // Check if token is about to expire (within 5 minutes)
        const fiveMinutesFromNow = Date.now() + (5 * 60 * 1000);
        console.log("Token expires soon:", decoded.exp * 1000 < fiveMinutesFromNow);
      } catch (decodeError) {
        console.error("Error decoding token:", decodeError);
      }
    }
    console.log("========================");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Debug token before making request
    debugToken();
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Please log in to place an order");
        return;
      }

      // Check if token is valid and not expired
      let decoded;
      try {
        decoded = jwtDecode(token);
        
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          setMessage("Your session has expired. Please log in again.");
          localStorage.removeItem("token"); // Clear expired token
          return;
        }
        
        console.log("Token is valid, user email:", decoded.email);
      } catch (decodeError) {
        console.error("Token decode error:", decodeError);
        setMessage("Invalid session. Please log in again.");
        localStorage.removeItem("token");
        return;
      }

      // Ensure quantities is properly formatted and cleaned
      const formattedQuantities = Object.entries(formData.quantities)
        .map(([size, count]) => ({
          size: String(size).trim(),
          count: parseInt(count) || 0
        }))
        .filter(item => item.count > 0); // Only include non-zero quantities

      // Clean and validate the payload
      const payload = {
        customerName: String(formData.customerName).trim(),
        address: String(formData.address).trim(),
        telephone: String(formData.telephone).trim(),
        quantity: String(formData.quantity).trim(),
        material: String(formData.material).trim(),
        printingType: String(formData.printingType).trim(),
        quantities: formattedQuantities,
        collars: Array.isArray(formData.collars) ? formData.collars : [],
        piping: Array.isArray(formData.piping) ? formData.piping : [],
        finishing: Array.isArray(formData.finishing) ? formData.finishing : [],
        label: Array.isArray(formData.label) ? formData.label : [],
        buttons: {
          count: String(formData.buttons.count || "").trim(),
          colour: String(formData.buttons.colour || "").trim()
        },
        outlines: Array.isArray(formData.outlines) ? formData.outlines : [],
        sleeve: Array.isArray(formData.sleeve) ? formData.sleeve : [],
      };

      // Log payload for debugging
      console.log("Sending payload:", JSON.stringify(payload, null, 2));
      console.log("Using API URL:", import.meta.env.VITE_API_URL);
      console.log("Token being sent:", token.substring(0, 50) + "...");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/order`,
        payload,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 30000, // 30 second timeout
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
      
      // Log more detailed error information
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
        
        // Handle specific error cases
        if (error.response.status === 401) {
          setMessage("Authentication failed. Please log in again.");
          localStorage.removeItem("token"); // Clear potentially invalid token
        } else if (error.response.status === 403) {
          setMessage("Access denied. Please check your permissions.");
        } else {
          setMessage(error.response?.data?.message || "Error placing order.");
        }
      } else if (error.request) {
        console.error("Network error - no response received:", error.request);
        setMessage("Network error. Please check your connection and try again.");
      } else {
        console.error("Request setup error:", error.message);
        setMessage("Request failed. Please try again.");
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
          <p className={`mb-4 ${message.includes('Error') || message.includes('failed') || message.includes('expired') ? 'text-red-400' : 'text-green-400'}`}>
            {message}
          </p>
        )}

        {/* Debug button - remove in production */}
        <button 
          type="button" 
          onClick={debugToken}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Debug Token
        </button>

        <form onSubmit={handleSubmit} >
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
                type="text"
                name="telephone"
                placeholder="Telephone"
                value={formData.telephone}
                onChange={handleChange}
                className="w-full bg-white text-black border border-gray-600 rounded px-3 py-2"
                pattern="[0-9]{10}"
                required
              />
              <input
                type="text"
                name="quantity"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full bg-white text-black border border-gray-600 rounded px-3 py-2"
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
                <h4 className="font-medium">Quantities</h4>
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
                <input
                  type="text"
                  name="buttonCount"
                  value={formData.buttons.count}
                  onChange={handleChange}
                  className="w-full bg-white text-black border border-gray-600 rounded px-3 py-2"
                  placeholder="Enter number of buttons"
                />
              </div>

              <div>
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
import React, { useState, useEffect } from "react";
import axios from "axios";

const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

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

  // image states
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null); // preview only

  const multiOptions = {
    collars: ["Ready Made", "Half in", "Half out", "Full Collar"],
    piping: ["Arm Whole", "Cuff", "Placket"],
    finishing: ["Side Open", "Single Plackets", "Front Packets", "Under Packets"],
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
        [name]: checked ? [...prev[name], value] : prev[name].filter((item) => item !== value),
      }));
    } else if (name === "buttonCount" || name === "buttonColour") {
      setFormData((prev) => ({
        ...prev,
        buttons: { ...prev.buttons, [name === "buttonCount" ? "count" : "colour"]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setImageFile(f);
      setUploadedImage(null);
    }
  };

  const uploadImageToServer = async () => {
    if (!imageFile) return null;
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append("image", imageFile);
      const token = localStorage.getItem("token");
      const apiBase = import.meta.env.VITE_API_URL || window.location.origin;
      const uploadUrl = `${apiBase.replace(/\/$/, "")}/api/images/upload`;
      const res = await axios.post(uploadUrl, fd, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "multipart/form-data",
        },
      });
      const data = res.data || {};
      const url = data.url || data.secure_url || data.result?.secure_url || data.data?.url;
      const public_id = data.public_id || data.result?.public_id || data.data?.public_id;
      const imageObj = { url, public_id };
      setUploadedImage(imageObj);
      return imageObj;
    } catch (err) {
      console.error("Image upload failed:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        url: err.config?.url,
      });
      setMessage("Image upload failed");
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return setMessage("Please log in to place an order");

      // use local parseJwt instead of jwt-decode package
      try {
        const decoded = parseJwt(token);
        console.log("Decoded token:", decoded);
      } catch (dErr) {
        console.warn("Token decode failed:", dErr);
      }

      // upload image automatically on submit (if selected)
      let imageInfo = uploadedImage;
      if (imageFile && !uploadedImage) {
        imageInfo = await uploadImageToServer();
        if (!imageInfo) return; // abort if upload failed
      }

      const formattedQuantities = Object.entries(formData.quantities).map(([size, count]) => ({
        size,
        count,
      }));

      const payload = {
        customerName: formData.customerName,
        address: formData.address,
        telephone: formData.telephone,
        quantity: formData.quantity,
        material: formData.material,
        printingType: formData.printingType,
        quantities: formattedQuantities,
        collars: formData.collars,
        piping: formData.piping,
        finishing: formData.finishing,
        label: formData.label,
        buttons: formData.buttons,
        outlines: formData.outlines,
        sleeve: formData.sleeve,
        images: imageInfo ? [imageInfo] : [],
      };

      console.log("Order payload:", payload);

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/order`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage(response.data.message || "Order placed successfully!");

      const resetQuantities = {};
      sizes.forEach((size) => {
        resetQuantities[size.name] = 0;
      });

      setFormData({ ...initialFormData, quantities: resetQuantities });
      setImageFile(null);
      setUploadedImage(null);
    } catch (error) {
      console.error("Order error:", error);
      setMessage(error.response?.data?.message || "Error placing order.");
      if (
        error.response?.status === 401 ||
        String(error.response?.data?.message || "").toLowerCase().includes("invalid signature")
      ) {
        localStorage.removeItem("token");
      }
    }
  };

  const renderCheckboxGroup = (label, name, options) => (
    <div>
      <h4 className="font-medium mt-4">{label}</h4>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-1">
            <input type="checkbox" name={name} value={option} checked={formData[name].includes(option)} onChange={handleChange} />
            {option}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex justify-center items-center px-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full relative overflow-y-auto max-h-[90vh] text-white">
        <button onClick={onClose} className="absolute top-2 right-3 text-gray-400 text-3xl hover:text-black" aria-label="Close">
          &times;
        </button>
        <h2 className="text-2xl text-center font-semibold mb-4">Place Your T-Shirt Order</h2>
        {message && <p className="mb-4 text-green-400">{message}</p>}

        <form onSubmit={handleSubmit}>
          <div className="flex gap-8">
            <div className="flex-1 space-y-4">
              <input type="text" name="customerName" placeholder="Customer Name" value={formData.customerName} onChange={handleChange} className="w-full bg-white text-black border border-gray-600 rounded px-3 py-2" required />
              <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="w-full bg-white text-black border border-gray-600 rounded px-3 py-2" required />
              <input type="text" name="telephone" placeholder="Telephone" value={formData.telephone} onChange={handleChange} className="w-full bg-white text-black border border-gray-600 rounded px-3 py-2" pattern="[0-9]{10}" required />
              <input type="text" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} className="w-full bg-white text-black border border-gray-600 rounded px-3 py-2" required />

              <select name="material" value={formData.material} onChange={handleChange} className="w-full bg-white text-black border border-gray-600 rounded px-3 py-2" required>
                <option value="">Select Material</option>
                {materials.map((mat) => (
                  <option key={mat._id} value={mat.name}>
                    {mat.name}
                  </option>
                ))}
              </select>

              <select name="printingType" value={formData.printingType} onChange={handleChange} className="w-full bg-white text-black border border-gray-600 rounded px-3 py-2" required>
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
                  <div key={size._id} className="flex items-center space-x-3 mb-2">
                    <label className="w-20">{size.name}</label>
                    <input type="number" name={`size-${size.name}`} value={formData.quantities[size.name] === 0 ? "" : formData.quantities[size.name]} onChange={handleChange} min="0" className="bg-white text-black border border-gray-600 rounded px-3 py-1 w-full" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 min-h-full">
              {renderCheckboxGroup("Collars", "collars", multiOptions.collars)}
              {renderCheckboxGroup("Piping", "piping", multiOptions.piping)}
              {renderCheckboxGroup("Finishing", "finishing", multiOptions.finishing)}
              {renderCheckboxGroup("Label", "label", multiOptions.label)}
              {renderCheckboxGroup("Outlines", "outlines", multiOptions.outlines)}
              {renderCheckboxGroup("Sleeve", "sleeve", multiOptions.sleeve)}

              <div>
                <input type="text" name="buttonCount" value={formData.buttons.count} onChange={handleChange} className="w-full bg-white text-black border border-gray-600 rounded px-3 py-2" placeholder="Enter number of buttons" />
              </div>

              <div>
                <select name="buttonColour" value={formData.buttons.colour} onChange={handleChange} className="w-full bg-white text-black border border-gray-600 rounded px-3 py-2">
                  <option value="">Select Button Colour</option>
                  {colors.map((color) => (
                    <option key={color._id} value={color.name}>
                      {color.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image selection only - upload will happen on form submit */}
              <div className="border border-dashed border-gray-600 rounded p-3 mt-2 bg-gray-900">
                <label className="block mb-2">T-Shirt Image (optional)</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {imageFile && !uploadedImage && <p className="text-sm text-gray-300 mt-2">{imageFile.name}</p>}
                {uploadedImage?.url && (
                  <div className="mt-3">
                    <img src={uploadedImage.url} alt="preview" className="w-40 h-40 object-contain rounded border" />
                    <div className="flex gap-2 mt-2">
                      <button type="button" onClick={() => { setImageFile(null); setUploadedImage(null); }} className="bg-red-600 px-2 py-1 rounded">
                        Remove
                      </button>
                    </div>
                  </div>
                )}
                {uploadingImage && <p className="text-yellow-300 mt-2">Uploading image...</p>}
              </div>
            </div>
          </div>

          <button type="submit" className="bg-black hover:bg-black/40 transition-colors text-white w-full py-3 rounded font-semibold mt-4">
            Submit Order
          </button>
        </form>
      </div>
    </div>
  );
}
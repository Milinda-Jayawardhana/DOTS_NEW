import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import Footer from "../Components/Footer";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    serviceType: "",
    comment: "",
  });

  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(""); // Success or error message

  const options = [
    { value: "est", label: "As a customer" },
    { value: "cst", label: "As an employer" },
    { value: "mst", label: "Become a new employer" },
    { value: "bst", label: "Become a third-party investor" },
    { value: "ast", label: "None" },
  ];

  const handleSelect = (value) => {
    setFormData({ ...formData, serviceType: value });
    setIsOpen(false);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    try {
      const res = await fetch("http://localhost:3000/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("Contact submitted successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          contactNumber: "",
          serviceType: "",
          comment: "",
        });
      } else {
        setStatus(data.message || "Something went wrong.");
      }
    } catch (err) {
      setStatus("Failed to submit contact.");
    }
  };

  const info = [
    { icon: <FaMapMarkerAlt />, title: "Location", value: "Boralegamuwa, Colombo" },
    { icon: <FaPhoneAlt />, title: "Phone", value: "+94 71 550 8827" },
    { icon: <FaEnvelope />, title: "Email", value: "dotsshirt@gmail.com" },
  ];

  return (
    <div className="py-6 text-white">
      <div className="container py-5 pb-10 mx-auto">
        <div className="flex flex-col lg:flex-row gap-[20px] px-20 lg:px-40">
          {/* Contact Form */}
          <div className="lg:w-[54%] order-2 lg:order-none justify-center">
            <form
              className="flex flex-col gap-6 p-10 bg-gray-800 border border-b-0 border-white/50 rounded-xl"
              onSubmit={handleSubmit}
            >
              <h3 className="text-4xl font-bold text-white">Contact Us</h3>
              <p className="text-white">Send us a message or inquiry below.</p>

              {/* Input Fields */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="p-2 border border-transparent rounded-md bg-gray-900/70 hover:border-white"
                  
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="p-2 border border-transparent rounded-md bg-gray-900/70 hover:border-white"
   
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="p-2 border border-transparent rounded-md bg-gray-900/70 hover:border-white"

                />
                <input
                  type="tel"
                  name="contactNumber"
                  placeholder="Mobile number"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="p-2 border border-transparent rounded-md bg-gray-900/70 hover:border-white"

                />
              </div>

              {/* Custom Select Dropdown */}
              <div className="relative w-full">
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center justify-between w-full px-2 py-2 text-left border-transparent rounded-md text-white/60 bg-gray-900/70"
                >
                  <span>
                    {formData.serviceType
                      ? options.find((opt) => opt.value === formData.serviceType)?.label
                      : "Select a Service"}
                  </span>
                  <FiChevronDown
                    className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-b-0 rounded-md shadow-lg border-white/50">
                    {options.map((option) => (
                      <div
                        key={option.value}
                        className="px-4 py-2 cursor-pointer hover:bg-white/10"
                        onClick={() => handleSelect(option.value)}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Message Box */}
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                className="h-32 p-2 border border-transparent rounded-md bg-gray-900/70 hover:border-white"
                placeholder="Send your comments for me..."
              ></textarea>

              {/* Submit Button */}
              <button
                type="submit"
                className="p-2 font-bold text-white bg-black border border-transparent hover:border-white max-w-40 rounded-xl"
              >
                Submit
              </button>

              {/* Status Message */}
              {status && <p className="text-green-400">{status}</p>}
            </form>
          </div>

          {/* Contact Info Section */}
          <div className="flex items-center justify-start flex-1 order-1 pb-8 mb-8 lg:justify-end lg:order-none md:mb-0">
            <ul className="flex flex-col justify-center gap-10 text-white">
              {info.map((item, index) => (
                <li key={index} className="flex items-center gap-6">
                  <div className="w-[52px] h-[52px] md:w-[72px] md:h-[72px] border border-b-0 border-white bg-gray-800  rounded-md flex items-center justify-center">
                    <div className="text-3xl">{item.icon}</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white/60">{item.title}</h3>
                    <p className="text-xl">{item.value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

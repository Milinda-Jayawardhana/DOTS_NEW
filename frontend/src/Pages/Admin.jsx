import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import GetAllContacts from "../Components/GetAllContacts";
import AddStatForm from "../Components/AddStatForm";
import Footer from "../Components/Footer";

export default function AdminPage() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

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

  return (
    <div className="p-6">
      {/* 👇 Conditionally show Add Items button for admin */}
      {role === "admin" && (
        <div className="flex gap-4 mb-6 justify-center">
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            onClick={() => navigate("/admin/add-items")}
          >
            Add Items
          </button>

          <button
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            onClick={() => navigate("/admin/orders")}
          >
            Orders
          </button>

          <button
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            onClick={() => navigate("/admin/comments")}
          >
            Comments
          </button>
        </div>
        
      )}

      
      
      <Footer></Footer>
    </div>
  );
}

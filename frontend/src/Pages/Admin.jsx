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
      <div className="flex items-center justify-center mb-10">
        
        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white tracking-tight">
          Admin Page
        </h1>
        <span className="ml-3 text-lg text-yellow-400 font-bold animate-bounce">
          Power Up!
        </span>
      </div>
      {/* 👇 Conditionally show Add Items button for admin */}
      {role === "admin" && (
        <div className="flex flex-col md:flex-row gap-6 mb-10 justify-center">
          {/* Add Items Box */}
          <div className="bg-gray-800 rounded-lg shadow p-6 flex-1 min-w-[280px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Add Your Items</h3>
              <button
                className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition"
                onClick={() => navigate("/admin/add-items")}
              >
                Add Items
              </button>
            </div>
            <ul className="list-disc ml-5 text-gray-200 space-y-2">
              <li>Add T-shirt colour</li>
              <li>Add T-shirt size</li>
              <li>Add T-shirt materials</li>
              <li>Add T-shirt types</li>
              <li>Add T-shirt order counts</li>
              <li>Add Home page counts</li>
            </ul>
          </div>

          {/* Orders Box */}
          <div className="bg-gray-800 rounded-lg shadow p-6 flex-1 min-w-[280px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Manage Orders</h3>
              <button
                className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition"
                onClick={() => navigate("/admin/orders")}
              >
                Orders
              </button>
            </div>
            <ul className="list-disc ml-5 text-gray-200 space-y-2">
              <li>View all orders</li>
              <li>Update order status</li>
              <li>Delete orders</li>
              <li>See order details</li>
              <li>Export orders</li>
            </ul>
          </div>

          {/* Comments Box */}
          <div className="bg-gray-800 rounded-lg shadow p-6 flex-1 min-w-[280px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Comments</h3>
              <button
                className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition"
                onClick={() => navigate("/admin/comments")}
              >
                Comments
              </button>
            </div>
            <ul className="list-disc ml-5 text-gray-200 space-y-2">
              <li>View customer comments</li>
              <li>Delete inappropriate comments</li>
              <li>Manage feedback</li>
            </ul>
          </div>
        </div>
      )}

      <Footer></Footer>
    </div>
  );
}

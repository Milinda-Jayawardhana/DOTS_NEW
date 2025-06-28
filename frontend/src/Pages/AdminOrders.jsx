import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../Components/Footer";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // inside AdminOrders component
const handleStatusChange = async (orderId, newStatus) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `http://localhost:3000/api/order/${orderId}/status`,
      { orderStatus: newStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, orderStatus: newStatus }
            : order
        )
      );
    } else {
      alert("Failed to update order status");
    }
  } catch (error) {
    console.error("Status update failed:", error);
    alert("Error updating status");
  }
};


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/order", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setOrders(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">All Orders</h1>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="flex items-center justify-between gap-4 border border-gray-300 rounded-lg p-4 shadow-md cursor-pointer  transition"
            >
              {/* Order Info Column */}
              <div
                className="flex gap-5 items-center"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex justify-between gap-7 items-center">
                  <div
                    className="w-16 h-16 rounded bg-red-500 flex-shrink-0"
                    title="T-Shirt"
                  ></div>
                  <p className="text-lg font-semibold">
                    Order ID: {order.orderId || order._id}
                  </p>
                  <p>
                    <strong>Customer Name:</strong> {order.customerName}
                  </p>
                  <p>
                    <strong>Material:</strong> {order.tshirtDetails.material}
                  </p>
                  <p>
                    <strong>Total Count:</strong> {order.tshirtDetails.quantity}
                  </p>
                </div>
              </div>

              {/* Dropdown for order status */}
              <div className="flex items-center gap-2 text-white">
                <label
                  htmlFor={`status-${order._id}`}
                  className="text-sm font-medium"
                >
                  Status:
                </label>
                <select
                  id={`status-${order._id}`}
                  className="px-2 py-1 rounded text-black"
                  defaultValue={order.orderStatus || "Pending"}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Ready">Ready</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Order Details */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative text-black"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
            >
              ✖
            </button>

            <h2 className="text-xl font-bold mb-3">
              Order ID: {selectedOrder.orderId || selectedOrder._id}
            </h2>
            <p>
              <strong>Customer:</strong> {selectedOrder.customerName}
            </p>
            <p>
              <strong>Email:</strong> {selectedOrder.userEmail}
            </p>
            <p>
              <strong>Phone:</strong> {selectedOrder.telephone}
            </p>
            <p>
              <strong>Address:</strong> {selectedOrder.address}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.orderStatus}
            </p>

            <div className="mt-3">
              <p className="font-semibold">T-Shirt Details:</p>
              <ul className="list-disc ml-5 text-sm mt-1 space-y-1">
                <li>Material: {selectedOrder.tshirtDetails.material}</li>
                <li>
                  Printing Type: {selectedOrder.tshirtDetails.printingType}
                </li>
                <li>Total Quantity: {selectedOrder.tshirtDetails.quantity}</li>
                <li>
                  Sizes:
                  <ul className="ml-4 list-disc">
                    {selectedOrder.tshirtDetails.quantities.map((q, index) => (
                      <li key={index}>
                        {q.size}: {q.count}
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  Buttons: {selectedOrder.tshirtDetails.buttons.count} (
                  {selectedOrder.tshirtDetails.buttons.colour})
                </li>
                <li>
                  Collars:{" "}
                  {selectedOrder.tshirtDetails.collars?.join(", ") || "None"}
                </li>
                <li>
                  Piping:{" "}
                  {selectedOrder.tshirtDetails.piping?.join(", ") || "None"}
                </li>
                <li>
                  Finishing:{" "}
                  {selectedOrder.tshirtDetails.finishing?.join(", ") || "None"}
                </li>
                <li>
                  Label:{" "}
                  {selectedOrder.tshirtDetails.label?.join(", ") || "None"}
                </li>
                <li>
                  Outlines:{" "}
                  {selectedOrder.tshirtDetails.outlines?.join(", ") || "None"}
                </li>
                <li>
                  Sleeve:{" "}
                  {selectedOrder.tshirtDetails.sleeve?.join(", ") || "None"}
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

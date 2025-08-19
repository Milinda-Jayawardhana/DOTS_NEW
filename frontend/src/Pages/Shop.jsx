import { useState } from "react";
import { ColourfulTextDemo } from "../Ui/ColourfullWord/ColourfulTextDemo";
import Tcount from "../Components/Tcont";
import Tmaterial from "../Components/Tmaterial";
import Tsizes from "../Components/Tsizes";
import Tcolours from "../Components/Tcolours";
import Ttype from "../Components/Ttype";
import Footer from "../Components/Footer";
import PreOrder from "../Components/PreOrder";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import PreOrderUpdate from "../Components/PreOrderUpdate";

export default function Shop() {
  const [popup, setPopup] = useState(null);
  const [selectedCount, setSelectedCount] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedColours, setSelectedColours] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState(null);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/my-orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setOrders(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch your orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, []);

  const handlePopupOpen = (popupNumber) => {
    setPopup(popupNumber);
  };

  const handlePopupClose = () => {
    setPopup(null);
  };

  const calculateTotalPrice = () => {
    let total = 0;
    if (selectedCount) total += selectedCount.price || 0;
    if (selectedMaterial) total += selectedMaterial.price || 0;
    if (selectedType) total += selectedType.price || 0;
    selectedColours.forEach((c) => (total += c.price || 0));
    return total;
  };

  const averageCost = calculateTotalPrice();

  const SelectionBox = ({ label, imgSrc, onClick }) => (
    <div className="w-[150px] h-[160px] bg-gray-700 rounded-lg flex flex-col items-center relative group">
      <div
        className="relative w-[150px] h-[150px] bg-white/30 rounded-lg shadow-2xl flex justify-center items-center cursor-pointer overflow-visible"
        onClick={onClick}
      >
        <img
          src={imgSrc}
          alt={label}
          className="w-[80%] transition-transform group-hover:scale-110 group-hover:z-30 duration-300"
          style={{ zIndex: 1 }}
        />
      </div>
      <div className="h-[22px] mt-1 text-white">{label}</div>
    </div>
  );

  return (
    <div>
      <div className="container py-10 mx-auto px-4">
        <div className="flex flex-col gap-10">
          <div className="">
            <ColourfulTextDemo />
          </div>

          {/* Selection Grid */}

          <div className="grid gap-6 justify-items-center grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            <SelectionBox
              label="Count"
              imgSrc="/s3.png"
              onClick={() => handlePopupOpen(1)}
            />
            <SelectionBox
              label="Type"
              imgSrc="/s5.png"
              onClick={() => handlePopupOpen(5)}
            />
            <SelectionBox
              label="Material"
              imgSrc="/s2.png"
              onClick={() => handlePopupOpen(2)}
            />
            <SelectionBox
              label="Colours"
              imgSrc="/s1.png"
              onClick={() => handlePopupOpen(3)}
            />
            <SelectionBox
              label="Sizes"
              imgSrc="/s4.png"
              onClick={() => handlePopupOpen(4)}
            />
          </div>

          <div className="mt-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 rounded-2xl shadow-xl p-6 border border-gray-700 backdrop-blur-md flex flex-col lg:flex-row justify-between gap-20 items-stretch">
            {/* Left Side - Selected Items */}
            <div className="flex-1 min-w-0 flex flex-col h-full">
              <h3 className="text-2xl font-bold text-blue-400 flex items-center gap-2 mb-4">
                <span className="text-3xl">🛒</span> Selected Items
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5 ">
                {/* Count */}
                <div className="bg-gray-900 rounded-lg px-4 py-2 flex items-center gap-2 shadow hover:shadow-lg transition flex-1">
                  <span className="font-semibold text-white">Count:</span>
                  <span
                    className={`text-blue-300 ${
                      !selectedCount && "italic opacity-60"
                    }`}
                  >
                    {selectedCount ? selectedCount.name : "Select..."}
                  </span>
                </div>

                {/* Material */}
                <div className="bg-gray-900 rounded-lg px-4 py-2 flex items-center gap-2 shadow hover:shadow-lg transition flex-1">
                  <span className="font-semibold text-white">Material:</span>
                  <span
                    className={`text-blue-300 ${
                      !selectedMaterial && "italic opacity-60"
                    }`}
                  >
                    {selectedMaterial ? selectedMaterial.name : "Select..."}
                  </span>
                </div>

                {/* Type + Colours */}
                <div className="col-span-1 sm:col-span-2 flex flex-col lg:flex-row gap-3">
                  <div className="flex-1 bg-gray-900 rounded-lg px-4 py-2 flex items-center gap-2 shadow hover:shadow-lg transition">
                    <span className="font-semibold text-white">Type:</span>
                    <span
                      className={`text-blue-300 ${
                        !selectedType && "italic opacity-60"
                      }`}
                    >
                      {selectedType ? selectedType.name : "Select..."}
                    </span>
                  </div>
                  <div className="flex-1 bg-gray-900 rounded-lg px-4 py-2 flex items-center gap-2 shadow hover:shadow-lg transition">
                    <span className="font-semibold text-white">Colours:</span>
                    <span
                      className={`text-blue-300 ${
                        selectedColours.length === 0 && "italic opacity-60"
                      }`}
                    >
                      {selectedColours.length > 0
                        ? selectedColours.map((c) => c.name).join(", ")
                        : "Select..."}
                    </span>
                  </div>
                </div>

                {/* Sizes */}
                <div className="col-span-1 sm:col-span-2 bg-gray-900 rounded-lg px-4 py-2 flex items-center gap-2 shadow hover:shadow-lg transition">
                  <span className="font-semibold text-white">Sizes:</span>
                  <span
                    className={`text-blue-300 ${
                      selectedSizes.length === 0 && "italic opacity-60"
                    }`}
                  >
                    {selectedSizes.length > 0
                      ? selectedSizes.map((s) => s.name).join(", ")
                      : "Select..."}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side - Cost & Reset */}
            <div className="flex flex-col items-center justify-between gap-4 h-full lg:w-80 w-full">
              <div className="flex flex-col items-center justify-center bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-xl shadow-lg px-6 py-5 relative overflow-hidden lg:w-80 w-full">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-transparent to-red-400/20 animate-pulse"></div>

                <h2 className="text-3xl font-extrabold text-white drop-shadow-md flex items-center gap-3 z-10">
                  <span className="text-4xl">💰</span>
                  <span>
                    Rs{" "}
                    <span className="bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                      {averageCost.toFixed(2)}
                    </span>
                  </span>
                </h2>
                <p className="text-sm text-yellow-100 mt-1 z-10">
                  Average Cost
                </p>

                <button
                  className="mt-4 flex items-center gap-2 text-white hover:text-red-100 bg-red-700 hover:bg-red-600 transition px-5 py-2 rounded-lg font-semibold shadow-lg z-10"
                  onClick={() => {
                    setSelectedCount(null);
                    setSelectedMaterial(null);
                    setSelectedColours([]);
                    setSelectedSizes([]);
                    setSelectedType(null);
                  }}
                >
                  <span className="text-xl">🔄</span> Reset
                </button>
              </div>
              <div className="flex items-center justify-center mt-6">
                <button
                  onClick={() => {
                    const token = localStorage.getItem("token");
                    if (token) {
                      setShowModal(true);
                    } else {
                      navigate("/login");
                    }
                  }}
                  className="relative bg-gradient-to-r from-green-500 via-emerald-400 to-teal-500 
               text-white font-bold text-lg px-12 py-3 rounded-full shadow-lg 
               overflow-hidden transition-all duration-300 
               hover:scale-105 hover:shadow-2xl hover:from-green-400 hover:to-teal-400"
                >
                  {/* Glow Layer */}
                  <span className="absolute inset-0 rounded-full border-2 border-white/40 animate-pulse"></span>

                  {/* Icon + Text */}
                  <span className="relative flex items-center gap-2">
                    🚀 Place an Order
                  </span>
                </button>
              </div>
            </div>
          </div>

          {showModal && <PreOrder onClose={() => setShowModal(false)} />}
        </div>

        {token && (
          <div className="px-6 py-8">
            <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

            {loading ? (
              <p>Loading your orders...</p>
            ) : orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <div className="grid gap-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="flex bg-gray-800 lg:text-[18px] items-center justify-between border border-gray-300 rounded-lg shadow-sm  hover:shadow-md transition"
                  >
                    <div
                      className="flex  flex-col md:flex-row md:items-center gap-4 p-4 cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div
                        className="w-16 h-16 rounded bg-red-500 flex-shrink-0"
                        title="T-Shirt"
                      ></div>
                      <p>
                        <strong>Order ID:</strong> {order.orderId}
                      </p>
                      <p>
                        <strong>Name:</strong> {order.customerName}
                      </p>
                      <p>
                        <strong>Material:</strong>{" "}
                        {order.tshirtDetails?.material}
                      </p>
                      <p>
                        <strong>Total Count:</strong>{" "}
                        {order.tshirtDetails?.quantity}
                      </p>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-3 p-4">
                      <p>
                        <strong>Status:</strong>{" "}
                        <span className="text-red-800 p-1 px-2 bg-white rounded-md font-semibold">
                          {order.orderStatus}
                        </span>
                      </p>
                      {order.orderStatus === "Confirmed" && (
                        <button className="bg-green-500 font-semibold text-white py-2 px-4 rounded">
                          Do your Advanced Payments
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedOrder && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={() => setSelectedOrder(null)}
          >
            <div
              className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative text-white"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-1 text-sm">
                  {/* Column 1 */}
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Material: {selectedOrder.tshirtDetails.material}</li>
                    <li>
                      Printing Type: {selectedOrder.tshirtDetails.printingType}
                    </li>
                    <li>
                      Total Quantity: {selectedOrder.tshirtDetails.quantity}
                    </li>
                    <li>
                      Sizes:
                      <ul className="ml-4 list-disc">
                        {selectedOrder.tshirtDetails.quantities.map(
                          (q, index) => (
                            <li key={index}>
                              {q.size}: {q.count}
                            </li>
                          )
                        )}
                      </ul>
                    </li>
                  </ul>

                  {/* Column 2 */}
                  <ul className="list-disc ml-5 space-y-1">
                    <li>
                      Buttons: {selectedOrder.tshirtDetails.buttons.count} (
                      {selectedOrder.tshirtDetails.buttons.colour})
                    </li>
                    <li>
                      Collars:{" "}
                      {selectedOrder.tshirtDetails.collars?.join(", ") ||
                        "None"}
                    </li>
                    <li>
                      Piping:{" "}
                      {selectedOrder.tshirtDetails.piping?.join(", ") || "None"}
                    </li>
                    <li>
                      Finishing:{" "}
                      {selectedOrder.tshirtDetails.finishing?.join(", ") ||
                        "None"}
                    </li>
                    <li>
                      Label:{" "}
                      {selectedOrder.tshirtDetails.label?.join(", ") || "None"}
                    </li>
                    <li>
                      Outlines:{" "}
                      {selectedOrder.tshirtDetails.outlines?.join(", ") ||
                        "None"}
                    </li>
                    <li>
                      Sleeve:{" "}
                      {selectedOrder.tshirtDetails.sleeve?.join(", ") || "None"}
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}

              <div className="flex justify-end gap-4 mt-6">
                {selectedOrder.orderStatus === "Pending" && (
                  <>
                    <button
                      onClick={() => {
                        setOrderToEdit(selectedOrder);
                        setSelectedOrder(null);
                        setShowUpdateModal(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                    >
                      Update Order
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          const confirm = window.confirm(
                            "Are you sure you want to delete this order?"
                          );
                          if (!confirm) return;

                          await axios.delete(
                            `${import.meta.env.VITE_API_URL}/api/order/${selectedOrder._id}`,
                            {
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            }
                          );
                          alert("Order deleted successfully.");
                          setOrders((prev) =>
                            prev.filter(
                              (order) => order._id !== selectedOrder._id
                            )
                          );
                          setSelectedOrder(null);
                        } catch (err) {
                          alert("Failed to delete order.");
                          console.error(err);
                        }
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                    >
                      Delete Order
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {showUpdateModal && orderToEdit && (
          <PreOrderUpdate
            orderData={orderToEdit}
            onClose={() => {
              setShowUpdateModal(false);
              setOrderToEdit(null);
            }}
          />
        )}

        {/* Popups */}
        {popup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center h-screen bg-opacity-50 backdrop-blur-lg">
            {popup === 1 && (
              <Tcount
                onClose={handlePopupClose}
                onSelectCount={setSelectedCount}
              />
            )}
            {popup === 2 && (
              <Tmaterial
                onClose={handlePopupClose}
                onSelectMaterial={setSelectedMaterial}
              />
            )}
            {popup === 3 && (
              <Tcolours
                onClose={handlePopupClose}
                onSelectColours={setSelectedColours}
              />
            )}
            {popup === 4 && (
              <Tsizes
                onClose={handlePopupClose}
                onSelectSizes={setSelectedSizes}
              />
            )}
            {popup === 5 && (
              <Ttype
                onClose={handlePopupClose}
                onSelectType={setSelectedType}
              />
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

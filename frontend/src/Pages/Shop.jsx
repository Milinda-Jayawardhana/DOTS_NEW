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
          "http://localhost:3000/api/my-orders",
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
    <div className="w-[150px] h-[160px] bg-gray-700 rounded-lg flex flex-col items-center">
      <div
        className="relative w-[150px] h-[150px] bg-white rounded-lg shadow-2xl flex justify-center items-center cursor-pointer"
        onClick={onClick}
      >
        <img src={imgSrc} alt={label} className="w-[80%]" />
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

          {/* Selected Items Summary */}
          <div className="p-5 mt-5 text-white bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold">Selected Items:</h3>
            {selectedCount && <p>Count: {selectedCount.name}</p>}
            {selectedMaterial && <p>Material: {selectedMaterial.name}</p>}
            {selectedType && <p>Type: {selectedType.name}</p>}
            {selectedColours.length > 0 && (
              <p>Colours: {selectedColours.map((c) => c.name).join(", ")}</p>
            )}
            {selectedSizes.length > 0 && (
              <p>Sizes: {selectedSizes.map((s) => s.name).join(", ")}</p>
            )}
          </div>

          {/* Cost Display */}
          <div className="flex flex-col items-start justify-between gap-3 text-xl sm:flex-row">
            <h2>Average Cost: Rs{averageCost.toFixed(2)}</h2>
            <button
              className="text-red-500"
              onClick={() => {
                setSelectedCount(null);
                setSelectedMaterial(null);
                setSelectedColours([]);
                setSelectedSizes([]);
                setSelectedType(null);
              }}
            >
              Reset
            </button>
          </div>
          <div className="flex items-center justify-center mt-5">
            <button
              onClick={() => {
                const token = localStorage.getItem("token");
                if (token) {
                  setShowModal(true);
                } else {
                  navigate("/login");
                }
              }}
              className="bg-gray-500 text-white py-2 px-10 rounded"
            >
              Place an Order
            </button>
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
                    className="flex items-center justify-between border border-gray-300 rounded-lg shadow-sm  hover:shadow-md transition"
                    
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 cursor-pointer" onClick={() => setSelectedOrder(order)}>
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
                        <span className="text-blue-600">
                          {order.orderStatus}
                        </span>
                      </p>
                      {order.orderStatus === "Confirmed" && (
                      <button className="bg-green-500 text-white py-2 px-4 rounded">
                        Do your Advanced Payments
                      </button>)}
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
                    {selectedOrder.tshirtDetails.finishing?.join(", ") ||
                      "None"}
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
                            `http://localhost:3000/api/order/${selectedOrder._id}`,
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

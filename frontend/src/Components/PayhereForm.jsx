import { useEffect } from "react";

export default function PayHereForm({ amount, name, contact, orderId, onPaymentSuccess, onError }) {
  useEffect(() => {
    // Load PayHere script
    if (!window.payhere) {
      const script = document.createElement("script");
      script.src = "https://www.payhere.lk/lib/payhere.js";
      script.async = true;
      document.body.appendChild(script);
    }
    // Set up PayHere event
    window.payhere && (window.payhere.onCompleted = function (orderId) {
      onPaymentSuccess && onPaymentSuccess(orderId);
    });
    return () => {
      window.payhere && (window.payhere.onCompleted = null);
    };
  }, [onPaymentSuccess]);

  const handlePayNow = () => {
    if (!window.payhere) {
      alert("Payment gateway not loaded yet. Please wait.");
      return;
    }
    const payment = {
      sandbox: true,
      merchant_id: import.meta.env.VITE_PAYHERE_MERCHANT_ID || "1230061", // Replace with your merchant id
      return_url: window.location.href,
      cancel_url: window.location.href,
      notify_url: `${import.meta.env.VITE_API_URL}/api/payment/notify`,
      order_id: orderId,
      items: "T-Shirt Advanced Payment",
      amount: amount.toString(),
      currency: "LKR",
      first_name: name || "Customer",
      last_name: "",
      email: "test@email.com",
      phone: contact || "0000000000",
      address: "No.1, Main Street",
      city: "Colombo",
      country: "Sri Lanka",
    };
    window.payhere.startPayment(payment);
  };

  return (
    <button
      onClick={handlePayNow}
      className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 mt-2"
    >
      Pay Advance (Rs {amount})
    </button>
  );
}
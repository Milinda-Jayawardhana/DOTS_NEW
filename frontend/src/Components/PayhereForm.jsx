import { useEffect } from "react";
import md5 from "crypto-js/md5";
import axios from "axios";

export default function PayHereForm({
  amount,
  name,
  contact,
  orderId,
  onPaymentSuccess,
  onError,
}) {
  useEffect(() => {
    // Load PayHere script dynamically
    if (!window.payhere) {
      const script = document.createElement("script");
      script.src = "https://www.payhere.lk/lib/payhere.js";
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => {
        attachHandlers();
      };
    } else {
      attachHandlers();
    }

    function attachHandlers() {
      // PayHere will call onCompleted(payload) with order id in sandbox; adapt below
      window.payhere.onCompleted = async function (returned) {
        // returned may be an orderId string or an object depending on SDK usage
        const returnedPayload = returned || {};
        const txnId = (returnedPayload?.payment_id || returnedPayload || "").toString();

        const paymentInfo = {
          provider: "payhere",
          transactionId: txnId,
          amount: Number(amount) || 0,
          paidAt: new Date().toISOString(),
          raw: returnedPayload || null,
        };

        try {
          // notify backend to mark advanced payment
          const apiBase = import.meta.env.VITE_API_URL || window.location.origin;
          const token = localStorage.getItem("token");
          const url = `${apiBase.replace(/\/$/, "")}/api/order/${orderId}/advanced`;

          await axios.put(
            url,
            { paymentInfo },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          onPaymentSuccess && onPaymentSuccess(paymentInfo);
        } catch (err) {
          console.error("Failed to notify backend about advanced payment:", err?.response?.data || err.message);
          onError && onError(err);
        }
      };

      window.payhere.onDismissed = function () {
        console.log("Payment dismissed");
      };
      window.payhere.onError = function (error) {
        console.error("PayHere Error:", error);
        onError && onError(error);
      };
    }

    return () => {
      if (window.payhere) {
        window.payhere.onCompleted = null;
        window.payhere.onDismissed = null;
        window.payhere.onError = null;
      }
    };
  }, [amount, name, contact, orderId, onPaymentSuccess, onError]);

  // ✅ Sandbox hash generator (frontend only)
  const generateHash = () => {
    const merchant_id = import.meta.env.VITE_PAYHERE_MERCHANT_ID || "1230061";
    const merchant_secret = import.meta.env.VITE_PAYHERE_MERCHANT_SECRET; // 🔹 for sandbox only
    const currency = "LKR";

    const formattedAmount = parseFloat(amount)
      .toLocaleString("en-US", { minimumFractionDigits: 2 })
      .replaceAll(",", ""); // e.g. "100.00"

    const hashedSecret = md5(merchant_secret).toString().toUpperCase();
    const raw = merchant_id + orderId + formattedAmount + currency + hashedSecret;

    return md5(raw).toString().toUpperCase();
  };

  const handlePayNow = () => {
    if (!window.payhere) {
      alert("Payment gateway not loaded yet. Please wait.");
      return;
    }

    const merchant_id = import.meta.env.VITE_PAYHERE_MERCHANT_ID || "1230061";

    const payment = {
      sandbox: true,
      merchant_id,
      return_url: `${import.meta.env.VITE_API_URL}/api/payment/return`,
      cancel_url: `${import.meta.env.VITE_API_URL}/api/payment/cancel`,
      notify_url: `${import.meta.env.VITE_API_URL}/api/payment/notify`,
      order_id: orderId,
      items: "T-Shirt Advanced Payment",
      amount: parseFloat(amount).toFixed(2),
      currency: "LKR",
      first_name: name || "Customer",
      last_name: "",
      email: "test@email.com",
      phone: contact || "0000000000",
      address: "No.1, Main Street",
      city: "Colombo",
      country: "Sri Lanka",
      hash: generateHash(),
    };

    console.log("Payment object:", payment); // Debugging
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
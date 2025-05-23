import { useEffect, useState } from "react";
import axios from "../api/axios";

const EventFeed = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const message="";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("/events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response);
        setEvents(response.data.events);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events.");
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleRegisterEvent = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      const price = 8300; // Fixed fee of ₹83 for event registration
console.log(eventId);
      // Create order for event registration
      const response = await axios.post(
       "/events/payment/create-order",
        { amount: price, type: "event", eventId:  eventId  },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { order_id, currency, amount } = response.data;

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: "rzp_test_Bnzmtr6yqG88vv",
          amount: amount,
          currency: currency,
          name: "StoryTeller",
          description: "Register for Event",
          order_id: order_id,
          handler: async (response) => {
            try {
              const verifyResponse = await axios.post(
               "/events/payment/verify-payment",
                {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );

              if (verifyResponse.data.success) {
                alert("Successfully registered for the event!");
              } else {
                alert("Payment verification failed.");
              }
            } catch (err) {
              console.error(err);
              alert("Payment verification failed.");
            }
          },
          prefill: {
            name: "Ankit Prasad",
            email: "ankprasad58@gmail.com",
            contact: "9589788215",
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };

      script.onerror = () => {
        alert("Failed to load Razorpay SDK.");
      };
    } catch (err) {
      console.error(err);
      alert("Error initiating payment.");
    }
  };

  if (loading) return <div>Loading events...</div>;
  if (error) return <div>{error}</div>;

 return (
  <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 p-6">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-8">
        EVENT FEED
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div 
            key={event._id}
            className="bg-gray-800/30 backdrop-blur-lg rounded-xl border border-cyan-400/20 p-6 shadow-2xl shadow-cyan-500/10 hover:border-cyan-400/40 transition-all"
          >
            <h3 className="text-xl font-bold text-cyan-400 mb-2">
              {event.name}
            </h3>
            
            <div className="space-y-2 mb-4">
              <p className="text-cyan-400/80 font-mono text-sm">
                <span className="text-cyan-400">DATE:</span>{" "}
                {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="text-cyan-400/80 font-mono text-sm">
                <span className="text-cyan-400">LOCATION:</span> {event.location}
              </p>
            </div>

            <p className="text-cyan-200 font-mono text-sm leading-relaxed mb-6">
              {event.description}
            </p>

            <button
              onClick={() => handleRegisterEvent(event._id)}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg hover:shadow-2xl hover:shadow-cyan-500/30"
            >
              <span className="font-bold text-gray-900 text-sm">
                REGISTER NOW
              </span>
            </button>
          </div>
        ))}
      </div>

      {message && (
        <div className={`mt-8 p-4 rounded-xl border ${
          message.includes("success") 
            ? "border-green-400/30 bg-green-400/10 text-green-400" 
            : "border-red-400/30 bg-red-400/10 text-red-400"
        }`}>
          <p className="font-mono text-sm">{message}</p>
        </div>
      )}
    </div>
  </div>
);
};
export default EventFeed;
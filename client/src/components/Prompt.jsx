import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";

const Prompt = () => {
  const [form, setForm] = useState({ text: "", genre: "formal" });
  const [transformedText, setTransformedText] = useState("");
  const [message, setMessage] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [creditsLeft, setCreditsLeft] = useState(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("/user/get-user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCreditsLeft(response.data.credits);
      } catch (error) {
        console.error("Error fetching user:", error);
        setMessage("Failed to fetch user data.");
      }
    }
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setTransformedText("");
    setAudioUrl("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/prompt/transform", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const text = response.data.transformedText;
      const credits = response.data.creditsLeft;

      setTransformedText(text);
      setCreditsLeft(credits);
      setMessage("Text transformed successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error transforming text.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAudio = async () => {
    setIsAudioLoading(true);
    setMessage("");
    setAudioUrl("");

    try {
      const elevenResponse = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/CwhRBWXzGAHq8TQ4Fs17?output_format=mp3_44100_128`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": "sk_9af6483498026fbd42f957e95f4296fea31bb825c8cf998a",
          },
          body: JSON.stringify({
            text: transformedText,
            model_id: "eleven_multilingual_v2",
          }),
        }
      );

      if (!elevenResponse.ok) {
        throw new Error("Failed to generate audio");
      }

      const audioBlob = await elevenResponse.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
      setMessage("Audio generated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error generating audio.");
    } finally {
      setIsAudioLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      const price = 8300;

      // Create Razorpay order
      const response = await axios.post(
        "/payment/create-order",
        { amount: price },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { order_id, currency, amount } = response.data;

      // Load Razorpay checkout script dynamically
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
          description: "Add 3 Credits",
          order_id: order_id,
          handler: async (response) => {
            try {
              // Verify payment
              const verifyResponse = await axios.post(
                "/payment/verify-payment",
                {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );

              if (verifyResponse.data.success) {
                // Update credits
                const updateResponse = await axios.post(
                  "/user/update-credits",
                  { credits: 3, amount: price },
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                setCreditsLeft(updateResponse.data.credits);
                setMessage("Payment successful! Credits added.");
                setIsPaymentDialogOpen(false);
              } else {
                setMessage("Payment verification failed.");
              }
            } catch (err) {
              console.error(err);
              setMessage("Payment verification failed.");
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
        setMessage("Failed to load Razorpay SDK.");
      };
    } catch (err) {
      console.error(err);
      setMessage("Error initiating payment.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Create a 100 words story in seconds
          </h2>
          <p className="text-gray-600 mt-2">
            Credits left: {creditsLeft !== null ? creditsLeft : "Loading..."}
          </p>
        </div>
        <Link
          to="/history"
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          View History
        </Link>
        <Link
          to="/dashboard"
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
         My Details
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="text"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Enter your story preference
          </label>
          <textarea
            id="text"
            name="text"
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Type or paste your text here..."
            value={form.text}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label
            htmlFor="genre"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Select transformation style
          </label>
          <select
            id="genre"
            name="genre"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={form.genre}
            onChange={handleChange}
          >
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
            <option value="horror">Horror</option>
            <option value="creative">Creative</option>
          </select>
        </div>

        {creditsLeft > 0 ? (
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              "Transform Text"
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsPaymentDialogOpen(true)}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Pay Now and Use for Just $1
          </button>
        )}
      </form>

      {isPaymentDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Pay ₹83 to Add 3 Credits
            </h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Click below to proceed with payment via Razorpay.
              </p>
              {message && (
                <div
                  className={`p-3 rounded-md ${
                    message.includes("Error") || message.includes("failed")
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsPaymentDialogOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePayment}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Pay ₹83
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {message && !isPaymentDialogOpen && (
        <div
          className={`mt-4 p-3 rounded-md ${
            message.includes("Error")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      {transformedText && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Transformed Text:
          </h3>
          <div className="p-3 bg-white border border-gray-200 rounded-md text-gray-800">
            <p className="whitespace-pre-line">{transformedText}</p>
          </div>
          <button
            onClick={handleGenerateAudio}
            disabled={isAudioLoading}
            className={`mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
              isAudioLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isAudioLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating Audio...
              </>
            ) : (
              "Generate Audio"
            )}
          </button>
        </div>
      )}

      {audioUrl && (
        <div className="mt-6">
          <h4 className="text-lg font-medium text-gray-800 mb-2">
            Audio Preview:
          </h4>
          <div className="flex items-center space-x-4">
            <audio controls src={audioUrl} className="w-full" />
            <a
              href={audioUrl}
              download="transformed-audio.mp3"
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Download
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prompt;
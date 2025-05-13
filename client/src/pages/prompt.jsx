import { useEffect, useState } from "react";
import axios from "../api/axios";
import { socket } from "../socket";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PromptForm from "../components/PromptForm";
import PaymentDialog from "../components/PaymentDialog";
import GeneratedStory from "../components/GeneratedStory";
import AudioPlayer from "../components/AudioPlayer";
import Navigation from "../components/navigation";

const Prompt = () => {
  const [form, setForm] = useState({ text: "", genre: "formal" });
  const [transformedText, setTransformedText] = useState("");
  // const transformedText = "i am the best in the qorkd ";
  const [message, setMessage] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [creditsLeft, setCreditsLeft] = useState(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isPosted, setIsPosted] = useState(false);
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    async function fetchUser() {
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
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    socket.emit("register-user", payload.userId);

    socket.on("transformation-started", ({ message }) => {
      toast.info(message);
    });

    socket.on(
      "transformation-complete",
      ({ message, transformedText, credits }) => {
        toast.success(message);
        setTransformedText(transformedText);
        setCreditsLeft(credits);
      }
    );

    socket.on("transformation-failed", ({ message }) => {
      toast.error(message);
    });

    return () => {
      socket.off("transformation-started");
      socket.off("transformation-complete");
      socket.off("transformation-failed");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    socket.emit("register-user", payload.userId);

    setTransformedText("");
    setCreditsLeft(null);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post("/prompt/transform", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.info(response.data.message);
    } catch (err) {
      console.error(err);
      toast.error("Error kicking off transformation.");
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
      const price = 8300;

      const response = await axios.post(
        "/payment/create-order",
        { amount: price },
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
          description: "Add 3 Credits",
          order_id: order_id,
          handler: async (response) => {
            try {
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

  const handlePostStory = async (storyText, files = []) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("storyText", storyText);
      files.forEach((file) => {
        formData.append("media", file);
      });

      const response = await axios.post("/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setIsPosted(true);
      setMessage("Story posted successfully!");
      return response.data;
    } catch (err) {
      console.error("Error posting story:", err);
      const errorMessage = err.response?.data?.error || "Error posting story.";
      setMessage(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 flex">
      <ToastContainer />
      <div className="max-w-6xl mx-auto space-y-8 card">
        {/* Credits Display */}
        <div className="flex justify-between items-center">
          <div>
            <p className="mt-2 text-cyan-100 font-mono">
              Credits: {creditsLeft !== null ? creditsLeft : "•••"}
            </p>
          </div>
          <div className="flex gap-4">
            {/* Add additional buttons here if needed */}
          </div>
        </div>

        {/* Form Section */}
        <PromptForm
          form={form}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          creditsLeft={creditsLeft}
          openPaymentDialog={() => setIsPaymentDialogOpen(true)}
        />

        {/* Payment Dialog */}
        <PaymentDialog
          isOpen={isPaymentDialogOpen}
          closeDialog={() => setIsPaymentDialogOpen(false)}
          handlePayment={handlePayment}
        />

        {/* Generated Story Section */}
        <GeneratedStory
          transformedText={transformedText}
          isPosted={isPosted}
          handlePostStory={handlePostStory}
          handleGenerateAudio={handleGenerateAudio}
          isAudioLoading={isAudioLoading}
          setMessage={setMessage} // Pass setMessage for error handling
        />

        {/* Audio Player Section */}
        <AudioPlayer audioUrl={audioUrl} />
      </div>
    </div>
  );
};

export default Prompt;

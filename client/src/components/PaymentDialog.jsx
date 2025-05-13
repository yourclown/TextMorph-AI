import React from "react";

const PaymentDialog = ({ isOpen, closeDialog, handlePayment }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-cyan-400/20 p-8 w-full max-w-lg shadow-2xl shadow-cyan-500/20">
        <h3 className="text-2xl font-bold text-cyan-400 mb-6">
          CREDIT RECHARGE
        </h3>
        <div className="space-y-6">
          <p className="text-cyan-200/80 leading-relaxed">
            Initiate payment protocol to acquire 3 generation credits.
            <br />
            <span className="text-sm text-cyan-400/60">
              Secure transaction via Razorpay interface
            </span>
          </p>
          
          <div className="flex justify-end gap-4">
            <button
              onClick={closeDialog}
              className="px-6 py-3 border border-cyan-400/30 rounded-lg text-cyan-400 hover:bg-cyan-400/10 transition-all"
            >
              ABORT
            </button>
            <button
              onClick={handlePayment}
              className="px-6 py-3 bg-cyan-400/10 border border-cyan-400/30 rounded-lg text-cyan-400 hover:bg-cyan-400/20 transition-all shadow-glow-cyan"
            >
              CONFIRM PAYMENT - ₹83
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDialog;
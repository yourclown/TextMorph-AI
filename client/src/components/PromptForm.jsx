import React from "react";

const PromptForm = ({ form, handleChange, handleSubmit, isLoading, creditsLeft, openPaymentDialog }) => {
  return (
    <div className="bg-black/30 backdrop-blur-lg rounded-xl border border-gray-700/50 p-8 shadow-2xl shadow-cyan-500/20">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Story Input */}
        <div className="space-y-4">
          <label className="text-lg font-semibold text-cyan-300">
            NARRATIVE PARAMETERS
          </label>
          <textarea
            id="text"
            name="text"
            rows={5}
            className="w-full bg-black/40 border-2 border-cyan-400/30 rounded-lg p-6 text-cyan-100 font-mono focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 transition-all placeholder-cyan-400/50"
            placeholder="INITIALIZE STORY PROMPT SEQUENCE..."
            value={form.text}
            onChange={handleChange}
            required
          />
        </div>

        {/* Genre Selector */}
        <div className="grid grid-cols-4 gap-6">
          {["formal", "casual", "horror", "creative"].map((genre) => (
            <label
              key={genre}
              className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${
                form.genre === genre
                  ? "border-cyan-400 bg-cyan-400/10 shadow-glow-cyan"
                  : "border-gray-700 hover:border-cyan-400/40"
              }`}
            >
              <input
                type="radio"
                name="genre"
                value={genre}
                checked={form.genre === genre}
                onChange={handleChange}
                className="hidden"
              />
              <span className="block text-center uppercase font-bold text-sm tracking-wider text-cyan-300">
                {genre}
              </span>
            </label>
          ))}
        </div>

        {/* Action Button */}
        {creditsLeft > 0 ? (
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            } shadow-lg hover:shadow-2xl hover:shadow-cyan-500/30`}
          >
            <span className="text-lg font-bold text-gray-900">
              {isLoading ? "GENERATING NARRATIVE..." : "INITIATE STORYGEN"}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={openPaymentDialog}
            className="w-full py-5 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 transition-all shadow-lg hover:shadow-2xl hover:shadow-red-500/30"
          >
            <span className="text-lg font-bold text-white">
              ACTIVATE CREDITS - $1
            </span>
          </button>
        )}
      </form>
    </div>
  );
};

export default PromptForm;
import React from "react";

const AudioPlayer = ({ audioUrl }) => {
  if (!audioUrl) return null;

  return (
    <div className="bg-black/30 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6">
      <h4 className="text-xl font-bold text-cyan-400 mb-4">
        AUDIO OUTPUT
      </h4>
      <div className="flex items-center gap-6">
        <audio controls className="w-full bg-black/40 rounded-lg">
          <source src={audioUrl} type="audio/mpeg" />
        </audio>
        <a
          href={audioUrl}
          download="transformed-audio.mp3"
          className="px-6 py-3 border border-cyan-400/30 rounded-lg text-cyan-400 hover:bg-cyan-400/10 transition-all"
        >
          DOWNLOAD
        </a>
      </div>
    </div>
  );
};

export default AudioPlayer;
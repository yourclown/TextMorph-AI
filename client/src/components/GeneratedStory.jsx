import React, { useState } from "react";

const GeneratedStory = ({
  transformedText,
  isPosted,
  handlePostStory,
  handleGenerateAudio,
  isAudioLoading,
  setMessage,
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  if (!transformedText) return null;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setMessage("Maximum 5 files allowed.");
      return;
    }
    setSelectedFiles(files);
  };

  const handlePostWithMedia = async () => {
    setIsUploading(true);
    try {
      await handlePostStory(transformedText, selectedFiles);
      setSelectedFiles([]); // Clear files after successful post
    } catch (err) {
      setMessage(err.message || "Error posting story with media.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (indexToRemove) => {
  setSelectedFiles(selectedFiles.filter((_, index) => index !== indexToRemove));
};

  return (
    <div className="bg-black/30 backdrop-blur-lg rounded-xl border border-gray-700/50 p-8 shadow-2xl shadow-blue-500/20">
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-cyan-400">GENERATED NARRATIVE</h3>
        <div className="p-6 bg-black/40 rounded-lg border border-cyan-400/20">
          <p className="text-cyan-100 leading-relaxed font-mono">
            {transformedText}
          </p>
        </div>

        {/* File Input for Photos/Videos */}
        <div className="space-y-2">
          <label className="text-lg font-semibold text-cyan-300">
            ATTACH PHOTOS OR VIDEOS (MAX 5)
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,video/mp4,video/webm"
            multiple
            onChange={handleFileChange}
            className="w-full bg-black/40 border-2 border-cyan-400/30 rounded-lg p-4 text-cyan-100 font-mono"
            disabled={isPosted || isUploading}
          />
        {selectedFiles.length > 0 && (
  <div className="flex gap-2 overflow-x-auto">
    {selectedFiles.map((file, index) => (
      <div key={index} className="flex-shrink-0">
        {file.type.startsWith("video") ? (
          <video src={URL.createObjectURL(file)} className="w-20 h-20 rounded" controls />
        ) : (
          <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} className="w-20 h-20 rounded" />
        )}
        <button
    onClick={() => removeFile(index)}
    className="absolute top-0 right-0 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-white"
  >
    X
  </button>
        
      </div>
    ))}
  </div>
)}
        </div>

        <div className="mt-6 flex items-center justify-end space-x-4">
          {!isPosted ? (
            <button
              onClick={handlePostWithMedia}
              disabled={isUploading}
              className={`px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-gray-900 font-bold hover:from-cyan-400 hover:to-blue-500 transition-all hover:scale-105 shadow-lg hover:shadow-cyan-500/30 ${
                isUploading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isUploading ? "UPLOADING..." : "PUBLISH STORY"}
            </button>
          ) : (
            <div className="flex items-center space-x-2 p-3 border border-green-400/30 bg-green-400/10 rounded-lg">
              <span className="text-green-400 font-mono text-sm">
                ✓ Story archived in community feed
              </span>
            </div>
          )}
        </div>

        <button
          onClick={handleGenerateAudio}
          disabled={isAudioLoading}
          className={`w-full py-5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 transition-all ${
            isAudioLoading ? "opacity-70 cursor-not-allowed" : ""
          } shadow-lg hover:shadow-2xl hover:shadow-purple-500/30`}
        >
          <span className="text-lg font-bold text-white">
            {isAudioLoading ? "SYNTHESIZING AUDIO..." : "GENERATE AUDIO FEED"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default GeneratedStory;
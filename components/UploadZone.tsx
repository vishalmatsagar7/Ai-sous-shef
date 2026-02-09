import React, { useState, useRef, useCallback } from "react";
import CameraCapture from "./CameraCapture";

interface UploadZoneProps {
  onUpload: (file: File) => void;
  error: string | null;
}

export default function UploadZone({ onUpload, error }: UploadZoneProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"image" | "video">("image");
  const [isDragging, setIsDragging] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file?: File) => {
    if (!file) return;
    
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) return;

    const url = URL.createObjectURL(file);
    setPreview(url);
    setPreviewType(isImage ? "image" : "video");
    onUpload(file);
  }, [onUpload]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const triggerUpload = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const triggerVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    videoInputRef.current?.click();
  };

  const triggerCamera = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCamera(true);
  };

  const clearPreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
  };

  return (
    <div className="animate-fadeUp">
      {showCamera && (
        <CameraCapture 
          onCapture={(file) => {
            handleFile(file);
          }} 
          onClose={() => setShowCamera(false)} 
        />
      )}

      <p className="text-sm text-center mb-6 font-medium" style={{ color: "var(--sage)", fontFamily: "'DM Sans', sans-serif" }}>
        Show your Chef the ingredients you have to work with
      </p>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className="relative w-full rounded-[2.5rem] border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center overflow-hidden shadow-xl"
        style={{
          borderColor: isDragging ? "var(--terracotta)" : "var(--light-gray)",
          background: isDragging
            ? "rgba(124, 58, 237, 0.08)"
            : preview
            ? "#0f172a"
            : "var(--warm-white)",
          minHeight: "380px",
        }}
      >
        {/* Preview Container */}
        {preview ? (
          <>
            {previewType === "image" ? (
              <img
                src={preview}
                alt="Preview"
                className="absolute inset-0 w-full h-full object-cover opacity-70 transition-opacity"
              />
            ) : (
              <video
                src={preview}
                controls
                className="absolute inset-0 w-full h-full object-contain bg-black/80"
              />
            )}
            <div className="relative z-10">
                <button
                    onClick={clearPreview}
                    className="px-8 py-3.5 rounded-2xl bg-violet-900/60 backdrop-blur-xl text-white border border-white/30 font-bold hover:bg-violet-800/80 transition-all shadow-2xl"
                >
                    Change Media
                </button>
            </div>
          </>
        ) : (
          <div className="relative z-10 flex flex-col items-center gap-8 px-6 py-10 w-full max-w-sm">
            {/* Animated Main Icon - Now permanent Purple Gradient */}
            <div
              className={`w-20 h-20 rounded-[1.75rem] flex items-center justify-center shadow-lg transition-transform duration-500 ${isDragging ? 'scale-110' : 'animate-float'}`}
              style={{
                background: "linear-gradient(135deg, var(--sage), var(--terracotta))",
                boxShadow: "0 15px 35px rgba(124, 58, 237, 0.4)",
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>

            <div className="text-center">
              <p className="text-lg font-bold mb-1" style={{ color: "var(--charcoal)" }}>
                Drop your fridge tour here
              </p>
              <p className="text-sm opacity-60" style={{ color: "var(--charcoal)" }}>
                JPG, PNG or MP4 videos
              </p>
            </div>

            {/* Styled Media Buttons */}
            <div className="flex flex-col gap-3 w-full">
                <div className="flex gap-3">
                    <button
                        onClick={triggerUpload}
                        className="flex-1 py-4 px-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all hover:scale-[1.05] active:scale-[0.95] group"
                        style={{
                            background: "white",
                            border: "2px solid var(--light-gray)",
                            color: "var(--sage)",
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:text-violet-600">
                           <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                           <polyline points="13 2 13 9 20 9"></polyline>
                        </svg>
                        Choose File
                    </button>
                    <button
                        onClick={triggerVideo}
                        className="flex-1 py-4 px-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all hover:scale-[1.05] active:scale-[0.95] group"
                        style={{
                            background: "white",
                            border: "2px solid var(--light-gray)",
                            color: "var(--sage)",
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:text-indigo-600">
                           <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                           <polygon points="10 8 14 10 10 12 10 8"></polygon>
                           <line x1="2" y1="17" x2="22" y2="17"></line>
                        </svg>
                        Add Video
                    </button>
                </div>
                
                <button
                    onClick={triggerCamera}
                    className="w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg animate-pulse-glow"
                    style={{
                        background: "linear-gradient(135deg, var(--sage), var(--sage-dark))",
                        color: "white",
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                       <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                       <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                    Snap Fresh Photo
                </button>
            </div>
          </div>
        )}

        {/* Hidden inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {/* Error Message - Vibrant Red/Purple */}
      {error && (
        <div
          className="mt-6 p-4 rounded-2xl text-sm font-bold text-center animate-bounce"
          style={{
            background: "rgba(244,63,94,0.1)",
            color: "var(--red-alert)",
            border: "2px solid rgba(244,63,94,0.2)",
          }}
        >
          🚨 {error}
        </div>
      )}
    </div>
  );
}
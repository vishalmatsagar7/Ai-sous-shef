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

      <p className="text-sm text-center mb-5" style={{ color: "var(--warm-gray)", fontFamily: "'DM Sans', sans-serif" }}>
        Take a photo or video of your fridge to get started
      </p>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className="relative w-full rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center overflow-hidden"
        style={{
          borderColor: isDragging ? "var(--sage)" : "var(--light-gray)",
          background: isDragging
            ? "rgba(122,158,126,0.06)"
            : preview
            ? "var(--charcoal)"
            : "var(--warm-white)",
          minHeight: "320px",
        }}
      >
        {/* Preview */}
        {preview ? (
          <>
            {previewType === "image" ? (
              <img
                src={preview}
                alt="Preview"
                className="absolute inset-0 w-full h-full object-cover opacity-60"
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
                    className="px-6 py-3 rounded-xl bg-white/20 backdrop-blur-md text-white border border-white/30 font-medium hover:bg-white/30 transition-all"
                >
                    Change File
                </button>
            </div>
          </>
        ) : (
          <div className="relative z-10 flex flex-col items-center gap-6 px-6 py-8 w-full max-w-sm">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: isDragging ? "var(--sage)" : "var(--light-gray)",
                transition: "background 0.3s ease",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke={isDragging ? "#fff" : "var(--warm-gray)"}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="3" ry="3" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>

            <p className="text-sm text-center" style={{ color: "var(--charcoal)", fontFamily: "'DM Sans', sans-serif" }}>
                Drag & drop, or choose an option:
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                    onClick={triggerUpload}
                    className="flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                        background: "white",
                        border: "1px solid var(--light-gray)",
                        color: "var(--charcoal)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                    }}
                >
                    <span className="text-lg">📁</span> File
                </button>
                <button
                    onClick={triggerVideo}
                    className="flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                        background: "white",
                        border: "1px solid var(--light-gray)",
                        color: "var(--charcoal)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                    }}
                >
                    <span className="text-lg">🎥</span> Video
                </button>
                <button
                    onClick={triggerCamera}
                    className="flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                        background: "linear-gradient(135deg, var(--sage), var(--sage-dark))",
                        color: "white",
                        boxShadow: "0 4px 12px rgba(122,158,126,0.3)"
                    }}
                >
                    <span className="text-lg">📷</span> Photo
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

      {/* Error */}
      {error && (
        <div
          className="mt-4 p-3 rounded-xl text-sm text-center"
          style={{
            background: "rgba(224,64,64,0.08)",
            color: "var(--red-alert)",
            border: "1px solid rgba(224,64,64,0.2)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
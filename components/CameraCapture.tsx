import React, { useEffect, useRef, useState } from "react";

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export default function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let currentStream: MediaStream | null = null;

    async function initCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        });
        currentStream = mediaStream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setError("Could not access camera. Please allow permissions.");
      }
    }

    initCamera();

    return () => {
      // Cleanup: Stop all tracks to turn off camera light
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
        onCapture(file);
        onClose();
      }
    }, "image/jpeg", 0.9);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-3 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm transition-all"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      {/* Video Stream */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
        {error ? (
          <div className="text-white text-center p-6 max-w-xs">
            <p className="mb-6 text-lg">⚠️ {error}</p>
            <button onClick={onClose} className="px-6 py-2 bg-white text-black rounded-xl font-medium">Close Camera</button>
          </div>
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Controls */}
      {!error && (
        <div className="absolute bottom-10 w-full flex items-center justify-center pb-safe">
           <button
            onClick={handleCapture}
            className="w-20 h-20 rounded-full bg-white border-4 border-gray-200 flex items-center justify-center shadow-2xl active:scale-95 transition-transform"
          >
            <div className="w-16 h-16 rounded-full border-2 border-black/10 bg-white"></div>
          </button>
        </div>
      )}
    </div>
  );
}
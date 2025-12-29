import React, { useRef, useState, useEffect } from "react";
import LabelInput from "../components/LabelInput";
import "./upload.css";

const IconUpload = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [labels, setLabels] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false); 
  const [timeLeft, setTimeLeft] = useState(0); 
  const [status, setStatus] = useState({ type: "", message: "" });
  const inputRef = useRef(null);

  // Countdown timer for the 2-minute processing cooldown
  useEffect(() => {
    let interval = null;
    if (isProcessing && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isProcessing) {
      setIsProcessing(false);
      setUploadProgress(0); // Reset progress after processing
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isProcessing, timeLeft]);

  // Format seconds into MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setStatus({ type: "", message: "" });

    // Progress bar simulation (0% to 95%)
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => (prev >= 95 ? 95 : prev + 5));
    }, 200);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://172.18.1.34:8000/upload-file", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (response.ok) {
        setUploadProgress(100);
        setStatus({ type: "success", message: "Upload successful! Please wait for processing." });
        
        // Start 2-minute cooldown
        setIsProcessing(true);
        setTimeLeft(120); 
        setFile(null); 
      } else {
        setStatus({ type: "error", message: "Upload failed. Server error." });
      }
    } catch {
      clearInterval(progressInterval);
      setStatus({ type: "error", message: "Network error: Server unreachable." });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="upload-container">
        <div className="upload-header">
          <h1 className="page-title">Upload Dataset</h1>
          <p className="page-desc">Process will take approximately 2 minutes after upload.</p>
        </div>

        <form className="card" onSubmit={handleUpload}>
          {/* File Dropzone */}
          <div className="form-group">
            <label className="label">Dataset File (.zip)</label>
            <div 
              className={`dropzone ${file ? "active" : ""} ${isProcessing ? "disabled-zone" : ""}`} 
              onClick={() => !isProcessing && inputRef.current.click()}
            >
              <input 
                ref={inputRef} 
                type="file" 
                accept=".zip" 
                className="hidden-file" 
                disabled={isProcessing}
                onChange={(e) => setFile(e.target.files[0])} 
              />
              <div className="drop-content">
                <div className="icon-circle"><IconUpload /></div>
                <div className="drop-text">
                  {file ? <strong>{file.name}</strong> : <><span className="link-text">Click to upload</span> or drag and drop</>}
                </div>
              </div>
            </div>
          </div>

          {/* Optional Labels */}
          <div className="form-group">
            <label className="label">Labels (optional)</label>
            <LabelInput labels={labels} setLabels={setLabels} />
          </div>

          {/* Progress Bar with Visible Percentage */}
          {(isUploading || isProcessing) && (
            <div className="progress-container">
              <div className="progress-info">
                <span className="progress-label">
                  {isProcessing ? "Finalizing..." : "Uploading Dataset"}
                </span>
                <span className="progress-percentage">{uploadProgress}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            </div>
          )}

          {/* 2-Minute Cooldown Timer */}
          {isProcessing && (
            <div className="cooldown-container">
              <div className="timer-spinner"></div>
              <p className="timer-text">
                Processing Dataset... <strong>{formatTime(timeLeft)}</strong> remaining
              </p>
            </div>
          )}

          {/* Status Message (Success/Error) */}
          {status.message && (
            <div className={`status-msg ${status.type}`}>
              {status.message}
            </div>
          )}

          {/* Submit Button */}
          <button 
            className="submit-btn" 
            disabled={!file || isUploading || isProcessing}
          >
            {isProcessing ? "System Busy" : isUploading ? `Uploading ${uploadProgress}%` : "Upload Dataset"}
          </button>
        </form>
      </div>
    </div>
  );
}
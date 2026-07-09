import React, { useEffect, useMemo, useRef, useState } from "react";
import "./LiveCall.css";

const API_AUDIO = "http://localhost:5000/api/predict-audio";

export default function LiveCall() {
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // model response
  const [error, setError] = useState("");
  const [permissionStatus, setPermissionStatus] = useState(null);

  // Check microphone permission status on mount
  useEffect(() => {
    const checkMicrophonePermission = async () => {
      try {
        const permission = await navigator.permissions.query({ name: "microphone" });
        setPermissionStatus(permission.state);
        permission.addEventListener("change", () => {
          setPermissionStatus(permission.state);
        });
      } catch (err) {
        console.log("Permissions API not supported, will request on recording start");
      }
    };
    checkMicrophonePermission();
  }, []);

  // Simple waveform animation
  const baseHeights = useMemo(
    () => [40, 60, 30, 70, 45, 90, 50, 80, 40, 60, 30, 50, 85, 40, 60],
    []
  );
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!recording || paused) return;
    const id = setInterval(() => setTick((t) => t + 1), 120);
    return () => clearInterval(id);
  }, [recording, paused]);

  // ---- Recording Handlers ----
  const startRecording = async () => {
    try {
      setError("");
      setResult(null);

      // Request microphone permission explicitly
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        streamRef.current = stream;

        const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
        mediaRecorderRef.current = mr;
        chunksRef.current = [];

        mr.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
        };

        mr.onstop = async () => {
          stream.getTracks().forEach((t) => t.stop());
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          await sendAudio(blob);
        };

        mr.start();
        setRecording(true);
        setPaused(false);
        setPermissionStatus("granted");
      } catch (permError) {
        console.error("Microphone permission error:", permError);
        
        if (permError.name === "NotAllowedError") {
          setError(
            "❌ Microphone permission denied. Please enable microphone access in your browser settings and reload the page."
          );
        } else if (permError.name === "NotFoundError") {
          setError("❌ No microphone found on this device. Please connect a microphone.");
        } else if (permError.name === "NotReadableError") {
          setError("❌ Microphone is in use by another application. Please close other audio apps.");
        } else {
          setError(
            `❌ Microphone access failed: ${permError.message}. Check browser permissions.`
          );
        }
        setPermissionStatus("denied");
      }
    } catch (e) {
      console.error("Recording error:", e);
      setError("⚠️ An unexpected error occurred. Please try again.");
    }
  };

  const stopRecording = () => {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== "inactive") mr.stop();
    setRecording(false);
    setPaused(false);
  };

  const togglePause = () => {
    const mr = mediaRecorderRef.current;
    if (!mr) return;

    if (mr.state === "recording") {
      mr.pause();
      setPaused(true);
    } else if (mr.state === "paused") {
      mr.resume();
      setPaused(false);
    }
  };

  // ---- Send Audio to Backend ----
  const sendAudio = async (blob) => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const fd = new FormData();
      fd.append("file", blob, "livecall.webm");

      const res = await fetch(API_AUDIO, { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok || data?.error) {
        setError(data?.error || "Backend error while processing audio.");
        setResult(null);
      } else {
        setResult(data);
      }
    } catch (e) {
      console.error(e);
      setError("Cannot reach backend. Check Node server (port 5000).");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  // ---- UI Helpers ----
  const badgeClass = (priority) => {
    switch (priority) {
      case "HIGH":
        return "badge badge-high";
      case "MEDIUM":
        return "badge badge-medium";
      case "LOW":
        return "badge badge-low";
      default:
        return "badge badge-human";
    }
  };

  const bandClass = (band) => {
    switch (band) {
      case "HIGH":
        return "band band-high";
      case "MEDIUM":
        return "band band-medium";
      case "LOW":
        return "band band-low";
      default:
        return "band";
    }
  };

  return (
    <div className="glass-card live-call-container">
      <div className="live-call-header">
        <h3 className="card-title">🎙 LIVE CALL</h3>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {!recording ? (
            <button className="pause-button" onClick={startRecording}>
              ▶
            </button>
          ) : (
            <>
              <button className="pause-button" onClick={togglePause} title="Pause/Resume">
                {paused ? "▶" : "II"}
              </button>
              <button className="pause-button" onClick={stopRecording} title="Stop">
                ■
              </button>
            </>
          )}
        </div>
      </div>

      {/* Waveform */}
      <div className="waveform-visualizer">
        {[...Array(35)].map((_, i) => {
          const h =
            recording && !paused
              ? baseHeights[(i + tick) % baseHeights.length]
              : baseHeights[i % baseHeights.length];

          return (
            <div
              key={i}
              className="waveform-bar"
              style={{ height: `${h}%`, opacity: recording ? 1 : 0.5 }}
            ></div>
          );
        })}
      </div>

      {/* Status */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
        <span className="badge">
          {recording ? (paused ? "⏸ Paused" : "🔴 Recording") : "⚪ Idle"}
        </span>
        {permissionStatus && (
          <span
            className={`badge ${
              permissionStatus === "granted"
                ? "badge-success"
                : permissionStatus === "denied"
                ? "badge-high"
                : "badge"
            }`}
          >
            🎤 Mic:{" "}
            {permissionStatus === "granted"
              ? "✓ Allowed"
              : permissionStatus === "denied"
              ? "✗ Denied"
              : permissionStatus === "prompt"
              ? "? Ask on use"
              : "? Unknown"}
          </span>
        )}
        {loading && <span className="badge">⏳ Processing…</span>}
        {result?.confidence_band && (
          <span className={bandClass(result.confidence_band)}>
            Confidence Band: {result.confidence_band}
          </span>
        )}
        {typeof result?.confidence === "number" && (
          <span className="badge">Confidence: {result.confidence}%</span>
        )}
      </div>

      {/* Output */}
      {error && <div className="error-box">❌ {error}</div>}

      {result && (
        <div className="result-box">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <span className="badge">🚨 Type: {result.label}</span>
            <span className={badgeClass(result.priority)}>⚡ Priority: {result.priority}</span>
            <span className="badge">🚦 Route: {result.route}</span>
          </div>

          {result?.top2?.length > 0 && (
            <div className="top2">
              <strong>Top-2:</strong>{" "}
              {result.top2.map((x, idx) => (
                <span key={idx} style={{ marginRight: 10 }}>
                  {x[0]} ({x[1]}%)
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Transcript */}
      <div className="transcript-area">
        <p className="transcript-line">
          <span className="speaker-operator">[System]</span>{" "}
          {recording
            ? "Listening… speak now and press stop."
            : "Press ▶ to start recording. Press ■ to stop and get prediction."}
        </p>

        {result?.transcript ? (
          <p className="transcript-line">
            <span className="speaker-caller">[Caller]</span> {result.transcript}
          </p>
        ) : (
          <p className="transcript-line" style={{ opacity: 0.7 }}>
            <span className="speaker-caller">[Caller]</span> Transcript will appear here…
          </p>
        )}
      </div>
    </div>
  );
}
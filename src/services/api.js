const API_BASE = "http://localhost:5000";

export const predictText = async (text) => {
  const res = await fetch(`${API_BASE}/api/predict-text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return res.json();
};

export const predictAudio = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/api/predict-audio`, {
    method: "POST",
    body: formData,
  });

  return res.json();
};
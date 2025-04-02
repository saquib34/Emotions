import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000"; // Change this if your Flask backend runs on a different URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
  timeout: 120000, // Set timeout to 2 minutes (120,000 ms)
});

/**
 * Uploads an audio file and analyzes emotions.
 * @param {File} file - The audio file to analyze.
 * @returns {Promise<Object>} - The emotion analysis result.
 */
export const analyzeAudioEmotion = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await api.post("/predict-audio-emotion", formData);
    return response.data;
  } catch (error) {
    console.error("Error analyzing audio emotion:", error);
    throw error.response?.data?.error || "Failed to analyze audio";
  }
};

/**
 * Uploads an image file and analyzes emotions.
 * @param {File} file - The image file to analyze.
 * @returns {Promise<Object>} - The emotion analysis result.
 */
export const analyzeImageEmotion = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await api.post("/predict-image-emotion", formData);
    return response.data;
  } catch (error) {
    console.error("Error analyzing image emotion:", error);
    throw error.response?.data?.error || "Failed to analyze image";
  }
};

export default api;
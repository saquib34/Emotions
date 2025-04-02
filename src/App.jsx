import React, { useState, useRef, useEffect } from "react";
import Dropzone from "react-dropzone";
import { motion } from "framer-motion";
import WaveSurfer from "wavesurfer.js";
import { Mic, Upload, Play, Pause, RefreshCw, Image as ImageIcon } from "lucide-react";
import { analyzeAudioEmotion, analyzeImageEmotion } from './utils/api';
import EmotionRadar from "./components/charts/EmotionRadar";
import EmotionBars from "./components/charts/EmotionBars";
import UploadZone from "./components/sections/UploadZone";
import ResultsSection from "./components/sections/ResultsSection";
import ImageResultsSection from "./components/sections/ImageResultsSection";
import GlassCard from "./components/ui/GlassCard";
import AnimatedButton from "./components/ui/AnimatedButton";
import ImageUploadZone from "./components/sections/ImageUploadZone";
import "./index.css";

function App() {
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isAnalyzingAudio, setIsAnalyzingAudio] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioResults, setAudioResults] = useState(null);
  const [imageResults, setImageResults] = useState(null);
  const [audioError, setAudioError] = useState(null);
  const [imageError, setImageError] = useState(null);
  const wavesurferRef = useRef(null);
  const wavesurferContainerRef = useRef(null);
  const imagePreviewRef = useRef(null);

  // Handle audio file drop
  const handleAudioDrop = (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    if (!file.type.startsWith('audio/')) {
      setAudioError('Please upload an audio file');
      return;
    }
    setAudioFile(file);
    setAudioResults(null);
    setAudioError(null);
  };

  // Handle image file drop
  const handleImageDrop = (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    if (!file.type.startsWith('image/')) {
      setImageError('Please upload an image file');
      return;
    }
    setImageFile(file);
    setImageResults(null);
    setImageError(null);
  };

  // Audio waveform setup
  useEffect(() => {
    if (!audioFile) return;

    setTimeout(() => {
      if (!wavesurferContainerRef.current) return;

      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }

      const wavesurfer = WaveSurfer.create({
        container: wavesurferContainerRef.current,
        waveColor: "#8B5CF6",
        progressColor: "#6D28D9",
        cursorColor: "#4C1D95",
        height: 80,
        barWidth: 2,
        barGap: 1,
        responsive: true,
        normalize: true,
      });

      wavesurfer.on("ready", () => setIsPlaying(false));
      wavesurfer.on("play", () => setIsPlaying(true));
      wavesurfer.on("pause", () => setIsPlaying(false));
      wavesurfer.on("finish", () => setIsPlaying(false));

      wavesurfer.loadBlob(audioFile);
      wavesurferRef.current = wavesurfer;
    }, 100);
  }, [audioFile]);

  // Image preview setup
  useEffect(() => {
    if (!imageFile) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (imagePreviewRef.current) {
        imagePreviewRef.current.src = e.target.result;
      }
    };
    reader.readAsDataURL(imageFile);
  }, [imageFile]);

  // Play/Pause Toggle for audio
  const togglePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  // Analyze audio
  const analyzeAudio = async () => {
    if (!audioFile) return;
    setIsAnalyzingAudio(true);
    setAudioError(null);

    try {
      const data = await analyzeAudioEmotion(audioFile);
      setAudioResults(data);
    } catch (err) {
      setAudioError(err);
    } finally {
      setIsAnalyzingAudio(false);
    }
  };

  // Analyze image
  const analyzeImage = async () => {
    if (!imageFile) return;
    setIsAnalyzingImage(true);
    setImageError(null);

    try {
      const data = await analyzeImageEmotion(imageFile);
      setImageResults(data);
    } catch (err) {
      setImageError(err);
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }} 
        className="max-w-4xl mx-auto"
      >
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">Emotion Analyzer</h1>
          <p className="text-purple-200">Analyze emotions from audio or images</p>
        </header>

        {/* Audio Section */}
        <GlassCard className="mb-8">
          <h2 className="text-2xl text-white mb-4">Audio Analysis</h2>
          {!audioFile ? (
            <UploadZone 
              onDrop={handleAudioDrop}
              accept={{ 'audio/*': ['.mp3', '.wav', '.ogg'] }}
              text="Drop an audio file here or click to upload"
            />
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-purple-900 bg-opacity-30 rounded-lg">
                <h3 className="text-white font-medium mb-2">Audio Waveform</h3>
                <div ref={wavesurferContainerRef} className="w-full h-20" />
                <div className="flex justify-center mt-4 space-x-3">
                  <AnimatedButton onClick={togglePlayPause}>
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    {isPlaying ? "Pause" : "Play"}
                  </AnimatedButton>
                  <AnimatedButton onClick={analyzeAudio} disabled={isAnalyzingAudio}>
                    {isAnalyzingAudio ? <RefreshCw size={18} className="animate-spin" /> : <Mic size={18} />}
                    {isAnalyzingAudio ? "Analyzing..." : "Analyze Audio"}
                  </AnimatedButton>
                  <AnimatedButton variant="secondary" onClick={() => {
                    setAudioFile(null);
                    if (wavesurferRef.current) wavesurferRef.current.destroy();
                  }}>
                    <Upload size={18} />
                    New Audio
                  </AnimatedButton>
                </div>
              </div>
              {audioError && (
                <div className="p-4 bg-red-500 bg-opacity-20 rounded-lg text-white">
                  <p>{audioError}</p>
                </div>
              )}
              {audioResults && <ResultsSection results={audioResults} />}
            </div>
          )}
        </GlassCard>

        {/* Image Section */}
        <GlassCard>
          <h2 className="text-2xl text-white mb-4">Image Analysis</h2>
          {!imageFile ? (
            <ImageUploadZone 
              onDrop={handleImageDrop}
              accept={{ 'image/*': ['.jpg', '.jpeg', '.png'] }}
              text="Drop an image file here or click to upload"
            />
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-purple-900 bg-opacity-30 rounded-lg">
                <h3 className="text-white font-medium mb-2">Image Preview</h3>
                <img 
                  ref={imagePreviewRef}
                  className="max-w-full h-auto mx-auto rounded-lg"
                  alt="Preview"
                  style={{ maxHeight: '300px' }}
                />
                <div className="flex justify-center mt-4 space-x-3">
                  <AnimatedButton onClick={analyzeImage} disabled={isAnalyzingImage}>
                    {isAnalyzingImage ? <RefreshCw size={18} className="animate-spin" /> : <ImageIcon size={18} />}
                    {isAnalyzingImage ? "Analyzing..." : "Analyze Image"}
                  </AnimatedButton>
                  <AnimatedButton variant="secondary" onClick={() => setImageFile(null)}>
                    <Upload size={18} />
                    New Image
                  </AnimatedButton>
                </div>
              </div>
              {imageError && (
                <div className="p-4 bg-red-500 bg-opacity-20 rounded-lg text-white">
                  <p>{imageError}</p>
                </div>
              )}
              {imageResults && <ImageResultsSection results={imageResults} />}
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}

export default App;
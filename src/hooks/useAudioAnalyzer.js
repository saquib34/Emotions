import { useState, useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { analyzeAudio } from '../utils/api';
import { defaultWaveSurferConfig } from '../lib/wavesurfer-config';

/**
 * Custom hook for audio analysis
 * @param {Object} options - Hook options
 * @returns {Object} - Hook state and methods
 */
const useAudioAnalyzer = (options = {}) => {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [duration, setDuration] = useState(0);
  
  const wavesurferRef = useRef(null);
  const containerRef = useRef(null);
  
  const { waveformOptions = {} } = options;
  
  useEffect(() => {
    return () => {
      // Cleanup wavesurfer instance on unmount
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, []);
  
  const loadFile = (audioFile) => {
    setFile(audioFile);
    setResults(null);
    setError(null);
    
    // Clean up previous instance
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
    }
    
    if (!containerRef.current) return;
    
    // Create new instance
    const wavesurfer = WaveSurfer.create({
      ...defaultWaveSurferConfig,
      ...waveformOptions,
      container: containerRef.current,
    });
    
    wavesurfer.on('ready', () => {
      wavesurferRef.current = wavesurfer;
      setDuration(wavesurfer.getDuration());
    });
    
    wavesurfer.on('play', () => setIsPlaying(true));
    wavesurfer.on('pause', () => setIsPlaying(false));
    wavesurfer.on('finish', () => setIsPlaying(false));
    wavesurfer.on('error', (err) => setError('Error loading audio: ' + err));
    
    wavesurfer.loadBlob(audioFile);
  };
  
  const startAnalysis = async () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const data = await analyzeAudio(file);
      setResults(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const togglePlayPause = () => {
    if (!wavesurferRef.current) return;
    wavesurferRef.current.playPause();
  };
  
  const resetAnalyzer = () => {
    setFile(null);
    setResults(null);
    setError(null);
    
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
      wavesurferRef.current = null;
    }
  };
  
  return {
    file,
    isAnalyzing,
    isPlaying,
    results,
    error,
    duration,
    containerRef,
    loadFile,
    startAnalysis,
    togglePlayPause,
    resetAnalyzer,
  };
};

export default useAudioAnalyzer;
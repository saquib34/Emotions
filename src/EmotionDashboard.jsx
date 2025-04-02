import { useState, useRef, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Filler } from 'chart.js';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import axios from 'axios';
import WaveSurfer from 'wavesurfer.js';
import { PlayCircle, StopCircle, UploadCloud } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Filler);

const EmotionRadar = ({ results }) => {
  const radarVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 120 } }
  };

  return (
    <motion.div variants={radarVariants} className="relative w-64 h-64">
      <Doughnut
        data={{
          labels: results.predictions.map(e => e.emotion),
          datasets: [{
            data: results.predictions.map(e => e.confidence),
            backgroundColor: Object.values(emotionColors),
            borderColor: '#1e293b',
            borderWidth: 2,
            hoverBorderWidth: 4
          }]
        }}
        options={{
          cutout: '70%',
          animation: { duration: 2000 },
          plugins: { legend: false, tooltip: false }
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="text-4xl"
        >
          🌀
        </motion.div>
      </div>
    </motion.div>
  );
};

const EmotionBars = ({ results }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="w-full max-w-2xl">
      {results.predictions.map((emotion, idx) => (
        <motion.div
          key={emotion.emotion}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${emotion.confidence * 100}%` } : {}}
          transition={{ delay: idx * 0.1, duration: 0.8 }}
          className="h-8 mb-4 relative rounded-full overflow-hidden"
          style={{ backgroundColor: emotionColors[emotion.emotion] + '40' }}
        >
          <div className="absolute inset-0 flex items-center px-4 justify-between">
            <span className="font-medium text-sm">{emotion.emotion}</span>
            <span className="text-sm">
              {(emotion.confidence * 100).toFixed(1)}%
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default function EmotionDashboard() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [waveform, setWaveform] = useState(null);
  const [playing, setPlaying] = useState(false);
  const waveformRef = useRef(null);
  const audioRef = useRef(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'audio/wav',
    multiple: false,
    onDrop: files => files[0] && handleFileUpload(files[0])
  });

  useEffect(() => {
    if (waveformRef.current && !waveform) {
      const ws = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#64748b',
        progressColor: '#38bdf8',
        cursorColor: '#ffffff',
        height: 100,
        responsive: true
      });
      setWaveform(ws);
    }
  }, []);

  const handleFileUpload = async file => {
    try {
      setLoading(true);
      setError('');
      
      // Audio preview
      const url = URL.createObjectURL(file);
      waveform.load(url);
      audioRef.current = new Audio(url);

      // Upload and analyze
      const formData = new FormData();
      formData.append('file', file);
      
      const { data } = await axios.post('/analyze', formData, {
        onUploadProgress: progress => {
          console.log(`Upload Progress: ${(progress.loaded / progress.total * 100).toFixed(0)}%`);
        }
      });

      setResults(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">
            Emotion Pulse
          </h1>
          <p className="text-slate-400">AI-powered voice emotion analysis</p>
        </motion.div>

        {/* Upload Zone */}
        <motion.div
          {...getRootProps()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`group p-8 border-2 border-dashed rounded-2xl backdrop-blur-lg transition-all cursor-pointer
            ${isDragActive ? 'border-cyan-400 bg-slate-800/50' : 'border-slate-700 bg-slate-800/30'}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <motion.div
              animate={isDragActive ? { y: [-5, 5, -5] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <UploadCloud className="w-16 h-16 text-cyan-400" />
            </motion.div>
            <p className="text-lg text-slate-300">
              {isDragActive ? 'Release to analyze' : 'Drag audio file or click to browse'}
            </p>
          </div>
        </motion.div>

        {/* Audio Preview */}
        {waveform && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 bg-slate-800/50 p-6 rounded-xl backdrop-blur-sm"
          >
            <div ref={waveformRef} />
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => {
                  playing ? audioRef.current.pause() : audioRef.current.play();
                  setPlaying(!playing);
                }}
                className="flex items-center gap-2 px-6 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-full"
              >
                {playing ? <StopCircle /> : <PlayCircle />}
                {playing ? 'Stop Preview' : 'Play Preview'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Results Section */}
        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-16 grid lg:grid-cols-2 gap-12"
            >
              {/* Radar Chart */}
              <div className="bg-slate-800/50 p-8 rounded-2xl backdrop-blur-sm">
                <h2 className="text-2xl font-semibold mb-8">Emotion Spectrum</h2>
                <EmotionRadar results={results} />
              </div>

              {/* Bars Chart */}
              <div className="bg-slate-800/50 p-8 rounded-2xl backdrop-blur-sm">
                <h2 className="text-2xl font-semibold mb-8">Confidence Distribution</h2>
                <EmotionBars results={results} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="text-center">
                <div className="w-24 h-24 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-xl">Analyzing Audio...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
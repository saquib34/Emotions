import React from 'react';
import { Radar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const EmotionRadar = ({ emotionData }) => {
  // Ensure emotionData is an array
  const emotionArray = Array.isArray(emotionData)
    ? emotionData
    : Object.entries(emotionData).map(([emotion, confidence]) => ({ emotion, confidence }));

  // Define emotion colors
  const emotionColors = {
    neutral: '#94A3B8', // slate
    calm: '#38BDF8',    // sky
    happy: '#FACC15',   // yellow
    sad: '#3B82F6',     // blue
    angry: '#EF4444',   // red
    fear: '#8B5CF6',    // violet
    disgust: '#10B981', // emerald
    surprised: '#F97316' // orange
  };

  const data = {
    labels: emotionArray.map(item => item.emotion),
    datasets: [
      {
        label: 'Emotion Confidence',
        data: emotionArray.map(item => item.confidence * 100), // Convert to percentage
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 2,
        pointBackgroundColor: emotionArray.map(item => emotionColors[item.emotion]),
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: emotionArray.map(item => emotionColors[item.emotion]),
        pointRadius: 4,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
        pointLabels: {
          color: 'white',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          backdropColor: 'transparent',
          stepSize: 20,
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw.toFixed(1)}%`;
          }
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-64 md:h-80"
    >
      <Radar data={data} options={options} />
    </motion.div>
  );
};

export default EmotionRadar;
import React, { useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EmotionBars = ({ emotionData }) => {
  // Define emotion colors
  const emotionColors = {
    neutral: '#94A3B8', // slate
    calm: '#38BDF8',    // sky
    happy: '#FACC15',   // yellow
    sad: '#3B82F6',     // blue
    angry: '#EF4444',   // red
    fearful: '#8B5CF6', // violet
    disgust: '#10B981', // emerald
    surprised: '#F97316' // orange
  };

  // Sort emotions by confidence (highest first)
  const sortedData = [...emotionData].sort((a, b) => b.confidence - a.confidence);

  const data = {
    labels: sortedData.map(item => item.emotion),
    datasets: [
      {
        data: sortedData.map(item => item.confidence * 100), // Convert to percentage
        backgroundColor: sortedData.map(item => emotionColors[item.emotion]),
        borderColor: sortedData.map(item => emotionColors[item.emotion].replace(')', ', 1)')
          .replace('rgb', 'rgba')
          .replace('rgba', 'rgb')),
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
        title: {
          display: true,
          text: 'Confidence (%)',
          color: 'white',
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'white',
          font: {
            weight: 'bold',
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        callbacks: {
          label: function(context) {
            return `${context.raw.toFixed(1)}%`;
          },
          title: function(context) {
            return context[0].label.charAt(0).toUpperCase() + context[0].label.slice(1);
          }
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
    },
  };

  // Create animation for bars
  const chartRef = useRef(null);
  
  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current;
      
      // Animation plugin
      const delayBetweenBars = 100;
      
      if (chart.options.animation) {
        const originalAnimationProgress = chart.options.animation.progress;
        
        chart.options.animation.progress = function(animation) {
          if (originalAnimationProgress) {
            originalAnimationProgress.call(this, animation);
          }
          
          const meta = chart.getDatasetMeta(0);
          meta.data.forEach((bar, index) => {
            const delay = index * delayBetweenBars;
            const animationDuration = chart.options.animation.duration || 1000;
            
            if (animation.currentStep < delay) {
              bar.x = 0;
            }
          });
        };
        
        chart.update('none');
      }
    }
  }, [emotionData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full h-64 md:h-80"
    >
      <Bar ref={chartRef} data={data} options={options} />
    </motion.div>
  );
};

export default EmotionBars;
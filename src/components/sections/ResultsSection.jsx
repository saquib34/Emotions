import React, { useState } from 'react';
import { motion } from 'framer-motion';
import EmotionRadar from '../charts/EmotionRadar';
import EmotionBars from '../charts/EmotionBars';
import AnimatedButton from '../ui/AnimatedButton';
import { BarChart3, PieChart, AlertCircle } from 'lucide-react';

const ResultsSection = ({ results }) => {
  const [activeChart, setActiveChart] = useState('radar');
  
  if (!results || !results.predictions) return null;
  
  const { predictions, top_emotion, top_confidence } = results;
  
  // Emotion emoji mapping
  const emotionEmojis = {
    'neutral': '😐',
    'calm': '😌',
    'happy': '😄',
    'sad': '😢',
    'angry': '😠',
    'fearful': '😨',
    'disgust': '🤢',
    'surprised': '😲'
  };

  // Emotion descriptions
  const emotionDescriptions = {
    'neutral': 'No strong emotional inflection detected',
    'calm': 'Relaxed and peaceful tone',
    'happy': 'Joyful and positive emotion',
    'sad': 'Melancholic or somber tone',
    'angry': 'Irritated or hostile emotion',
    'fearful': 'Anxious or scared sentiment',
    'disgust': 'Repulsed or adverse reaction',
    'surprised': 'Unexpected or astonished reaction'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="bg-purple-900 bg-opacity-30 rounded-lg p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-between"
        >
          <div>
            <h3 className="text-purple-200 mb-1">Top Detected Emotion</h3>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{emotionEmojis[top_emotion] || '🔍'}</span>
              <div>
                <h2 className="text-2xl font-bold text-white capitalize">{top_emotion}</h2>
                <p className="text-purple-200">{(top_confidence * 100).toFixed(1)}% confidence</p>
              </div>
            </div>
          </div>
          
          <motion.div 
            initial={{ rotate: -10, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="p-4 bg-purple-800  rounded-lg text-white max-w-xs"
          >
            <div className="flex gap-2 items-start">
              <AlertCircle size={18} className="mt-1 flex-shrink-0" />
              <p>{emotionDescriptions[top_emotion] || 'Emotional analysis completed'}</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-center gap-4">
          <AnimatedButton 
            variant={activeChart === 'radar' ? 'primary' : 'secondary'} 
            onClick={() => setActiveChart('radar')}
          >
            <PieChart size={18} />
            Radar Chart
          </AnimatedButton>
          
          <AnimatedButton 
            variant={activeChart === 'bars' ? 'primary' : 'secondary'} 
            onClick={() => setActiveChart('bars')}
          >
            <BarChart3 size={18} />
            Bar Chart
          </AnimatedButton>
        </div>
        
        <div className="bg-purple-900 bg-opacity-30 rounded-lg p-4">
          {activeChart === 'radar' ? (
            <EmotionRadar emotionData={predictions} />
          ) : (
            <EmotionBars emotionData={predictions} />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ResultsSection;
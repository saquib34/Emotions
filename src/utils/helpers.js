/**
 * Format confidence value as percentage
 * @param {number} confidence - Confidence value (0-1)
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted percentage
 */
export const formatConfidence = (confidence, decimals = 1) => {
    return (confidence * 100).toFixed(decimals) + '%';
  };
  
  /**
   * Get color for emotion
   * @param {string} emotion - Emotion name
   * @returns {string} - Hex color code
   */
  export const getEmotionColor = (emotion) => {
    const colors = {
      neutral: '#94A3B8', // slate
      calm: '#38BDF8',    // sky
      happy: '#FACC15',   // yellow
      sad: '#3B82F6',     // blue
      angry: '#EF4444',   // red
      fearful: '#8B5CF6', // violet
      disgust: '#10B981', // emerald
      surprised: '#F97316' // orange
    };
    
    return colors[emotion] || '#64748B'; // Default to slate if no match
  };
  
  /**
   * Get emoji for emotion
   * @param {string} emotion - Emotion name
   * @returns {string} - Emoji
   */
  export const getEmotionEmoji = (emotion) => {
    const emojis = {
      neutral: '😐',
      calm: '😌',
      happy: '😄',
      sad: '😢',
      angry: '😠',
      fearful: '😨',
      disgust: '🤢',
      surprised: '😲'
    };
    
    return emojis[emotion] || '🔍';
  };
  
  /**
   * Format audio duration
   * @param {number} seconds - Duration in seconds
   * @returns {string} - Formatted duration (MM:SS)
   */
  export const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  /**
   * Create blob URL from file
   * @param {File} file - File object
   * @returns {string} - Blob URL
   */
  export const createBlobUrl = (file) => {
    return URL.createObjectURL(file);
  };
  
  /**
   * Get file extension
   * @param {string} filename - Filename
   * @returns {string} - File extension
   */
  export const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
  };
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, Mic } from 'lucide-react';

const UploadZone = ({ onDrop }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.ogg', '.m4a']
    },
    maxFiles: 1,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div 
        {...getRootProps()} 
        className={`
          flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-purple-400 bg-purple-900 bg-opacity-30' 
            : 'border-gray-400 hover:border-purple-400 bg-purple-900 bg-opacity-10 hover:bg-opacity-20'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: isDragActive ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
          className="mb-4 p-4 rounded-full bg-purple-700 text-white"
        >
          {isDragActive ? <Mic size={40} /> : <Upload size={40} />}
        </motion.div>
        
        <h3 className="text-xl font-medium text-white mb-2">
          {isDragActive ? 'Drop the audio file here' : 'Upload an audio file'}
        </h3>
        
        <p className="text-purple-200 text-center max-w-md">
          Drag and drop an audio file here, or click to select. 
          Supported formats: WAV, MP3, OGG, M4A
        </p>
      </div>
    </motion.div>
  );
};

export default UploadZone;
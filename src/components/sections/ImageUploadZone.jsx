import React from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon } from 'lucide-react';

const ImageUploadZone = ({ onDrop }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp']
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
            ? 'border-blue-400 bg-blue-900 bg-opacity-30' 
            : 'border-gray-400 hover:border-blue-400 bg-blue-900 bg-opacity-10 hover:bg-opacity-20'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: isDragActive ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
          className="mb-4 p-4 rounded-full bg-blue-700 text-white"
        >
          {isDragActive ? <ImageIcon size={40} /> : <Upload size={40} />}
        </motion.div>
        
        <h3 className="text-xl font-medium text-white mb-2">
          {isDragActive ? 'Drop the image here' : 'Upload an image'}
        </h3>
        
        <p className="text-blue-200 text-center max-w-md">
          Drag and drop an image here, or click to select. 
          Supported formats: JPG, JPEG, PNG, GIF, WEBP
        </p>
      </div>
    </motion.div>
  );
};

export default ImageUploadZone;

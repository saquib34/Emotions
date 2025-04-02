import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

/**
 * Custom hook for file uploads
 * @param {Object} options - Hook options
 * @returns {Object} - Hook state and methods
 */
const useFileUpload = (options = {}) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  
  const {
    accept = {
      'audio/*': ['.mp3', '.wav', '.ogg', '.m4a']
    },
    maxSize = 10 * 1024 * 1024, // 10MB
    maxFiles = 1,
    onFileAccepted = () => {},
  } = options;
  
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Reset errors
    setError(null);
    
    // Handle rejected files
    if (rejectedFiles && rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      
      if (rejection.errors[0].code === 'file-too-large') {
        setError(`File is too large. Max size: ${Math.round(maxSize / 1024 / 1024)}MB`);
      } else if (rejection.errors[0].code === 'file-invalid-type') {
        setError('Invalid file type. Please upload an audio file.');
      } else {
        setError('File upload failed: ' + rejection.errors[0].message);
      }
      
      return;
    }
    
    // Handle accepted files
    if (acceptedFiles && acceptedFiles.length > 0) {
      const audioFile = acceptedFiles[0];
      setFile(audioFile);
      onFileAccepted(audioFile);
    }
  }, [maxSize, onFileAccepted]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
  });
  
  const resetUpload = () => {
    setFile(null);
    setError(null);
  };
  
  return {
    file,
    error,
    isDragActive,
    getRootProps,
    getInputProps,
    resetUpload,
  };
};

export default useFileUpload;
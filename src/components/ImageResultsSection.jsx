import React, { Component } from 'react';
import EmotionBars from './charts/ImageEmotionBars';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error in EmotionBars:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong while rendering EmotionBars.</div>;
    }
    return this.props.children;
  }
}

const ImageResultsSection = ({ emotionData }) => {
  return (
    <ErrorBoundary>
      <EmotionBars emotionData={emotionData} />
    </ErrorBoundary>
  );
};

export default ImageResultsSection;

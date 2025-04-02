/**
 * Default WaveSurfer configuration
 */
export const defaultWaveSurferConfig = {
    waveColor: '#8B5CF6',
    progressColor: '#6D28D9',
    cursorColor: '#4C1D95',
    cursorWidth: 2,
    height: 80,
    barWidth: 2,
    barGap: 1,
    responsive: true,
    normalize: true,
    partialRender: true,
  };
  
  /**
   * WaveSurfer configuration for minimal display
   */
  export const minimalWaveSurferConfig = {
    ...defaultWaveSurferConfig,
    height: 40,
    barWidth: 1,
    cursorWidth: 1,
    hideScrollbar: true,
  };
  
  /**
   * WaveSurfer configuration for detailed display
   */
  export const detailedWaveSurferConfig = {
    ...defaultWaveSurferConfig,
    height: 120,
    barWidth: 3,
    barRadius: 3,
    cursorWidth: 2,
  };
  
  /**
   * Initialize WaveSurfer with plugins
   * @param {HTMLElement} container - DOM element to render waveform
   * @param {Object} config - WaveSurfer configuration overrides
   * @returns {Object} - WaveSurfer instance
   */
  export const initWaveSurfer = (container, config = {}) => {
    // This is just a placeholder - actual implementation would depend on how you're importing WaveSurfer
    // import WaveSurfer from 'wavesurfer.js';
    
    const wavesurfer = WaveSurfer.create({
      ...defaultWaveSurferConfig,
      ...config,
      container,
    });
    
    return wavesurfer;
  };
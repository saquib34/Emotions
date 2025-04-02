/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx,css}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#8B5CF6',
            dark: '#6D28D9',
            light: '#A78BFA',
          },
          accent: '#F472B6',
          indigo: {
            900: '#312e81',
            800: '#3730a3',
            700: '#4338ca',
            600: '#4f46e5',
            500: '#6366f1',
            400: '#818cf8',
          },
        },
        animation: {
          'bounce-slow': 'bounce 2s ease-in-out infinite',
          'pulse-slow': 'pulse 2s ease-in-out infinite',
          'spin-slow': 'spin 3s linear infinite',
        },
        boxShadow: {
          glow: '0 0 15px rgba(139, 92, 246, 0.5)',
          glass: '0 8px 32px rgba(0, 0, 0, 0.2)',
        },
        backdropBlur: {
          md: '8px', // Enable backdrop-blur-md
        },
      },
    },
    corePlugins: {
      backdropBlur: true, // Ensure backdrop-blur is included
    },
    plugins: [],
  };
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from 'react';

export default function App() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);

    if (!file) {
      return;
    }

    // Verify it's a video file (although accept="video/*" should handle this)
    if (!file.type.startsWith('video/')) {
      setError('Selecteer alstublieft een geldig videobestand.');
      return;
    }

    // Free memory from the previous video URL if it exists
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }

    // Create a local object URL for the selected file
    // This happens entirely in the browser's memory/cache, no server upload!
    try {
      const localUrl = URL.createObjectURL(file);
      setVideoUrl(localUrl);
    } catch (err) {
      setError('Kan deze video niet lokaal laden. Mogelijk is het bestand te groot voor deze oude iPad.');
      console.error(err);
    }
  };

  const handleReset = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoUrl(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans text-gray-900">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4">
          <h1 className="text-xl font-bold text-white text-center">
            Lokale Video Speler
          </h1>
          <p className="text-blue-100 text-sm text-center mt-1">
            Volledig offline. Geen server uploads.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center gap-6">
          
          {error && (
            <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
              {error}
            </div>
          )}

          {!videoUrl ? (
            <div className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-12 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
              <svg xmlns="http://www.w-w.org/2000/svg" className="h-16 w-16 text-blue-500 mb-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <p className="text-lg font-medium text-gray-700 mb-2 text-center">
                Selecteer een video vanaf je iPad
              </p>
              <p className="text-sm text-gray-500 text-center mb-6">
                Alles gebeurt op het apparaat zelf. Bestand blijft lokaal.
              </p>
              
              {/* Opacity 0 file input layered on top of the box for easy tapping */}
              <input 
                type="file" 
                accept="video/*" 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium shadow hover:bg-blue-700 pointer-events-none">
                Kies Bestand
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-4">
              <div className="relative bg-black rounded-xl overflow-hidden shadow-inner aspect-video flex items-center justify-center">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  playsInline
                  // @ts-ignore - Some older iOS versions use this specific attribute
                  webkit-playsinline="true"
                  className="max-h-[60vh] w-auto mx-auto"
                >
                  Je browser ondersteunt geen lokale video weergave.
                </video>
              </div>
              
              <div className="flex justify-center mt-2">
                <button 
                  onClick={handleReset}
                  className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium shadow hover:bg-gray-300 active:bg-gray-400 transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w-w.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Kies andere video
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
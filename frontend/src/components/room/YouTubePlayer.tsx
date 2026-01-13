import React, { useState } from 'react';
import './YouTubePlayer.css';

interface YouTubePlayerProps {
  videoUrl?: string;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoUrl }) => {
  const [urlInput, setUrlInput] = useState('');
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

  // Extract video ID from URL
  const getVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleLoadVideo = () => {
    const id = getVideoId(urlInput);
    if (id) {
      setCurrentVideoId(id);
    }
  };

  // If prop provided, use it
  React.useEffect(() => {
    if (videoUrl) {
      const id = getVideoId(videoUrl);
      if (id) setCurrentVideoId(id);
    }
  }, [videoUrl]);

  return (
    <div className="youtube-container">
      <div className="player-wrapper">
        {currentVideoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="player-placeholder">
            <div className="placeholder-content">
              <span className="icon">🎵</span>
              <h3>No Song Playing</h3>
              <p>Add a YouTube link to start karaoke</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="player-controls">
        <input 
          type="text" 
          placeholder="Paste YouTube URL here..." 
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLoadVideo()}
        />
        <button className="primary" onClick={handleLoadVideo}>
          Play
        </button>
      </div>
    </div>
  );
};

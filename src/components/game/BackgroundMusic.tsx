import React, { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';

export const BackgroundMusic: React.FC = () => {
  const { audio } = useGameStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // YouTube video ID from the link: bBOGbcb6RBA
    const videoId = 'bBOGbcb6RBA';
    // We use the YouTube embed with autoplay and loop
    // Note: Autoplay might be blocked by browsers unless there's user interaction
    // However, since the user interacts with the game, it should eventually play
    const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&enablejsapi=1`;
    
    if (iframeRef.current) {
      if (audio.isMusicPlaying) {
        iframeRef.current.src = src;
      } else {
        iframeRef.current.src = '';
      }
    }
  }, [audio.isMusicPlaying]);

  return (
    <div className="fixed bottom-0 right-0 w-0 h-0 overflow-hidden pointer-events-none opacity-0">
      <iframe
        ref={iframeRef}
        width="100"
        height="100"
        title="Background Music"
        allow="autoplay; encrypted-media"
        frameBorder="0"
      />
    </div>
  );
};


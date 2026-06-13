import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Subtitles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

interface AudioPlayerProps {
  exhibitId: string;
  duration: number;
  title?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ exhibitId, duration, title }) => {
  const { isPlaying, currentAudioId, playbackProgress, togglePlay, setPlaybackProgress, user } = useAppStore();
  const [currentTime, setCurrentTime] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const isCurrentPlaying = isPlaying && currentAudioId === exhibitId;
  const progress = currentAudioId === exhibitId ? playbackProgress : 0;

  useEffect(() => {
    if (isCurrentPlaying) {
      intervalRef.current = window.setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isCurrentPlaying, duration]);

  useEffect(() => {
    const prog = duration > 0 ? (currentTime / duration) * 100 : 0;
    setPlaybackProgress(prog);
  }, [currentTime, duration, setPlaybackProgress]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    togglePlay(exhibitId);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    setCurrentTime(percentage * duration);
    setPlaybackProgress(percentage * 100);
  };

  const handleSkipBack = () => {
    setCurrentTime(prev => Math.max(0, prev - 15));
  };

  const handleSkipForward = () => {
    setCurrentTime(prev => Math.min(duration, prev + 15));
  };

  return (
    <div className="glass-card p-4">
      {title && (
        <div className="text-sm text-text-secondary mb-3">
          🎧 {title}
        </div>
      )}
      
      <div 
        className="w-full h-2 bg-glass rounded-full cursor-pointer mb-3"
        onClick={handleSeek}
      >
        <div 
          className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-gold rounded-full shadow-glow-gold" />
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-text-secondary">{formatTime(currentTime)}</span>
        <span className="text-xs text-text-secondary">{formatTime(duration)}</span>
      </div>

      <div className="flex items-center justify-center gap-6">
        <button 
          onClick={handleSkipBack}
          className="text-text-secondary hover:text-white transition-colors"
        >
          <SkipBack size={20} />
        </button>
        
        <button 
          onClick={handlePlayPause}
          className={cn(
            'w-14 h-14 rounded-full flex items-center justify-center transition-all',
            isCurrentPlaying 
              ? 'bg-gold text-space-dark shadow-glow-gold' 
              : 'bg-gradient-to-br from-gold to-gold-dark text-space-dark hover:shadow-glow-gold'
          )}
        >
          {isCurrentPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
        </button>
        
        <button 
          onClick={handleSkipForward}
          className="text-text-secondary hover:text-white transition-colors"
        >
          <SkipForward size={20} />
        </button>
      </div>

      {user.settings.subtitleEnabled && (
        <div className="mt-4 pt-3 border-t border-glass-border">
          <div className="flex items-center gap-2 mb-2">
            <Subtitles size={14} className="text-gold" />
            <span className="text-xs text-text-secondary">无障碍字幕</span>
          </div>
          <p className="text-sm text-text-primary leading-relaxed">
            欢迎收听展品语音导览。接下来将为您详细介绍这件展品的历史背景、艺术特色和文化价值...
          </p>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;

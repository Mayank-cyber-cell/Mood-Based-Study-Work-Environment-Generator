import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Mood } from '@/types/mood';

interface MusicPlayerProps {
  mood: Mood;
}

export const MusicPlayer = ({ mood }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="player-controls"
    >
      <div className="flex flex-col items-center w-full max-w-md">
        {/* Now Playing Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6"
        >
          <h3 className="text-xl font-bold text-glow mb-2">{mood.name} Vibes</h3>
          <p className="text-sm text-muted-foreground">
            {mood.keywords.join(' • ')}
          </p>
        </motion.div>

        {/* YouTube Embed (Hidden, for background audio) */}
        <div className="hidden">
          <iframe
            width="0"
            height="0"
            src={`https://www.youtube.com/embed/videoseries?list=${mood.playlistId}&autoplay=${isPlaying ? 1 : 0}&loop=1`}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>

        {/* Visual Music Representation */}
        <motion.div
          className="flex justify-center items-end mb-8 space-x-1.5 h-16"
          animate={isPlaying ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 bg-primary rounded-full shadow-lg"
              style={{ boxShadow: '0 0 8px hsl(var(--primary) / 0.5)' }}
              animate={isPlaying ? {
                height: [12, Math.random() * 48 + 12, 12],
                opacity: [0.4, 1, 0.4]
              } : { height: 12, opacity: 0.3 }}
              transition={{
                duration: 0.6 + Math.random() * 0.6,
                repeat: Infinity,
                delay: i * 0.08
              }}
            />
          ))}
        </motion.div>

        {/* Main Controls */}
        <div className="flex items-center gap-6 mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="glass-button w-12 h-12 hover:scale-110 transition-transform"
          >
            <SkipBack className="w-5 h-5" />
          </Button>

          <Button
            onClick={togglePlay}
            className="glass-button w-16 h-16 rounded-full border-glow hover:scale-110 transition-transform"
            style={{
              background: `linear-gradient(135deg, ${mood.color}60, ${mood.color}30)`,
              boxShadow: `0 0 24px ${mood.color}40, 0 8px 32px rgba(0, 0, 0, 0.4)`
            }}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7" />
            ) : (
              <Play className="w-7 h-7 ml-1" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="glass-button w-12 h-12 hover:scale-110 transition-transform"
          >
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3 w-full">
          <Volume2 className="w-5 h-5 text-muted-foreground" />
          <div className="flex-1 relative group">
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${volume}%, rgba(255,255,255,0.2) ${volume}%, rgba(255,255,255,0.2) 100%)`
              }}
            />
          </div>
          <span className="text-sm text-muted-foreground w-10 text-right font-medium">{volume}%</span>
        </div>

        {/* Keyboard Shortcuts Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xs text-muted-foreground mt-4 text-center"
        >
          Press <kbd className="px-1 py-0.5 text-xs bg-white/10 rounded">Space</kbd> to play/pause
        </motion.p>
      </div>
    </motion.div>
  );
};
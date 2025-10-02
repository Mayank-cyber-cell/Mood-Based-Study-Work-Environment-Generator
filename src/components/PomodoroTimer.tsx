import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTimer } from '@/hooks/useTimer';

export const PomodoroTimer = () => {
  const { timer, progress, toggleTimer, resetTimer } = useTimer();

  const circumference = 2 * Math.PI * 90; // radius = 90
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card p-6 flex flex-col items-center"
    >
      <h3 className="text-lg font-semibold mb-4 text-glow">
        {timer.isBreak ? 'Break Time' : 'Focus Time'}
      </h3>

      {/* Circular Progress */}
      <div className="relative mb-6">
        <svg
          width="200"
          height="200"
          className="progress-ring transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="8"
            fill="transparent"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx="100"
            cy="100"
            r="90"
            stroke="hsl(var(--primary))"
            strokeWidth="8"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="filter drop-shadow-lg"
            style={{
              filter: 'drop-shadow(0 0 10px hsl(var(--primary) / 0.6))'
            }}
          />
        </svg>

        {/* Timer Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            key={`${timer.minutes}:${timer.seconds}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-bold text-glow"
          >
            {formatTime(timer.minutes, timer.seconds)}
          </motion.div>
          <div className="text-sm text-muted-foreground mt-1">
            Cycle {timer.cycles + 1}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <Button
          onClick={toggleTimer}
          className="glass-button px-6 py-2 border-glow"
          style={{
            background: timer.isActive 
              ? 'linear-gradient(135deg, hsl(var(--destructive))40, hsl(var(--destructive))20)'
              : 'linear-gradient(135deg, hsl(var(--primary))40, hsl(var(--primary))20)'
          }}
        >
          {timer.isActive ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start
            </>
          )}
        </Button>

        <Button
          onClick={resetTimer}
          variant="ghost"
          className="glass-button px-4 py-2"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Keyboard Shortcut Hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-xs text-muted-foreground mt-4 text-center"
      >
        Press <kbd className="px-1 py-0.5 text-xs bg-white/10 rounded">P</kbd> to start/pause
      </motion.p>
    </motion.div>
  );
};
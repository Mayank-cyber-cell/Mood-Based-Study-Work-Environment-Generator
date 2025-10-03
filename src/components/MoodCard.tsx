import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Mood } from '@/types/mood';
import { useState } from 'react';

interface MoodCardProps {
  mood: Mood;
  isSelected: boolean;
  onSelect: (moodId: string) => void;
  index: number;
}

export const MoodCard = ({ mood, isSelected, onSelect, index }: MoodCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -10 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(mood.id)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d"
      }}
      className={`mood-card relative overflow-hidden ${
        isSelected ? 'border-primary border-glow' : ''
      }`}
    >
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${mood.color}15, ${mood.color}05)`
        }}
        animate={{
          opacity: isHovered ? 1 : 0.5
        }}
      />

      <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
        <motion.div
          className="text-5xl mb-4"
          animate={{
            y: isHovered ? [0, -8, 0] : 0,
            rotate: isHovered ? [0, -5, 5, 0] : 0
          }}
          transition={{
            duration: 0.6,
            repeat: isHovered ? Infinity : 0,
            repeatDelay: 0.5
          }}
        >
          {mood.icon}
        </motion.div>
        <h3 className="text-xl font-semibold mb-2 text-glow">{mood.name}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {mood.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {mood.keywords.slice(0, 2).map((keyword, i) => (
            <motion.span
              key={keyword}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: isHovered ? 1 : 0.7, scale: 1 }}
              transition={{ delay: index * 0.1 + i * 0.1 }}
              className="text-xs px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
            >
              {keyword}
            </motion.span>
          ))}
        </div>
      </div>

      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10 rounded-2xl pointer-events-none"
        >
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                `radial-gradient(circle at 0% 0%, ${mood.color}20, transparent 50%)`,
                `radial-gradient(circle at 100% 100%, ${mood.color}20, transparent 50%)`,
                `radial-gradient(circle at 0% 0%, ${mood.color}20, transparent 50%)`
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>
      )}

      <motion.div
        className="absolute inset-0 opacity-30 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${mood.color}40, transparent 70%)`
        }}
        animate={{
          scale: isHovered ? [1, 1.2, 1] : 1
        }}
        transition={{
          duration: 2,
          repeat: isHovered ? Infinity : 0
        }}
      />

      <motion.div
        className="absolute -inset-1 rounded-2xl opacity-0"
        style={{
          background: `linear-gradient(45deg, ${mood.color}30, transparent, ${mood.color}30)`,
          filter: "blur(20px)"
        }}
        animate={{
          opacity: isHovered ? 0.6 : 0
        }}
      />
    </motion.div>
  );
};
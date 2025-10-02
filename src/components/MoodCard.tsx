import { motion } from 'framer-motion';
import { Mood } from '@/types/mood';

interface MoodCardProps {
  mood: Mood;
  isSelected: boolean;
  onSelect: (moodId: string) => void;
  index: number;
}

export const MoodCard = ({ mood, isSelected, onSelect, index }: MoodCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -10 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(mood.id)}
      className={`mood-card relative overflow-hidden ${
        isSelected ? 'border-primary border-glow' : ''
      }`}
      style={{
        background: isSelected 
          ? `linear-gradient(135deg, ${mood.color}20, ${mood.color}10)`
          : undefined
      }}
    >
      <div className="relative z-10">
        <div className="text-4xl mb-4 animate-float">{mood.icon}</div>
        <h3 className="text-xl font-semibold mb-2 text-glow">{mood.name}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {mood.description}
        </p>
      </div>
      
      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10 rounded-2xl"
        />
      )}
      
      <div 
        className="absolute inset-0 opacity-20 rounded-2xl"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${mood.color}40, transparent 70%)`
        }}
      />
    </motion.div>
  );
};
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-16 h-8 rounded-full p-1 transition-colors duration-500 ease-in-out overflow-hidden"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
          : 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)'
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none"
        initial={false}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="stars"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="flex gap-0.5"
            >
              {[...Array(3)].map((_, i) => (
                <Sparkles
                  key={i}
                  className="w-2 h-2 text-yellow-300"
                  style={{
                    animation: `twinkle ${1 + i * 0.3}s ease-in-out infinite`
                  }}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="clouds"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 0.5 }}
              exit={{ x: -20, opacity: 0 }}
              className="text-white/50"
            >
              ☁️
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="relative z-10 w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center"
        animate={{
          x: isDark ? 0 : 32
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Moon className="w-4 h-4 text-slate-700" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Sun className="w-4 h-4 text-yellow-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: isDark
            ? [
                'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)'
              ]
            : [
                'radial-gradient(circle at 80% 50%, rgba(251, 191, 36, 0.2) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.2) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, rgba(251, 191, 36, 0.2) 0%, transparent 50%)'
              ]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.button>
  );
};

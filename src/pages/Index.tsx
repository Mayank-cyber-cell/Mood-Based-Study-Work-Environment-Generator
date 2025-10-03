import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoodCard } from '@/components/MoodCard';
import { MusicPlayer } from '@/components/MusicPlayer';
import { PomodoroTimer } from '@/components/PomodoroTimer';
import { QuoteDisplay } from '@/components/QuoteDisplay';
import { Header } from '@/components/Header';
import { MOODS } from '@/data/mood';
import { MoodType } from '@/types/mood';

const Index = () => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const selectedMoodData = selectedMood ? MOODS.find(m => m.id === selectedMood) : null;

  const handleMoodSelect = async (moodId: string) => {
    if (selectedMood === moodId) return;
    
    setIsTransitioning(true);
    
    // Wait for fade out
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setSelectedMood(moodId as MoodType);
    
    // Update body class for theme
    document.body.className = `mood-${moodId}`;
    
    setIsTransitioning(false);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          break;
        case 'KeyP':
          e.preventDefault();
          break;
        case 'KeyM':
          e.preventDefault();
          break;
        case 'Digit1':
          handleMoodSelect('calm');
          break;
        case 'Digit2':
          handleMoodSelect('stressed');
          break;
        case 'Digit3':
          handleMoodSelect('excited');
          break;
        case 'Digit4':
          handleMoodSelect('tired');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleMoodSelect]);

  // Initialize with calm mood
  useEffect(() => {
    document.body.className = 'mood-calm';
  }, []);

  return (
    <div className="min-h-screen transition-all duration-500">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-glow">
            MoodFlow
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Transform your study sessions with mood-based music and focused productivity tools
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!selectedMood ? (
            // Mood Selection
            <motion.div
              key="mood-selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-semibold text-center mb-8"
              >
                How are you feeling today?
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {MOODS.map((mood, index) => (
                  <MoodCard
                    key={mood.id}
                    mood={mood}
                    isSelected={false}
                    onSelect={handleMoodSelect}
                    index={index}
                  />
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center text-sm text-muted-foreground mt-8"
              >
                <p>Use keyboard shortcuts: Press 1-4 to select moods quickly</p>
              </motion.div>
            </motion.div>
          ) : (
            // Mood Environment
            <motion.div
              key="mood-environment"
              initial={{ opacity: 0 }}
              animate={{ opacity: isTransitioning ? 0 : 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Back to mood selection */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => {
                  setSelectedMood(null);
                  document.body.className = 'mood-calm';
                }}
                className="glass-button px-5 py-2.5 mb-8 hover:scale-105 transition-transform font-medium"
              >
                ← Change Mood
              </motion.button>

              {/* Selected mood header */}
              {selectedMoodData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-8"
                >
                  <div className="text-6xl mb-4 animate-float">
                    {selectedMoodData.icon}
                  </div>
                  <h2 className="text-3xl font-bold text-glow mb-2">
                    {selectedMoodData.name} Mode
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    {selectedMoodData.description}
                  </p>
                </motion.div>
              )}

              {/* Main content grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {/* Music Player */}
                <div className="lg:col-span-2">
                  {selectedMoodData && (
                    <MusicPlayer mood={selectedMoodData} />
                  )}
                </div>

                {/* Pomodoro Timer */}
                <div>
                  <PomodoroTimer />
                </div>
              </div>

              {/* Quote Display */}
              <div className="max-w-2xl mx-auto">
                <QuoteDisplay />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10"
          style={{
            background: selectedMoodData 
              ? `radial-gradient(circle, ${selectedMoodData.color}40, transparent 70%)`
              : 'radial-gradient(circle, hsl(var(--primary))40, transparent 70%)'
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-10"
          style={{
            background: selectedMoodData 
              ? `radial-gradient(circle, ${selectedMoodData.color}30, transparent 70%)`
              : 'radial-gradient(circle, hsl(var(--accent))30, transparent 70%)'
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    </div>
  );
};

export default Index;
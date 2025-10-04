import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, TrendingUp } from 'lucide-react';
import { MoodCard } from '@/components/MoodCard';
import { MusicPlayer } from '@/components/MusicPlayer';
import { PomodoroTimer } from '@/components/PomodoroTimer';
import { QuoteDisplay } from '@/components/QuoteDisplay';
import { Header } from '@/components/Header';
import { RatingDialog } from '@/components/RatingDialog';
import { MoodAnalytics } from '@/components/MoodAnalytics';
import { Button } from '@/components/ui/button';
import { MOODS } from '@/data/mood';
import { MoodType } from '@/types/mood';
import { useSession } from '@/hooks/useSession';

const Index = () => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [musicPlayed, setMusicPlayed] = useState(false);
  const [timerUsed, setTimerUsed] = useState(false);

  const { sessionData, endSession, updateSessionActivity } = useSession(selectedMood);
  const selectedMoodData = selectedMood ? MOODS.find(m => m.id === selectedMood) : null;

  const handleMoodSelect = async (moodId: string) => {
    if (selectedMood === moodId) return;

    if (selectedMood && sessionData.sessionId) {
      await endSession();
    }

    setIsTransitioning(true);

    await new Promise(resolve => setTimeout(resolve, 300));

    setSelectedMood(moodId as MoodType);
    setMusicPlayed(false);
    setTimerUsed(false);

    document.body.className = `mood-${moodId}`;

    setIsTransitioning(false);
  };

  const handleEndSession = async () => {
    if (sessionData.sessionId) {
      await endSession();
      setShowRatingDialog(true);
    }
    setSelectedMood(null);
    document.body.className = 'mood-calm';
  };

  useEffect(() => {
    updateSessionActivity(musicPlayed, timerUsed);
  }, [musicPlayed, timerUsed, updateSessionActivity]);

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
              <div className="flex flex-col items-center gap-8">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-semibold text-center"
                >
                  How are you feeling today?
                </motion.h2>

                <Button
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  variant="outline"
                  className="glass-button"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {showAnalytics ? 'Hide' : 'View'} Analytics
                </Button>
              </div>

              {showAnalytics && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="max-w-6xl mx-auto"
                >
                  <MoodAnalytics />
                </motion.div>
              )}

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
              <div className="flex justify-between items-center">
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={handleEndSession}
                  className="glass-button px-5 py-2.5 hover:scale-105 transition-transform font-medium"
                >
                  ← Change Mood
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => setShowRatingDialog(true)}
                  className="glass-button px-5 py-2.5 hover:scale-105 transition-transform font-medium flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Rate Experience
                </motion.button>
              </div>

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
                <div className="lg:col-span-2">
                  {selectedMoodData && (
                    <MusicPlayer
                      mood={selectedMoodData}
                      onMusicPlayed={setMusicPlayed}
                    />
                  )}
                </div>

                <div>
                  <PomodoroTimer onTimerUsed={setTimerUsed} />
                </div>
              </div>

              {/* Quote Display */}
              <div className="max-w-2xl mx-auto">
                <QuoteDisplay />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {selectedMood && sessionData.sessionId && (
          <RatingDialog
            isOpen={showRatingDialog}
            onClose={() => setShowRatingDialog(false)}
            mood={selectedMood}
            sessionId={sessionData.sessionId}
          />
        )}
      </div>

      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
          style={{
            background: selectedMoodData
              ? `radial-gradient(circle, ${selectedMoodData.color}15, transparent 70%)`
              : 'radial-gradient(circle, hsl(var(--primary) / 0.1), transparent 70%)',
            filter: 'blur(40px)'
          }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
          style={{
            background: selectedMoodData
              ? `radial-gradient(circle, ${selectedMoodData.color}12, transparent 70%)`
              : 'radial-gradient(circle, hsl(var(--accent) / 0.08), transparent 70%)',
            filter: 'blur(40px)'
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div
          className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full"
          style={{
            background: selectedMoodData
              ? `radial-gradient(circle, ${selectedMoodData.color}10, transparent 70%)`
              : 'radial-gradient(circle, hsl(var(--secondary) / 0.06), transparent 70%)',
            filter: 'blur(50px)'
          }}
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>
    </div>
  );
};

export default Index;
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { MoodType } from '@/types/mood';
import { toast } from 'sonner';

interface RatingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mood: MoodType;
  sessionId: string;
}

export const RatingDialog = ({ isOpen, onClose, mood, sessionId }: RatingDialogProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [matchedNeed, setMatchedNeed] = useState<boolean | null>(null);
  const [helpedFocus, setHelpedFocus] = useState<boolean | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('mood_ratings').insert({
        session_id: sessionId,
        mood_type: mood,
        rating,
        matched_need: matchedNeed ?? false,
        helped_focus: helpedFocus ?? false,
        feedback_text: feedbackText || null,
      });

      if (error) throw error;

      toast.success('Thank you for your feedback!');
      onClose();
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setHoveredRating(0);
    setMatchedNeed(null);
    setHelpedFocus(null);
    setFeedbackText('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="glass-card p-6 m-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-glow">How was your experience?</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    resetForm();
                    onClose();
                  }}
                  className="glass-button w-8 h-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-3 text-center">
                    Rate your {mood} mode experience
                  </p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            star <= (hoveredRating || rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setMatchedNeed(true)}
                      variant={matchedNeed === true ? 'default' : 'outline'}
                      className={`flex-1 glass-button ${
                        matchedNeed === true ? 'border-primary' : ''
                      }`}
                    >
                      Matched my need
                    </Button>
                    <Button
                      onClick={() => setMatchedNeed(false)}
                      variant={matchedNeed === false ? 'default' : 'outline'}
                      className={`flex-1 glass-button ${
                        matchedNeed === false ? 'border-destructive' : ''
                      }`}
                    >
                      Didn't match
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => setHelpedFocus(true)}
                      variant={helpedFocus === true ? 'default' : 'outline'}
                      className={`flex-1 glass-button ${
                        helpedFocus === true ? 'border-primary' : ''
                      }`}
                    >
                      Helped me focus
                    </Button>
                    <Button
                      onClick={() => setHelpedFocus(false)}
                      variant={helpedFocus === false ? 'default' : 'outline'}
                      className={`flex-1 glass-button ${
                        helpedFocus === false ? 'border-destructive' : ''
                      }`}
                    >
                      Didn't help
                    </Button>
                  </div>
                </div>

                <div>
                  <Textarea
                    placeholder="Any additional feedback? (optional)"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    className="glass-card resize-none min-h-[80px]"
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground mt-1 text-right">
                    {feedbackText.length}/500
                  </p>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || rating === 0}
                  className="w-full glass-button border-glow"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

import { useState, useEffect } from 'react';
import { Quote } from '@/types/mood';

export const useQuote = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const fallbackQuotes = [
        { text: "Focus on progress, not perfection.", author: "Anonymous" },
        { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
        { text: "Your limitation—it's only your imagination.", author: "Anonymous" },
        { text: "Great things never come from comfort zones.", author: "Anonymous" },
        { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
        { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
        { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Anonymous" },
        { text: "Dream bigger. Do bigger.", author: "Anonymous" },
        { text: "Success doesn't just find you. You have to go out and get it.", author: "Anonymous" },
        { text: "Sometimes we're tested not to show our weaknesses, but to discover our strengths.", author: "Anonymous" },
        { text: "Don't stop when you're tired. Stop when you're done.", author: "Anonymous" },
        { text: "Wake up with determination. Go to bed with satisfaction.", author: "Anonymous" },
      ];
      setQuote(fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]);
    } catch (error) {
      console.error('Failed to fetch quote:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return { quote, loading, refetchQuote: fetchQuote };
};
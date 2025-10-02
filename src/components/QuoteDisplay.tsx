import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuote } from '@/hooks/useQuote';

export const QuoteDisplay = () => {
  const { quote, loading, refetchQuote } = useQuote();

  if (!quote && !loading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="quote-container relative"
    >
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : quote ? (
        <motion.div
          key={quote.text}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <blockquote className="text-lg mb-4 text-foreground/90 leading-relaxed">
            "{quote.text}"
          </blockquote>
          <cite className="text-sm text-muted-foreground">
            — {quote.author}
          </cite>
        </motion.div>
      ) : null}

      <Button
        onClick={refetchQuote}
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 glass-button w-8 h-8 opacity-50 hover:opacity-100"
        disabled={loading}
      >
        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
      </Button>
    </motion.div>
  );
};
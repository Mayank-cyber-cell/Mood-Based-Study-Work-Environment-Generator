import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { MOODS } from '@/data/mood';

interface AnalyticsData {
  mood_type: string;
  session_count: number;
  total_duration_seconds: number;
  average_rating: number;
}

export const MoodAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('mood_history')
        .select('mood_type, session_count, total_duration_seconds, average_rating')
        .gte('date', sevenDaysAgo.toISOString().split('T')[0]);

      if (error) throw error;

      const aggregated = (data || []).reduce((acc: any, curr) => {
        const existing = acc.find((item: any) => item.mood_type === curr.mood_type);
        if (existing) {
          existing.session_count += curr.session_count || 0;
          existing.total_duration_seconds += curr.total_duration_seconds || 0;
          existing.ratings.push(curr.average_rating);
        } else {
          acc.push({
            mood_type: curr.mood_type,
            session_count: curr.session_count || 0,
            total_duration_seconds: curr.total_duration_seconds || 0,
            ratings: curr.average_rating ? [curr.average_rating] : [],
          });
        }
        return acc;
      }, []);

      const processedData = aggregated.map((item: any) => ({
        mood_type: item.mood_type,
        session_count: item.session_count,
        total_duration_seconds: item.total_duration_seconds,
        average_rating:
          item.ratings.length > 0
            ? item.ratings.reduce((a: number, b: number) => a + b, 0) / item.ratings.length
            : 0,
      }));

      setAnalytics(processedData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </motion.div>
    );
  }

  if (analytics.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card p-6 text-center"
      >
        <p className="text-muted-foreground">
          No activity yet. Start a mood session to see your analytics!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <h3 className="text-xl font-bold text-glow mb-6 flex items-center gap-2">
        <TrendingUp className="w-5 h-5" />
        Your 7-Day Activity
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analytics.map((data) => {
          const mood = MOODS.find((m) => m.id === data.mood_type);
          if (!mood) return null;

          return (
            <motion.div
              key={data.mood_type}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="glass-card p-4"
              style={{
                background: `linear-gradient(135deg, ${mood.color}15, ${mood.color}05)`,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{mood.icon}</span>
                <div>
                  <h4 className="font-semibold text-glow">{mood.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {data.session_count} session{data.session_count !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Total time</span>
                  </div>
                  <span className="font-medium">
                    {formatDuration(data.total_duration_seconds)}
                  </span>
                </div>

                {data.average_rating > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Star className="w-4 h-4" />
                      <span>Avg rating</span>
                    </div>
                    <span className="font-medium flex items-center gap-1">
                      {data.average_rating.toFixed(1)}
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

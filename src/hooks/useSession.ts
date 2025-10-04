import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MoodType } from '@/types/mood';

interface SessionData {
  sessionId: string | null;
  startTime: number | null;
  isTracking: boolean;
}

export const useSession = (mood: MoodType | null) => {
  const [sessionData, setSessionData] = useState<SessionData>({
    sessionId: null,
    startTime: null,
    isTracking: false,
  });

  const musicPlayedRef = useRef(false);
  const timerUsedRef = useRef(false);

  const startSession = useCallback(async (moodType: MoodType) => {
    try {
      const { data: session, error } = await supabase
        .from('user_sessions')
        .insert({
          mood_type: moodType,
          started_at: new Date().toISOString(),
          music_played: false,
          timer_used: false,
        })
        .select()
        .maybeSingle();

      if (error) throw error;

      if (session) {
        setSessionData({
          sessionId: session.id,
          startTime: Date.now(),
          isTracking: true,
        });
      }
    } catch (error) {
      console.error('Error starting session:', error);
    }
  }, []);

  const endSession = useCallback(async () => {
    if (!sessionData.sessionId || !sessionData.startTime) return;

    const durationSeconds = Math.floor((Date.now() - sessionData.startTime) / 1000);

    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({
          ended_at: new Date().toISOString(),
          duration_seconds: durationSeconds,
          music_played: musicPlayedRef.current,
          timer_used: timerUsedRef.current,
        })
        .eq('id', sessionData.sessionId);

      if (error) throw error;

      setSessionData({
        sessionId: null,
        startTime: null,
        isTracking: false,
      });
    } catch (error) {
      console.error('Error ending session:', error);
    }
  }, [sessionData.sessionId, sessionData.startTime]);

  const updateSessionActivity = useCallback(
    (musicPlayed?: boolean, timerUsed?: boolean) => {
      if (musicPlayed !== undefined) {
        musicPlayedRef.current = musicPlayed;
      }
      if (timerUsed !== undefined) {
        timerUsedRef.current = timerUsed;
      }
    },
    []
  );

  useEffect(() => {
    if (mood && !sessionData.isTracking) {
      startSession(mood);
    }

    return () => {
      if (sessionData.isTracking) {
        endSession();
      }
    };
  }, [mood]);

  return {
    sessionData,
    startSession,
    endSession,
    updateSessionActivity,
  };
};

import { useState, useEffect, useCallback } from 'react';
import { TimerState } from '@/types/mood';

const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;

export const useTimer = () => {
  const [timer, setTimer] = useState<TimerState>({
    minutes: WORK_MINUTES,
    seconds: 0,
    isActive: false,
    isBreak: false,
    cycles: 0,
  });

  const [totalSeconds, setTotalSeconds] = useState(WORK_MINUTES * 60);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timer.isActive && (timer.minutes > 0 || timer.seconds > 0)) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev.seconds > 0) {
            return { ...prev, seconds: prev.seconds - 1 };
          } else if (prev.minutes > 0) {
            return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          } else {
            // Timer finished
            const newIsBreak = !prev.isBreak;
            const newCycles = newIsBreak ? prev.cycles : prev.cycles + 1;
            const newMinutes = newIsBreak ? BREAK_MINUTES : WORK_MINUTES;
            
            setTotalSeconds(newMinutes * 60);
            
            return {
              minutes: newMinutes,
              seconds: 0,
              isActive: false,
              isBreak: newIsBreak,
              cycles: newCycles,
            };
          }
        });
      }, 1000);
    } else if (!timer.isActive) {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer.isActive, timer.minutes, timer.seconds]);

  const startTimer = useCallback(() => {
    setTimer(prev => ({ ...prev, isActive: true }));
  }, []);

  const pauseTimer = useCallback(() => {
    setTimer(prev => ({ ...prev, isActive: false }));
  }, []);

  const resetTimer = useCallback(() => {
    const minutes = timer.isBreak ? BREAK_MINUTES : WORK_MINUTES;
    setTimer(prev => ({
      ...prev,
      minutes,
      seconds: 0,
      isActive: false,
    }));
    setTotalSeconds(minutes * 60);
  }, [timer.isBreak]);

  const toggleTimer = useCallback(() => {
    if (timer.isActive) {
      pauseTimer();
    } else {
      startTimer();
    }
  }, [timer.isActive, startTimer, pauseTimer]);

  const currentSeconds = timer.minutes * 60 + timer.seconds;
  const progress = ((totalSeconds - currentSeconds) / totalSeconds) * 100;

  return {
    timer,
    progress,
    startTimer,
    pauseTimer,
    resetTimer,
    toggleTimer,
  };
};

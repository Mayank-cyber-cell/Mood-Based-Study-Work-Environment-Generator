export type MoodType = 'calm' | 'stressed' | 'excited' | 'tired';

export interface Mood {
  id: MoodType;
  name: string;
  description: string;
  icon: string;
  color: string;
  playlistId: string; // YouTube playlist ID as fallback
  keywords: string[];
}

export interface Quote {
  text: string;
  author: string;
}

export interface TimerState {
  minutes: number;
  seconds: number;
  isActive: boolean;
  isBreak: boolean;
  cycles: number;
}

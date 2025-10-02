import { Mood } from '@/types/mood';

export const MOODS: Mood[] = [
  {
    id: 'calm',
    name: 'Calm',
    description: 'Find your inner peace and focus',
    icon: '🧘',
    color: 'hsl(168, 76%, 50%)',
    playlistId: 'PLrAl6rYgs4IvGFMaBqq2gF7gOQGGHdZhq', // Calm/Meditation playlist
    keywords: ['peaceful', 'meditation', 'ambient', 'nature'],
  },
  {
    id: 'stressed',
    name: 'Stressed',
    description: 'Relax and unwind with soothing sounds',
    icon: '😌',
    color: 'hsl(250, 70%, 60%)',
    playlistId: 'PLrAl6rYgs4IuO4Up_ubpX-fNOG6cDnA5y', // Stress relief playlist
    keywords: ['relaxing', 'stress relief', 'calming', 'therapeutic'],
  },
  {
    id: 'excited',
    name: 'Excited',
    description: 'Channel your energy with upbeat vibes',
    icon: '⚡',
    color: 'hsl(340, 85%, 65%)',
    playlistId: 'PLrAl6rYgs4IvHl4iO-Dy_XVh5U7KShX2i', // Energetic/Upbeat playlist
    keywords: ['energetic', 'upbeat', 'motivational', 'high energy'],
  },
  {
    id: 'tired',
    name: 'Tired',
    description: 'Boost your energy and stay focused',
    icon: '☕',
    color: 'hsl(35, 85%, 65%)',
    playlistId: 'PLrAl6rYgs4IswKugr-Pu8zCMDGaWB9FrQ', // Focus/Energy playlist
    keywords: ['focus music', 'energizing', 'coffee shop', 'productivity'],
  },
];

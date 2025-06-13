// src/data/CoachData.ts

export interface Coach {
  id: string;
  name: string;
  profileUrl: string;
  specialization: string;
  bio: string;
  isMyCoach: boolean;
  joinDate?: string;
  rating?: number;
  experience?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description?: string;
  type: 'session' | 'match' | 'workshop' | 'meeting';
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  uploadDate: string;
  category: 'batting' | 'bowling' | 'fielding' | 'fitness';
  coachId?: string;
}

export interface StudentStats {
  myCoach: number;
  totalCoaches: number;
  sessions: number;
  videos: number;
  events: number;
}

export const dummyCoaches: Coach[] = [
  {
    id: "1",
    name: "Rahul Dravid",
    profileUrl: "https://picsum.photos/300/300?12",
    specialization: "Batting Technique",
    bio: "Former Indian captain known as 'The Wall' for his solid defensive technique. Specializes in batting fundamentals.",
    isMyCoach: true,
    joinDate: "2024-01-15",
    rating: 4.9,
    experience: "15 years coaching experience"
  },
  {
    id: "2",
    name: "Anil Kumble",
    profileUrl: "https://picsum.photos/300/300?13",
    specialization: "Spin Bowling",
    bio: "Legendary leg-spinner with 619 Test wickets. Expert in spin bowling techniques and match strategy.",
    isMyCoach: false,
    rating: 4.8,
    experience: "12 years coaching experience"
  },
  {
    id: "3",
    name: "Gary Kirsten",
    profileUrl: "https://picsum.photos/300/300?14",
    specialization: "Mental Conditioning",
    bio: "World Cup winning coach who focuses on mental toughness and batting under pressure.",
    isMyCoach: false,
    rating: 4.7,
    experience: "20 years coaching experience"
  },
  {
    id: "4",
    name: "Fielding Coach",
    profileUrl: "https://picsum.photos/300/300?15",
    specialization: "Fielding",
    bio: "Specialist fielding coach with innovative drills to improve agility and catching.",
    isMyCoach: false,
    rating: 4.6,
    experience: "8 years coaching experience"
  },
  {
    id: "5",
    name: "Fitness Trainer",
    profileUrl: "https://picsum.photos/300/300?16",
    specialization: "Strength & Conditioning",
    bio: "Certified strength and conditioning specialist for cricket-specific fitness programs.",
    isMyCoach: false,
    rating: 4.5,
    experience: "10 years coaching experience"
  }
];

export const dummyCoachRequests: Coach[] = [
  {
    id: "pending_1",
    name: "MS Dhoni",
    profileUrl: "https://picsum.photos/300/300?17",
    specialization: "Wicket-keeping & Finishing",
    bio: "Legendary captain offering specialized training in wicket-keeping and finishing games.",
    isMyCoach: false,
    rating: 5.0,
    experience: "5 years coaching experience"
  },
  {
    id: "pending_2",
    name: "Zaheer Khan",
    profileUrl: "https://picsum.photos/300/300?18",
    specialization: "Fast Bowling",
    bio: "Expert in swing bowling and death over strategies for fast bowlers.",
    isMyCoach: false,
    rating: 4.7,
    experience: "7 years coaching experience"
  }
];

export const dummyEvents: Event[] = [
  {
    id: "1",
    title: "Batting Technique Session",
    date: "2025-06-15",
    time: "16:00",
    description: "One-on-one session focusing on defensive techniques",
    type: "session"
  },
  {
    id: "2",
    title: "Spin Bowling Workshop",
    date: "2025-06-20",
    time: "10:00",
    description: "Workshop on playing spin bowling effectively",
    type: "workshop"
  },
  {
    id: "3",
    title: "Progress Review",
    date: "2025-06-12",
    time: "14:00",
    description: "Monthly performance review with coach",
    type: "meeting"
  }
];

export const dummyVideos: Video[] = [
  {
    id: "1",
    title: "Perfecting the Cover Drive",
    thumbnail: "https://picsum.photos/400/225?19",
    duration: "5:32",
    uploadDate: "2025-06-10",
    category: "batting",
    coachId: "1"
  },
  {
    id: "2",
    title: "Mastering the Yorker",
    thumbnail: "https://picsum.photos/400/225?20",
    duration: "8:15",
    uploadDate: "2025-06-09",
    category: "bowling",
    coachId: "2"
  },
  {
    id: "3",
    title: "Slip Catching Drills",
    thumbnail: "https://picsum.photos/400/225?21",
    duration: "6:42",
    uploadDate: "2025-06-08",
    category: "fielding",
    coachId: "4"
  },
  {
    id: "4",
    title: "Cricket-Specific Fitness",
    thumbnail: "https://picsum.photos/400/225?22",
    duration: "12:30",
    uploadDate: "2025-06-07",
    category: "fitness",
    coachId: "5"
  }
];

export const getEventColor = (type: Event['type']) => {
  switch (type) {
    case 'session': return '#4e73df';
    case 'match': return '#e74a3b';
    case 'workshop': return '#f6c23e';
    case 'meeting': return '#36b9cc';
    default: return '#858796';
  }
};
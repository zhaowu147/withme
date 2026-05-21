export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  image?: string; // base64 data URL
}

export type AIGender = 'female' | 'male';

export interface UserSettings {
  aiGender: AIGender;
  aiName: string;
  setupComplete: boolean;
  userAvatar?: string; // base64 data URL
  chatBackground?: string; // base64 data URL
}

export interface ChatState {
  messages: Message[];
  affinity: number; // 0-100
  affinityLevel: number; // 1-5
  settings: UserSettings;
}

export const AFFINITY_LEVELS = [
  { level: 1, name: '見知らぬ人', min: 0, description: '初対面。礼儀的だが距離がある。' },
  { level: 2, name: '知り合い', min: 20, description: '少し打ち解けた。時折冗談を言う。' },
  { level: 3, name: '友人', min: 40, description: '気を許している。本音で話す。' },
  { level: 4, name: '親友', min: 60, description: '深く理解し合っている。沈黙も心地よい。' },
  { level: 5, name: '特別な存在', min: 80, description: '言葉にならない絆がある。' },
] as const;

export function getAffinityLevel(affinity: number) {
  for (let i = AFFINITY_LEVELS.length - 1; i >= 0; i--) {
    if (affinity >= AFFINITY_LEVELS[i].min) return AFFINITY_LEVELS[i];
  }
  return AFFINITY_LEVELS[0];
}

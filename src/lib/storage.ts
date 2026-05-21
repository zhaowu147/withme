import type { ChatState, Message, UserSettings } from './types';

const STORAGE_KEY = 'withme-chat';

const defaultSettings: UserSettings = {
  aiGender: 'female',
  aiName: '',
  setupComplete: false,
};

const defaultState: ChatState = {
  messages: [],
  affinity: 0,
  affinityLevel: 1,
  settings: defaultSettings,
};

export function loadChatState(): ChatState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as ChatState;
    // migrate old states without settings
    if (!parsed.settings) {
      parsed.settings = defaultSettings;
    }
    return parsed;
  } catch {
    return defaultState;
  }
}

export function saveChatState(state: ChatState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full or unavailable
  }
}

export function updateSettings(state: ChatState, settings: Partial<UserSettings>): ChatState {
  return {
    ...state,
    settings: { ...state.settings, ...settings },
  };
}

export function addMessage(state: ChatState, msg: Message): ChatState {
  return {
    ...state,
    messages: [...state.messages, msg],
  };
}

export function updateAffinity(state: ChatState, delta: number): ChatState {
  const newAffinity = Math.max(0, Math.min(100, state.affinity + delta));
  const level = newAffinity >= 80 ? 5 : newAffinity >= 60 ? 4 : newAffinity >= 40 ? 3 : newAffinity >= 20 ? 2 : 1;
  return {
    ...state,
    affinity: newAffinity,
    affinityLevel: level,
  };
}

export function clearChatState(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getAvatarUrl(gender: 'female' | 'male'): string {
  return gender === 'female' ? '/avatar-female.jpg' : '/avatar-male.jpg';
}

export type CharacterId = 'Arun' | 'Ravi' | 'Priya' | 'Meena' | 'Suresh';

export interface CharacterProfile {
  id: CharacterId;
  nameTamil: string;
  age: number;
  role: string;
  personality: string;
  delivery: string;
  voiceName: 'Puck' | 'Charon' | 'Kore' | 'Zephyr' | 'Fenrir';
  voiceDirection: string;
  avatarColor: string;
  accentColor: string;
  collegeTrait: string;
  favoriteSpot: string;
  sampleLine: {
    tamil: string;
    transliteration: string;
    meaning: string;
  };
}

export interface DialogueLine {
  id: string;
  speaker: CharacterId;
  tamilText: string;
  transliteration: string;
  englishMeaning: string;
  emotion: string;
  voiceDirection?: string;
  vocalBursts?: string;
  audioUrl?: string; // base64 or blob URL
  audioDuration?: number;
}

export interface Episode {
  id: string;
  title: string;
  titleTamil: string;
  eraContext: string;
  synopsis: string;
  cassetteSide: 'A' | 'B';
  lines: DialogueLine[];
}

export interface AudioPlayState {
  isPlaying: boolean;
  activeLineIndex: number;
  progress: number;
  isBuffering: boolean;
  tapeEffectEnabled: boolean;
  ambienceEnabled: boolean;
  playbackSpeed: number;
}

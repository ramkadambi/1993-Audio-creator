import React from 'react';
import { Volume2, Mic, MapPin, Sparkles, BookOpen, Star } from 'lucide-react';
import { CharacterProfile } from '../types';

interface CharacterCardProps {
  character: CharacterProfile;
  isActive: boolean;
  isPlaying: boolean;
  onAudition: (char: CharacterProfile) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  isActive,
  isPlaying,
  onAudition,
}) => {
  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
        isActive
          ? 'bg-stone-900 border-amber-500 shadow-xl shadow-amber-500/10 scale-[1.01]'
          : 'bg-stone-900/70 border-stone-800 hover:border-stone-700 hover:bg-stone-900'
      }`}
    >
      {/* Top Banner with Character Avatar & Metadata */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${character.avatarColor} flex items-center justify-center font-bold text-lg text-white shadow-md border border-white/20`}
            >
              {character.nameTamil.slice(0, 1)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {character.id}
                </h3>
                <span className="text-amber-400 font-serif font-semibold text-sm">
                  ({character.nameTamil})
                </span>
              </div>
              <span className="text-xs font-mono text-stone-400">
                Age {character.age} • Madras '93 Student
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-950 text-amber-400 border border-stone-800">
            Voice: {character.voiceName}
          </span>
        </div>

        {/* Personality & Delivery */}
        <div className="space-y-2 mb-4 text-xs">
          <div className="bg-stone-950/70 p-2.5 rounded-lg border border-stone-800/80">
            <span className="text-stone-400 font-mono text-[10px] uppercase block mb-0.5">
              PERSONALITY & ROLE:
            </span>
            <span className="text-stone-200 font-medium">{character.role}</span>
          </div>

          <div className="bg-stone-950/70 p-2.5 rounded-lg border border-stone-800/80">
            <span className="text-stone-400 font-mono text-[10px] uppercase block mb-0.5">
              VOCAL DELIVERY STYLE:
            </span>
            <span className="text-stone-300 italic">{character.delivery}</span>
          </div>
        </div>

        {/* 1993 Chennai College Trait & Hangout */}
        <div className="space-y-1.5 text-[11px] text-stone-400 mb-4 border-t border-stone-800/80 pt-3">
          <div className="flex items-center space-x-1.5 text-stone-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{character.collegeTrait}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-stone-400">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{character.favoriteSpot}</span>
          </div>
        </div>

        {/* Sample Signature Line */}
        <div className="bg-amber-950/20 border border-amber-900/30 rounded-xl p-3 mb-4">
          <div className="text-[10px] font-mono text-amber-500 uppercase font-semibold mb-1">
            SIGNATURE LINE:
          </div>
          <div className="text-sm font-semibold text-amber-100 font-serif leading-snug">
            "{character.sampleLine.tamil}"
          </div>
          <div className="text-[11px] text-stone-400 italic mt-1">
            {character.sampleLine.meaning}
          </div>
        </div>
      </div>

      {/* Audition Button */}
      <button
        onClick={() => onAudition(character)}
        className={`w-full py-2.5 px-3 rounded-xl font-mono text-xs font-bold uppercase flex items-center justify-center space-x-2 transition-all active:scale-98 shadow-md ${
          isActive && isPlaying
            ? 'bg-amber-400 text-stone-950 border border-amber-300 animate-pulse'
            : 'bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700 hover:text-white'
        }`}
      >
        <Volume2 className="w-3.5 h-3.5" />
        <span>
          {isActive && isPlaying ? 'AUDITIONING VOICE…' : `AUDITION ${character.id.toUpperCase()}`}
        </span>
      </button>
    </div>
  );
};

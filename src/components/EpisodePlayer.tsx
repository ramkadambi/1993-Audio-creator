import React from 'react';
import { Play, Pause, Volume2, Sparkles, Disc, MessageSquare, Clock, MapPin } from 'lucide-react';
import { Episode, DialogueLine } from '../types';
import { CHARACTERS } from '../data/characters';

interface EpisodePlayerProps {
  episode: Episode;
  activeLineIndex: number;
  isPlaying: boolean;
  onPlayFullEpisode: () => void;
  onPlaySingleLine: (index: number) => void;
  onSelectEpisode: (epId: string) => void;
  allEpisodes: Episode[];
}

export const EpisodePlayer: React.FC<EpisodePlayerProps> = ({
  episode,
  activeLineIndex,
  isPlaying,
  onPlayFullEpisode,
  onPlaySingleLine,
  onSelectEpisode,
  allEpisodes,
}) => {
  return (
    <div className="space-y-6">
      {/* Episode Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {allEpisodes.map((ep, idx) => {
          const isSelected = ep.id === episode.id;
          return (
            <button
              key={ep.id}
              onClick={() => onSelectEpisode(ep.id)}
              className={`px-4 py-2.5 rounded-xl text-left border shrink-0 transition-all ${
                isSelected
                  ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-md'
                  : 'bg-stone-900/80 border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-850'
              }`}
            >
              <div className="text-[10px] font-mono uppercase tracking-wider text-amber-500/80">
                SIDE {ep.cassetteSide} • EPISODE {idx + 1}
              </div>
              <div className="font-bold text-sm tracking-tight text-white">{ep.title}</div>
            </button>
          );
        })}
      </div>

      {/* Episode Header Card */}
      <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-mono text-amber-500">
              <Disc className="w-3.5 h-3.5" />
              <span>MADRAS COLLEGE AUDIO CASSETTE • SIDE {episode.cassetteSide}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {episode.title}
            </h2>
            <div className="text-amber-300 font-serif text-lg">{episode.titleTamil}</div>
            <div className="text-xs font-mono text-stone-400 flex items-center space-x-1.5 pt-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{episode.eraContext}</span>
            </div>
            <p className="text-xs text-stone-300 max-w-2xl pt-2 leading-relaxed">
              {episode.synopsis}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onPlayFullEpisode}
              className={`px-6 py-3 rounded-xl font-bold font-mono text-xs uppercase flex items-center justify-center space-x-2 transition-transform active:scale-95 shadow-xl ${
                isPlaying
                  ? 'bg-amber-400 text-stone-950 border border-amber-300'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-900/40'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>PAUSE PLAYBACK</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>PLAY FULL EPISODE ({episode.lines.length} LINES)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Script Dialogue Lines List */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1 text-xs font-mono text-stone-400">
          <span className="uppercase tracking-wider font-bold text-amber-400">
            DIALOGUE SCRIPT ({episode.lines.length} LINES)
          </span>
          <span>Click any line to audition solo</span>
        </div>

        {episode.lines.map((line, idx) => {
          const char = CHARACTERS[line.speaker] || CHARACTERS.Arun;
          const isLineActive = activeLineIndex === idx && isPlaying;

          return (
            <div
              key={line.id}
              onClick={() => onPlaySingleLine(idx)}
              className={`cursor-pointer rounded-2xl border p-4 sm:p-5 transition-all duration-200 relative ${
                isLineActive
                  ? 'bg-stone-900 border-amber-400 shadow-xl shadow-amber-500/10 scale-[1.008]'
                  : 'bg-stone-900/70 border-stone-800/80 hover:bg-stone-900 hover:border-stone-700'
              }`}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Character Avatar */}
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${char.avatarColor} shrink-0 flex items-center justify-center text-white font-bold text-base shadow border border-white/20`}
                >
                  {char.nameTamil.slice(0, 1)}
                </div>

                {/* Dialogue Content */}
                <div className="flex-1 min-w-0">
                  {/* Speaker & Emotion Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-sm sm:text-base tracking-tight">
                        {line.speaker}
                      </span>
                      <span className="text-amber-400 font-serif text-xs font-medium">
                        ({char.nameTamil})
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-950 text-stone-400 border border-stone-800">
                        {line.emotion}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {line.vocalBursts && (
                        <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                          {line.vocalBursts}
                        </span>
                      )}
                      <button
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                          isLineActive
                            ? 'bg-amber-400 text-stone-950'
                            : 'bg-stone-800 text-stone-300 hover:bg-amber-500 hover:text-stone-950'
                        }`}
                        title="Play line"
                      >
                        {isLineActive ? (
                          <Pause className="w-3.5 h-3.5 fill-current" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Tamil Script */}
                  <div className="text-lg sm:text-xl font-bold text-stone-100 font-serif leading-relaxed tracking-wide">
                    "{line.tamilText}"
                  </div>

                  {/* Transliteration */}
                  <div className="text-xs font-mono text-stone-400 mt-1.5 italic">
                    {line.transliteration}
                  </div>

                  {/* English Meaning */}
                  <div className="text-xs text-stone-300 mt-1 font-sans">
                    Meaning: <span className="text-amber-200/90 font-medium">{line.englishMeaning}</span>
                  </div>

                  {/* Voice Direction Hint (if active) */}
                  {isLineActive && line.voiceDirection && (
                    <div className="mt-3 pt-2 border-t border-stone-800 text-[11px] font-mono text-amber-400/90 flex items-start space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>Delivery direction: {line.voiceDirection}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

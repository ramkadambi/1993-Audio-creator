import React from 'react';
import { Play, Pause, Square, RotateCcw, Volume2, Sparkles, Radio } from 'lucide-react';
import { playCassetteClick } from '../utils/audioPlayer';

interface CassetteDeckProps {
  isPlaying: boolean;
  onPlayToggle: () => void;
  onStop: () => void;
  onRewind: () => void;
  currentTitle: string;
  currentSpeaker?: string;
  side: 'A' | 'B';
  tapeFilterEnabled: boolean;
  onToggleTapeFilter: () => void;
  ambienceEnabled: boolean;
  onToggleAmbience: () => void;
  vuLeft?: number;
  vuRight?: number;
}

export const CassetteDeck: React.FC<CassetteDeckProps> = ({
  isPlaying,
  onPlayToggle,
  onStop,
  onRewind,
  currentTitle,
  currentSpeaker,
  side,
  tapeFilterEnabled,
  onToggleTapeFilter,
  ambienceEnabled,
  onToggleAmbience,
  vuLeft = 0,
  vuRight = 0,
}) => {
  const handlePlayClick = () => {
    playCassetteClick('click');
    onPlayToggle();
  };

  const handleStopClick = () => {
    playCassetteClick('clack');
    onStop();
  };

  const handleRewindClick = () => {
    playCassetteClick('rewind');
    onRewind();
  };

  return (
    <div className="relative bg-gradient-to-b from-stone-900 via-stone-850 to-stone-950 p-5 rounded-2xl border-2 border-stone-700 shadow-2xl overflow-hidden font-sans">
      {/* Top brushed metal trim & screws */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-800 text-xs text-stone-400">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-stone-700 border border-stone-600 shadow-inner" />
          <span className="font-mono uppercase tracking-widest text-amber-500 font-bold">
            MADRAS STEREO TAPE DECK • MODEL 1993
          </span>
        </div>
        <div className="flex items-center space-x-3 text-[11px] font-mono">
          <span className="text-stone-400">TYPE I (NORMAL BIAS)</span>
          <div className="w-2.5 h-2.5 rounded-full bg-stone-700 border border-stone-600 shadow-inner" />
        </div>
      </div>

      {/* Cassette Tape Visualizer */}
      <div className="relative mx-auto max-w-lg bg-gradient-to-br from-amber-950/80 via-stone-900 to-amber-900/60 p-4 rounded-xl border border-amber-800/50 shadow-inner">
        {/* Cassette Shell */}
        <div className="relative bg-stone-900/90 rounded-lg p-3 border border-stone-700/80 shadow-md">
          {/* Label Header */}
          <div className="bg-amber-100 text-stone-900 rounded p-2 mb-3 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-amber-900">
                SIDE {side} • CHENNAI 1993 MIXX
              </div>
              <div className="font-bold text-sm tracking-tight text-stone-950 line-clamp-1 font-mono">
                {currentTitle}
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-1.5 py-0.5 bg-red-700 text-white font-mono text-[10px] font-bold rounded">
                60 MIN
              </span>
              {currentSpeaker && (
                <div className="text-[10px] font-medium text-amber-900 mt-0.5">
                  VOICE: <span className="font-bold">{currentSpeaker}</span>
                </div>
              )}
            </div>
          </div>

          {/* Cassette Window & Reels */}
          <div className="relative bg-stone-950/90 border border-stone-800 rounded-md p-3 flex items-center justify-between overflow-hidden">
            {/* Magnetic tape window background */}
            <div className="absolute inset-0 bg-stone-950/95 flex items-center justify-center">
              <div className="w-full h-8 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 opacity-60" />
            </div>

            {/* Left Reel */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-14 h-14 rounded-full border-4 border-stone-600 bg-stone-800 flex items-center justify-center transition-transform ${
                  isPlaying ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: '3s' }}
              >
                <div className="w-8 h-8 rounded-full border-2 border-stone-500 bg-stone-900 flex items-center justify-center relative">
                  {/* Spokes / teeth */}
                  <div className="absolute w-1 h-3 bg-stone-400 top-0 rounded-sm" />
                  <div className="absolute w-1 h-3 bg-stone-400 bottom-0 rounded-sm" />
                  <div className="absolute w-3 h-1 bg-stone-400 left-0 rounded-sm" />
                  <div className="absolute w-3 h-1 bg-stone-400 right-0 rounded-sm" />
                  <div className="w-3 h-3 rounded-full bg-stone-950 border border-stone-700" />
                </div>
              </div>
              <span className="text-[9px] font-mono text-stone-500 mt-1">FEED</span>
            </div>

            {/* Center tape bridge with counter */}
            <div className="relative z-10 flex flex-col items-center space-y-1">
              <div className="px-2 py-0.5 bg-black/90 rounded border border-stone-700 font-mono text-xs text-amber-400 tracking-widest font-bold">
                {isPlaying ? 'REC ▶ PLAY' : 'PAUSED'}
              </div>
              <div className="w-24 h-1.5 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 rounded-full" />
              <div className="text-[9px] font-mono text-stone-400">
                1993 HIGH-FIDELITY TAPE
              </div>
            </div>

            {/* Right Reel */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-14 h-14 rounded-full border-4 border-stone-600 bg-stone-800 flex items-center justify-center transition-transform ${
                  isPlaying ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: '3s' }}
              >
                <div className="w-8 h-8 rounded-full border-2 border-stone-500 bg-stone-900 flex items-center justify-center relative">
                  <div className="absolute w-1 h-3 bg-stone-400 top-0 rounded-sm" />
                  <div className="absolute w-1 h-3 bg-stone-400 bottom-0 rounded-sm" />
                  <div className="absolute w-3 h-1 bg-stone-400 left-0 rounded-sm" />
                  <div className="absolute w-3 h-1 bg-stone-400 right-0 rounded-sm" />
                  <div className="w-3 h-3 rounded-full bg-stone-950 border border-stone-700" />
                </div>
              </div>
              <span className="text-[9px] font-mono text-stone-500 mt-1">TAKEUP</span>
            </div>
          </div>
        </div>
      </div>

      {/* VU Meters and Sound Knobs */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center bg-stone-900/60 p-3 rounded-xl border border-stone-800">
        {/* Analog VU Bar Indicators */}
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-stone-400 w-4 font-bold">L</span>
            <div className="flex-1 bg-stone-950 h-3 rounded overflow-hidden flex border border-stone-800 p-0.5 gap-0.5">
              {[...Array(12)].map((_, i) => {
                const threshold = (i + 1) / 12;
                const active = isPlaying && (vuLeft || 0.4) >= threshold * 0.7;
                const isRed = i >= 10;
                const isYellow = i >= 8 && i < 10;
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-xs transition-colors duration-75 ${
                      active
                        ? isRed
                          ? 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]'
                          : isYellow
                          ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]'
                          : 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                        : 'bg-stone-800'
                    }`}
                  />
                );
              })}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-stone-400 w-4 font-bold">R</span>
            <div className="flex-1 bg-stone-950 h-3 rounded overflow-hidden flex border border-stone-800 p-0.5 gap-0.5">
              {[...Array(12)].map((_, i) => {
                const threshold = (i + 1) / 12;
                const active = isPlaying && (vuRight || 0.4) >= threshold * 0.7;
                const isRed = i >= 10;
                const isYellow = i >= 8 && i < 10;
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-xs transition-colors duration-75 ${
                      active
                        ? isRed
                          ? 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]'
                          : isYellow
                          ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]'
                          : 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                        : 'bg-stone-800'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Vintage Toggles */}
        <div className="flex items-center justify-end space-x-2 text-xs">
          <button
            onClick={onToggleTapeFilter}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center space-x-1.5 font-mono text-[11px] transition-all ${
              tapeFilterEnabled
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                : 'bg-stone-800/60 text-stone-400 border-stone-700 hover:text-stone-300'
            }`}
            title="Applies authentic 1993 ferric cassette tape frequency rolloff & warm saturation"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>TAPE FILTER</span>
          </button>

          <button
            onClick={onToggleAmbience}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center space-x-1.5 font-mono text-[11px] transition-all ${
              ambienceEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                : 'bg-stone-800/60 text-stone-400 border-stone-700 hover:text-stone-300'
            }`}
            title="Toggle subtle 1993 Madras College tea stall ambient background murmurs"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>'93 AMBIENCE</span>
          </button>
        </div>
      </div>

      {/* Mechanical Push-Buttons */}
      <div className="mt-4 flex items-center justify-center space-x-3 pt-2">
        <button
          onClick={handleRewindClick}
          className="px-3.5 py-2.5 rounded-xl bg-gradient-to-b from-stone-700 to-stone-850 hover:from-stone-600 hover:to-stone-800 active:translate-y-0.5 border border-stone-600 text-stone-200 flex items-center space-x-1.5 shadow-md transition-transform"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="font-mono text-xs font-bold uppercase">REWIND</span>
        </button>

        <button
          onClick={handlePlayClick}
          className={`px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase flex items-center space-x-2 shadow-lg transition-all active:translate-y-0.5 ${
            isPlaying
              ? 'bg-amber-500 text-stone-950 border border-amber-400 shadow-amber-500/30'
              : 'bg-gradient-to-b from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white border border-emerald-500'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>PAUSE</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>PLAY</span>
            </>
          )}
        </button>

        <button
          onClick={handleStopClick}
          className="px-3.5 py-2.5 rounded-xl bg-gradient-to-b from-stone-700 to-stone-850 hover:from-stone-600 hover:to-stone-800 active:translate-y-0.5 border border-stone-600 text-stone-200 flex items-center space-x-1.5 shadow-md transition-transform"
        >
          <Square className="w-4 h-4 fill-current" />
          <span className="font-mono text-xs font-bold uppercase">STOP</span>
        </button>
      </div>
    </div>
  );
};

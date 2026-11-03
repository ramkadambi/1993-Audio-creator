import React, { useState, useEffect, useRef } from 'react';
import {
  CassetteTape,
  Radio,
  Sparkles,
  Users,
  Compass,
  Volume2,
  FileText,
  Disc,
  Play,
  CheckCircle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { CassetteDeck } from './components/CassetteDeck';
import { TestBench } from './components/TestBench';
import { EpisodePlayer } from './components/EpisodePlayer';
import { CharacterCard } from './components/CharacterCard';
import { ScriptDirector } from './components/ScriptDirector';
import { SlangGuide } from './components/SlangGuide';
import { CHARACTERS } from './data/characters';
import { EPISODES } from './data/episodes';
import { CharacterProfile, Episode } from './types';
import {
  playWavBase64,
  playSpeechSynthesisFallback,
  playCassetteClick,
  toggleMadrasAmbience,
} from './utils/audioPlayer';

type ActiveTab = 'testbench' | 'episodes' | 'characters' | 'director' | 'guide';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('testbench');
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [activeLineIndex, setActiveLineIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState<string>('Arun');
  const [tapeFilterEnabled, setTapeFilterEnabled] = useState(true);
  const [ambienceEnabled, setAmbienceEnabled] = useState(false);
  const [vuLevels, setVuLevels] = useState<{ left: number; right: number }>({ left: 0, right: 0 });

  // Currently playing active audio handler
  const currentAudioStopper = useRef<(() => void) | null>(null);
  const vuIntervalRef = useRef<any>(null);
  const isSequencePlaying = useRef(false);

  const currentEpisode = EPISODES[currentEpisodeIndex] || EPISODES[0];

  // Stop any ongoing playback
  const stopPlayback = () => {
    isSequencePlaying.current = false;
    if (currentAudioStopper.current) {
      try {
        currentAudioStopper.current();
      } catch {}
      currentAudioStopper.current = null;
    }
    if (vuIntervalRef.current) {
      clearInterval(vuIntervalRef.current);
      vuIntervalRef.current = null;
    }
    setIsPlaying(false);
    setVuLevels({ left: 0, right: 0 });
  };

  // Play a single line with Gemini TTS (or fallback)
  const playDialogueLine = async (
    speaker: string,
    text: string,
    style?: string,
    onEndedCallback?: () => void
  ) => {
    stopPlayback();
    playCassetteClick('click');
    setIsPlaying(true);
    setActiveSpeaker(speaker);

    try {
      const charConfig = CHARACTERS[speaker] || CHARACTERS.Arun;
      const res = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          speaker,
          text,
          customStyle: style || charConfig.voiceDirection,
          voiceNameOverride: charConfig.voiceName,
        }),
      });

      if (!res.ok) {
        throw new Error('TTS API error');
      }

      const data = await res.json();
      if (data.audioBase64) {
        // Character acoustic panning
        const panMap: Record<string, number> = {
          Arun: -0.3,
          Ravi: 0.35,
          Priya: -0.15,
          Meena: 0.15,
          Suresh: -0.5,
        };

        const result = await playWavBase64(data.audioBase64, {
          tapeFilter: tapeFilterEnabled,
          pan: panMap[speaker] || 0,
          onEnded: () => {
            setIsPlaying(false);
            if (vuIntervalRef.current) {
              clearInterval(vuIntervalRef.current);
            }
            setVuLevels({ left: 0, right: 0 });
            if (onEndedCallback) {
              onEndedCallback();
            }
          },
        });

        currentAudioStopper.current = result.stop;

        // Monitor VU levels
        if (vuIntervalRef.current) clearInterval(vuIntervalRef.current);
        vuIntervalRef.current = setInterval(() => {
          setVuLevels(result.getVisualLevels());
        }, 80);

        return;
      }
    } catch (err) {
      console.warn('Backend TTS failed, using browser speech synthesis fallback', err);
    }

    // Fallback playback
    const fallback = playSpeechSynthesisFallback(text, speaker, {
      onEnded: () => {
        setIsPlaying(false);
        if (vuIntervalRef.current) {
          clearInterval(vuIntervalRef.current);
        }
        setVuLevels({ left: 0, right: 0 });
        if (onEndedCallback) {
          onEndedCallback();
        }
      },
    });

    currentAudioStopper.current = fallback.stop;

    // Simulate VU levels for fallback
    if (vuIntervalRef.current) clearInterval(vuIntervalRef.current);
    vuIntervalRef.current = setInterval(() => {
      setVuLevels({
        left: 0.4 + Math.random() * 0.5,
        right: 0.4 + Math.random() * 0.5,
      });
    }, 100);
  };

  // Play full episode sequentially
  const playFullEpisode = () => {
    if (isPlaying) {
      stopPlayback();
      return;
    }

    isSequencePlaying.current = true;
    let index = 0;
    setActiveLineIndex(0);

    const playNext = () => {
      if (!isSequencePlaying.current || index >= currentEpisode.lines.length) {
        setIsPlaying(false);
        setActiveLineIndex(-1);
        isSequencePlaying.current = false;
        return;
      }

      const line = currentEpisode.lines[index];
      setActiveLineIndex(index);
      playDialogueLine(
        line.speaker,
        line.tamilText,
        line.voiceDirection,
        () => {
          index++;
          if (isSequencePlaying.current && index < currentEpisode.lines.length) {
            // natural conversational pause between college friends
            setTimeout(playNext, 450);
          } else {
            setIsPlaying(false);
            setActiveLineIndex(-1);
            isSequencePlaying.current = false;
          }
        }
      );
    };

    playNext();
  };

  // Play specific line in episode
  const handlePlaySingleLineInEpisode = (index: number) => {
    isSequencePlaying.current = false;
    setActiveLineIndex(index);
    const line = currentEpisode.lines[index];
    playDialogueLine(line.speaker, line.tamilText, line.voiceDirection, () => {
      setActiveLineIndex(-1);
    });
  };

  // Rewind
  const handleRewind = () => {
    stopPlayback();
    setActiveLineIndex(0);
    playCassetteClick('rewind');
  };

  // Toggle tape filter
  const handleToggleTapeFilter = () => {
    setTapeFilterEnabled((prev) => !prev);
  };

  // Toggle Madras ambience
  const handleToggleAmbience = () => {
    const next = !ambienceEnabled;
    setAmbienceEnabled(next);
    toggleMadrasAmbience(next);
  };

  // Audition character from card
  const handleAuditionCharacter = (char: CharacterProfile) => {
    playDialogueLine(char.id, char.sampleLine.tamil, char.voiceDirection);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-amber-950/40 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Top Heritage Header Bar */}
      <header className="border-b border-stone-800 bg-stone-950/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white shadow-lg border border-amber-500/40">
              <CassetteTape className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-mono font-extrabold text-base tracking-wider text-amber-400 uppercase">
                  MADRAS '93
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                  TAMIL AUDIO STUDIO
                </span>
              </div>
              <p className="text-xs text-stone-400 font-serif">
                Colloquial 1993 Chennai College Voice Engine • Arun, Priya, Meena, Suresh & Ravi
              </p>
            </div>
          </div>

          {/* Quick Stats & 1993 Badge */}
          <div className="flex items-center space-x-4 text-xs font-mono text-stone-400">
            <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-stone-900 border border-stone-800">
              <Radio className="w-3.5 h-3.5 text-amber-500" />
              <span>COLLEGE CANTEEN • 1993</span>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-stone-900 border border-stone-800 text-stone-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>GEMINI 3.8 FLASH TTS</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center space-x-1 overflow-x-auto scrollbar-none pt-1">
          <button
            onClick={() => setActiveTab('testbench')}
            className={`px-4 py-2.5 font-mono text-xs font-bold uppercase border-b-2 whitespace-nowrap transition-colors flex items-center space-x-2 ${
              activeTab === 'testbench'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-900/50'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>TEST 1 & 2 (ARUN & RAVI)</span>
          </button>

          <button
            onClick={() => setActiveTab('episodes')}
            className={`px-4 py-2.5 font-mono text-xs font-bold uppercase border-b-2 whitespace-nowrap transition-colors flex items-center space-x-2 ${
              activeTab === 'episodes'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-900/50'
            }`}
          >
            <Disc className="w-3.5 h-3.5" />
            <span>CASSETTE EPISODES</span>
          </button>

          <button
            onClick={() => setActiveTab('characters')}
            className={`px-4 py-2.5 font-mono text-xs font-bold uppercase border-b-2 whitespace-nowrap transition-colors flex items-center space-x-2 ${
              activeTab === 'characters'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-900/50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>5 CHARACTER VOICES</span>
          </button>

          <button
            onClick={() => setActiveTab('director')}
            className={`px-4 py-2.5 font-mono text-xs font-bold uppercase border-b-2 whitespace-nowrap transition-colors flex items-center space-x-2 ${
              activeTab === 'director'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-900/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>SCRIPT DIRECTOR & SLANG BANK</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2.5 font-mono text-xs font-bold uppercase border-b-2 whitespace-nowrap transition-colors flex items-center space-x-2 ${
              activeTab === 'guide'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-900/50'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>1993 MADRAS LINGUISTIC GUIDE</span>
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full space-y-6">
        {/* Top Sticky/Featured Cassette Tape Player */}
        <CassetteDeck
          isPlaying={isPlaying}
          onPlayToggle={() => {
            if (isPlaying) {
              stopPlayback();
            } else {
              playFullEpisode();
            }
          }}
          onStop={stopPlayback}
          onRewind={handleRewind}
          currentTitle={
            activeTab === 'testbench'
              ? `TEST BENCH • ${activeSpeaker.toUpperCase()}`
              : currentEpisode.title
          }
          currentSpeaker={activeSpeaker}
          side={currentEpisode.cassetteSide}
          tapeFilterEnabled={tapeFilterEnabled}
          onToggleTapeFilter={handleToggleTapeFilter}
          ambienceEnabled={ambienceEnabled}
          onToggleAmbience={handleToggleAmbience}
          vuLeft={vuLevels.left}
          vuRight={vuLevels.right}
        />

        {/* Tab Views */}
        {activeTab === 'testbench' && (
          <TestBench
            onPlayDialogueLine={(spk, txt, sty) => playDialogueLine(spk, txt, sty)}
            activeSpeaker={activeSpeaker}
            isPlaying={isPlaying}
          />
        )}

        {activeTab === 'episodes' && (
          <EpisodePlayer
            episode={currentEpisode}
            activeLineIndex={activeLineIndex}
            isPlaying={isPlaying}
            onPlayFullEpisode={playFullEpisode}
            onPlaySingleLine={handlePlaySingleLineInEpisode}
            onSelectEpisode={(epId) => {
              const idx = EPISODES.findIndex((e) => e.id === epId);
              if (idx !== -1) {
                stopPlayback();
                setCurrentEpisodeIndex(idx);
                setActiveLineIndex(-1);
              }
            }}
            allEpisodes={EPISODES}
          />
        )}

        {activeTab === 'characters' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 shadow-xl">
              <div className="flex items-center space-x-2 text-xs font-mono text-amber-500 font-bold uppercase mb-2">
                <Users className="w-4 h-4" />
                <span>5 DISTINCT CHARACTER VOICES • 1993 MADRAS COLLEGE</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Consistent Character Personas Across All Episodes
              </h2>
              <p className="text-stone-300 text-sm mt-1 max-w-3xl">
                Each friend has an established voice personality, distinct Gemini TTS configuration, emotional delivery traits, and signature 1993 Madras college habits. Click "Audition Voice" to test each character's authentic delivery.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {(Object.keys(CHARACTERS) as (keyof typeof CHARACTERS)[]).map((cKey) => {
                const char = CHARACTERS[cKey];
                return (
                  <CharacterCard
                    key={char.id}
                    character={char}
                    isActive={activeSpeaker === char.id}
                    isPlaying={isPlaying && activeSpeaker === char.id}
                    onAudition={handleAuditionCharacter}
                  />
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'director' && (
          <ScriptDirector
            onPlayLine={(spk, txt, sty) => playDialogueLine(spk, txt, sty)}
            isPlaying={isPlaying}
            activeSpeaker={activeSpeaker}
          />
        )}

        {activeTab === 'guide' && <SlangGuide />}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-800 bg-stone-950 py-6 text-center text-xs text-stone-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            MADRAS 1993 TAMIL AUDIO DRAMA STUDIO • CHENNAI COLLEGE VOICES
          </div>
          <div className="text-stone-400">
            Powered by Gemini 3.8 Flash TTS & Web Audio API
          </div>
        </div>
      </footer>
    </div>
  );
}

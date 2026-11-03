import React, { useState } from 'react';
import { Volume2, Play, CheckCircle2, Info, Sparkles, User, Mic, Clock, ArrowRight } from 'lucide-react';
import { CHARACTERS } from '../data/characters';
import { playWavBase64, playSpeechSynthesisFallback } from '../utils/audioPlayer';

interface TestBenchProps {
  onPlayDialogueLine: (speaker: string, text: string, style: string) => void;
  activeSpeaker?: string;
  isPlaying?: boolean;
}

export const TestBench: React.FC<TestBenchProps> = ({
  onPlayDialogueLine,
  activeSpeaker,
  isPlaying,
}) => {
  const [test1Status, setTest1Status] = useState<'idle' | 'generating' | 'ready'>('idle');
  const [test2Status, setTest2Status] = useState<'idle' | 'generating' | 'ready'>('idle');

  const arun = CHARACTERS.Arun;
  const ravi = CHARACTERS.Ravi;

  const test1Text = 'டேய், நாளைக்கு சண்டேடா… அஞ்சு பேரும் எங்கயாவது போலாம்டா!';
  const test1Style =
    'Young male, approximately 20 years old. Educated middle-class Chennai college student in 1993. Natural Madras Tamil, casual conversation with friends. Friendly, spontaneous and slightly excited. Speak quickly but clearly. Avoid formal Tamil, exaggerated slang, Sri Lankan Tamil pronunciation and newsreader-style delivery.';

  const test2Text = 'நான் வர்றேன். எட்டு மணிக்கு.';
  const test2Style =
    'Young male, approximately 20 years old. Chennai college student in 1993. Natural colloquial Madras Tamil. Relaxed, matter-of-fact, slightly mischievous. He is not particularly excited; he says it casually, as though eight o’clock is the most obvious thing in the world.';

  const handleRunTest1 = () => {
    setTest1Status('generating');
    onPlayDialogueLine('Arun', test1Text, test1Style);
    setTimeout(() => setTest1Status('ready'), 600);
  };

  const handleRunTest2 = () => {
    setTest2Status('generating');
    onPlayDialogueLine('Ravi', test2Text, test2Style);
    setTimeout(() => setTest2Status('ready'), 600);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-900/40 via-stone-900 to-amber-950/50 border border-amber-800/40 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-mono font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COLLEGE 1993 MANDATORY CHARACTER TESTS</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Test Bench: Arun & Ravi Colloquial Madras Delivery
            </h2>
            <p className="text-sm text-stone-300 mt-1 max-w-2xl">
              Evaluating authentic 1993 middle-class Chennai college Tamil — emphasizing casual teasing, spontaneous energy, unhurried deadpan delivery, and zero formal/Sri Lankan inflection.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                handleRunTest1();
                setTimeout(() => handleRunTest2(), 3500);
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase font-mono rounded-xl shadow-lg transition-transform active:scale-95 flex items-center space-x-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>PLAY BOTH (CONVERSATION)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test 1: Arun */}
        <div className="bg-stone-900/90 rounded-2xl border-2 border-amber-600/40 p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            {/* Header */}
            <div className="flex items-start justify-between border-b border-stone-800 pb-4 mb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
                  TEST 1 • ARUN
                </span>
                <h3 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2">
                  <span>{arun.nameTamil}</span>
                  <span className="text-xs font-mono font-normal text-stone-400">
                    ({arun.role})
                  </span>
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-amber-400 bg-stone-950 px-2 py-1 rounded border border-stone-800">
                  Voice: {arun.voiceName} (Youthful Male)
                </span>
              </div>
            </div>

            {/* Tamil Dialogue Box */}
            <div className="bg-stone-950 p-4 rounded-xl border border-amber-900/50 mb-4">
              <div className="text-xs font-mono uppercase text-amber-500/80 mb-1 flex items-center justify-between">
                <span>TAMIL DIALOGUE</span>
                <span className="text-[10px] text-stone-500">Spontaneous & Excited</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-amber-100 font-serif tracking-wide leading-relaxed">
                "{test1Text}"
              </p>
              <div className="mt-2 text-xs font-mono text-stone-400">
                Phonetic: <span className="text-stone-300 italic">{arun.sampleLine.transliteration}</span>
              </div>
              <div className="mt-1 text-xs text-stone-400">
                Meaning: <span className="text-stone-200">"Hey guys, tomorrow is Sunday man… all five of us should go somewhere!"</span>
              </div>
            </div>

            {/* Voice Direction Specification */}
            <div className="bg-stone-850/80 p-3.5 rounded-xl border border-stone-800 text-xs space-y-2 mb-4">
              <div className="font-mono text-amber-400 font-bold flex items-center space-x-1.5">
                <Mic className="w-3.5 h-3.5" />
                <span>OFFICIAL VOICE DIRECTION SPECIFICATION</span>
              </div>
              <p className="text-stone-300 leading-relaxed italic">
                "{test1Style}"
              </p>
            </div>

            {/* Linguistic Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-400 mb-6 bg-stone-950/60 p-3 rounded-xl border border-stone-800/80">
              <div className="text-amber-400/90 font-mono font-bold text-[11px]">
                KEY 1993 CHENNAI CHARACTERISTICS:
              </div>
              <ul className="space-y-1 list-disc list-inside text-stone-300 text-[11px]">
                <li><strong className="text-amber-300">டேய் (Dei) / போலாம்டா (-da suffix):</strong> Authentic middle-class friendly banter between college boys.</li>
                <li><strong className="text-amber-300">அஞ்சு பேரும் (Anju perum):</strong> Natural colloquial counting instead of formal "ஐந்து பேரும்".</li>
                <li><strong className="text-amber-300">சண்டேடா (Sunday-da):</strong> 90s Madras college mix of English days with Tamil vocative particles.</li>
              </ul>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleRunTest1}
            className={`w-full py-3 px-4 rounded-xl font-bold font-mono text-xs uppercase flex items-center justify-center space-x-2 transition-all shadow-lg active:scale-98 ${
              activeSpeaker === 'Arun' && isPlaying
                ? 'bg-amber-400 text-stone-950 border border-amber-300 animate-pulse'
                : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>
              {activeSpeaker === 'Arun' && isPlaying
                ? 'NOW PLAYING ARUN TEST 1…'
                : 'PLAY TEST 1 (ARUN ENERGETIC DELIVERY)'}
            </span>
          </button>
        </div>

        {/* Test 2: Ravi */}
        <div className="bg-stone-900/90 rounded-2xl border-2 border-emerald-600/40 p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            {/* Header */}
            <div className="flex items-start justify-between border-b border-stone-800 pb-4 mb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                  TEST 2 • RAVI
                </span>
                <h3 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2">
                  <span>{ravi.nameTamil}</span>
                  <span className="text-xs font-mono font-normal text-stone-400">
                    ({ravi.role})
                  </span>
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-emerald-400 bg-stone-950 px-2 py-1 rounded border border-stone-800">
                  Voice: {ravi.voiceName} (Steady Male)
                </span>
              </div>
            </div>

            {/* Tamil Dialogue Box */}
            <div className="bg-stone-950 p-4 rounded-xl border border-emerald-900/50 mb-4">
              <div className="text-xs font-mono uppercase text-emerald-500/80 mb-1 flex items-center justify-between">
                <span>TAMIL DIALOGUE</span>
                <span className="text-[10px] text-stone-500">Unhurried & Matter-of-Fact</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-emerald-100 font-serif tracking-wide leading-relaxed">
                "{test2Text}"
              </p>
              <div className="mt-2 text-xs font-mono text-stone-400">
                Phonetic: <span className="text-stone-300 italic">{ravi.sampleLine.transliteration}</span>
              </div>
              <div className="mt-1 text-xs text-stone-400">
                Meaning: <span className="text-stone-200">"I'm coming. At eight o'clock."</span>
              </div>
            </div>

            {/* Voice Direction Specification */}
            <div className="bg-stone-850/80 p-3.5 rounded-xl border border-stone-800 text-xs space-y-2 mb-4">
              <div className="font-mono text-emerald-400 font-bold flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>OFFICIAL VOICE DIRECTION SPECIFICATION</span>
              </div>
              <p className="text-stone-300 leading-relaxed italic">
                "{test2Style}"
              </p>
            </div>

            {/* Linguistic Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-400 mb-6 bg-stone-950/60 p-3 rounded-xl border border-stone-800/80">
              <div className="text-emerald-400/90 font-mono font-bold text-[11px]">
                KEY 1993 CHENNAI CHARACTERISTICS:
              </div>
              <ul className="space-y-1 list-disc list-inside text-stone-300 text-[11px]">
                <li><strong className="text-emerald-300">நான் வர்றேன் (Naan varren):</strong> True spoken Madras contraction (never "நான் வருகிறேன்").</li>
                <li><strong className="text-emerald-300">எட்டு மணிக்கு (Ettu manikku):</strong> Delivered with supreme nonchalance, no hype or hurry.</li>
                <li><strong className="text-emerald-300">Composed timing:</strong> Slight pause before "எட்டு மணிக்கு" as though it’s the universal law of Madras time.</li>
              </ul>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleRunTest2}
            className={`w-full py-3 px-4 rounded-xl font-bold font-mono text-xs uppercase flex items-center justify-center space-x-2 transition-all shadow-lg active:scale-98 ${
              activeSpeaker === 'Ravi' && isPlaying
                ? 'bg-emerald-400 text-stone-950 border border-emerald-300 animate-pulse'
                : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>
              {activeSpeaker === 'Ravi' && isPlaying
                ? 'NOW PLAYING RAVI TEST 2…'
                : 'PLAY TEST 2 (RAVI UNHURRIED DELIVERY)'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

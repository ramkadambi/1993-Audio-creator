import React, { useState } from 'react';
import { Sparkles, Mic, Wand2, Volume2, Plus, Copy, Check, MessageSquare, Play } from 'lucide-react';
import { CharacterId, DialogueLine } from '../types';
import { CHARACTERS } from '../data/characters';

interface ScriptDirectorProps {
  onPlayLine: (speaker: string, text: string, style: string) => void;
  isPlaying: boolean;
  activeSpeaker?: string;
}

const CHENNAI_SLANG_PRESETS = [
  { label: 'டேய் (Dei)', text: 'டேய், ' },
  { label: 'மச்சி (Machi)', text: 'மச்சி ' },
  { label: 'சும்மா இருடா (Summa iruda)', text: 'சும்மா இருடா! ' },
  { label: 'கலாய்க்காதடி (Kalaaikkaadhadi)', text: 'கலாய்க்காதடி! ' },
  { label: 'செம சீன் (Sema scene)', text: 'செம சீன்டா! ' },
  { label: 'பில்டப்பு (Buildup)', text: 'என்னடா பில்டப்பு? ' },
  { label: 'வுடுடா (Vududa)', text: 'வுடுடா பாத்துக்கலாம்! ' },
  { label: 'எட்டு மணிக்கு (8 o clock)', text: 'எட்டு மணிக்கு. ' },
  { label: 'டீக்கடை (Tea stall)', text: 'டீக்கடைல ஒரு கட்டிங் சொல்லு. ' },
  { label: 'பல்லவன் பஸ் (Pallavan bus)', text: 'பல்லவன் 29C பஸ்ல ஏறுவோம். ' },
];

const EMOTION_PRESETS = [
  'Casual teasing, friendly banter',
  'Friendly, mischievous & spontaneous excitement',
  'Relaxed, matter-of-fact, unhurried deadpan',
  'Sarcastic, sharp, witty eye-roll',
  'Earnest, practical caution & exam panic',
  'Impatient, theatrical, loud cinema fan',
];

const VOCAL_BURSTS = [
  { label: '<laugh>', tag: '<laugh> ' },
  { label: '<sigh>', tag: '<sigh> ' },
  { label: '<breath>', tag: '<breath> ' },
  { label: '|yeah|', tag: '|yeah| ' },
  { label: '|mhm|', tag: '|mhm| ' },
];

export const ScriptDirector: React.FC<ScriptDirectorProps> = ({
  onPlayLine,
  isPlaying,
  activeSpeaker,
}) => {
  const [selectedSpeaker, setSelectedSpeaker] = useState<CharacterId>('Arun');
  const [tamilText, setTamilText] = useState('டேய், நாளைக்கு சண்டேடா… அஞ்சு பேரும் எங்கயாவது போலாம்டா!');
  const [emotion, setEmotion] = useState('Friendly, mischievous & spontaneous excitement');
  const [customStyle, setCustomStyle] = useState(CHARACTERS.Arun.voiceDirection);
  
  // AI Scene Writer state
  const [sceneTopic, setSceneTopic] = useState('Bessy beach roasted corn and AR Rahman cassette discussion');
  const [isGeneratingScene, setIsGeneratingScene] = useState(false);
  const [generatedScene, setGeneratedScene] = useState<DialogueLine[]>([]);

  // Refine Tamil state
  const [rawTextToRefine, setRawTextToRefine] = useState('Let us go to Woodlands drive-in tomorrow and drink coffee.');
  const [isRefining, setIsRefining] = useState(false);
  const [refinedResult, setRefinedResult] = useState<any>(null);

  const handleSpeakerChange = (charId: CharacterId) => {
    setSelectedSpeaker(charId);
    setCustomStyle(CHARACTERS[charId].voiceDirection);
  };

  const handleInsertSlang = (phrase: string) => {
    setTamilText((prev) => prev + phrase);
  };

  const handleInsertVocalBurst = (tag: string) => {
    setTamilText((prev) => tag + prev);
  };

  const handlePlayCurrent = () => {
    onPlayLine(selectedSpeaker, tamilText, customStyle);
  };

  // Call backend to generate full scene
  const handleGenerateAIScene = async () => {
    try {
      setIsGeneratingScene(true);
      const res = await fetch('/api/dialogue/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: sceneTopic,
          tone: 'Authentic 1993 Chennai college banter',
        }),
      });
      const data = await res.json();
      if (data.dialogue && Array.isArray(data.dialogue)) {
        setGeneratedScene(data.dialogue);
      }
    } catch (err) {
      console.error('Scene generation failed', err);
    } finally {
      setIsGeneratingScene(false);
    }
  };

  // Call backend to convert to 1993 Madras Tamil
  const handleRefineTamil = async () => {
    try {
      setIsRefining(true);
      const res = await fetch('/api/dialogue/refine-tamil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputQuery: rawTextToRefine,
          speaker: selectedSpeaker,
          emotion,
        }),
      });
      const data = await res.json();
      setRefinedResult(data);
      if (data.tamilText) {
        setTamilText(data.tamilText);
      }
      if (data.voiceDirection) {
        setCustomStyle(data.voiceDirection);
      }
    } catch (err) {
      console.error('Refining failed', err);
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Script Director Studio */}
      <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-800 pb-4 mb-6 gap-3">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-amber-500 font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MADRAS '93 VOICE STUDIO & SCRIPT DIRECTOR</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              Custom Dialogue Voice Synthesizer
            </h2>
          </div>
          <button
            onClick={handlePlayCurrent}
            className={`px-5 py-2.5 rounded-xl font-bold font-mono text-xs uppercase flex items-center space-x-2 shadow-lg transition-transform active:scale-95 ${
              activeSpeaker === selectedSpeaker && isPlaying
                ? 'bg-amber-400 text-stone-950 border border-amber-300 animate-pulse'
                : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>SYNTHESIZE {selectedSpeaker.toUpperCase()} VOICE</span>
          </button>
        </div>

        {/* Character Selector Pills */}
        <div className="mb-5">
          <label className="block text-xs font-mono text-stone-400 uppercase font-semibold mb-2">
            SELECT CHARACTER TO SPEAK:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(Object.keys(CHARACTERS) as CharacterId[]).map((cId) => {
              const char = CHARACTERS[cId];
              const isSelected = selectedSpeaker === cId;
              return (
                <button
                  key={cId}
                  onClick={() => handleSpeakerChange(cId)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-md'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                  }`}
                >
                  <div className="font-bold text-sm text-white flex items-center justify-between">
                    <span>{char.id}</span>
                    <span className="text-xs font-serif text-amber-400">{char.nameTamil}</span>
                  </div>
                  <div className="text-[10px] text-stone-400 font-mono mt-0.5 truncate">
                    {char.voiceName} • {char.role.split(',')[0]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Slang Quick Insert Bar */}
        <div className="mb-5 bg-stone-950 p-3.5 rounded-xl border border-stone-800">
          <div className="flex items-center justify-between text-xs font-mono text-amber-500/90 mb-2 font-semibold">
            <span>1993 CHENNAI COLLEGE SLANG BANK (CLICK TO INSERT):</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CHENNAI_SLANG_PRESETS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleInsertSlang(item.text)}
                className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 hover:border-amber-500/50 text-stone-300 hover:text-amber-300 text-xs font-serif transition-colors"
              >
                + {item.label}
              </button>
            ))}
          </div>

          {/* Vocal Bursts Bar */}
          <div className="mt-2.5 pt-2.5 border-t border-stone-800/80 flex items-center space-x-2 text-xs font-mono">
            <span className="text-stone-400 text-[11px]">Vocal tags:</span>
            {VOCAL_BURSTS.map((b, i) => (
              <button
                key={i}
                onClick={() => handleInsertVocalBurst(b.tag)}
                className="px-2 py-0.5 bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 rounded border border-amber-800/60 text-[10px]"
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tamil Dialogue Input */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono text-stone-300 uppercase font-semibold">
                TAMIL SCRIPT DIALOGUE:
              </label>
              <span className="text-[11px] font-mono text-stone-500">
                Natural colloquial Madras Tamil (no formal/Sri Lankan)
              </span>
            </div>
            <textarea
              rows={3}
              value={tamilText}
              onChange={(e) => setTamilText(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3.5 text-stone-100 font-serif text-lg focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
              placeholder="டைப் செய்யவும்..."
            />
          </div>

          {/* Emotion & Delivery Direction */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-stone-300 uppercase font-semibold mb-1.5">
                EMOTIONAL TONE:
              </label>
              <select
                value={emotion}
                onChange={(e) => setEmotion(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
              >
                {EMOTION_PRESETS.map((em, i) => (
                  <option key={i} value={em}>
                    {em}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-stone-300 uppercase font-semibold mb-1.5">
                TTS VOICE DIRECTION PROMPT:
              </label>
              <input
                type="text"
                value={customStyle}
                onChange={(e) => setCustomStyle(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-300 focus:outline-none focus:border-amber-500"
                placeholder="Young male, 20yo, Chennai college student in 1993..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2 AI Assistant Tools: Refine to 1993 Tamil & Generate New Scene */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tool 1: Refine English/Formal into 1993 Madras Tamil */}
        <div className="bg-stone-900 rounded-2xl border border-stone-800 p-5 shadow-xl">
          <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 font-bold uppercase mb-2">
            <Wand2 className="w-3.5 h-3.5" />
            <span>COLLOQUIAL MADRAS TAMIL ADAPTER</span>
          </div>
          <h3 className="text-base font-bold text-white mb-2">
            Convert Idea or Formal Tamil into 1993 Chennai College Slang
          </h3>
          <p className="text-xs text-stone-400 mb-3">
            Type any idea in English or formal Tamil. Gemini will adapt it into genuine 1993 Madras college banter matching {selectedSpeaker}’s personality.
          </p>

          <input
            type="text"
            value={rawTextToRefine}
            onChange={(e) => setRawTextToRefine(e.target.value)}
            className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-200 mb-3 focus:outline-none focus:border-amber-500"
            placeholder="e.g. Let's go to Woodlands Drive-in or Bessy beach tomorrow..."
          />

          <button
            onClick={handleRefineTamil}
            disabled={isRefining}
            className="w-full py-2.5 px-4 rounded-xl font-bold font-mono text-xs uppercase bg-stone-800 hover:bg-stone-750 text-amber-300 border border-stone-700 flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRefining ? 'CONVERTING TO MADRAS TAMIL…' : 'CONVERT TO 1993 CHENNAI TAMIL'}</span>
          </button>

          {refinedResult && (
            <div className="mt-4 p-3 bg-stone-950 rounded-xl border border-amber-900/50 space-y-2 text-xs">
              <div className="text-sm font-bold text-amber-200 font-serif">
                "{refinedResult.tamilText}"
              </div>
              <div className="text-stone-400 font-mono text-[11px] italic">
                {refinedResult.transliteration}
              </div>
              <div className="text-stone-300 text-[11px]">
                {refinedResult.englishMeaning}
              </div>
              {refinedResult.slangNotes && (
                <div className="text-amber-400/90 text-[10px] font-mono pt-1 border-t border-stone-800">
                  Idioms: {refinedResult.slangNotes}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tool 2: Generate New 1993 Banter Scene */}
        <div className="bg-stone-900 rounded-2xl border border-stone-800 p-5 shadow-xl">
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 font-bold uppercase mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>1993 COLLEGE SCENE WRITER</span>
          </div>
          <h3 className="text-base font-bold text-white mb-2">
            Generate Multi-Character Madras Banter
          </h3>
          <p className="text-xs text-stone-400 mb-3">
            Prompt a scenario (e.g., Woodlands Drive-in coffee, Bus Day, bunking classes, cassette buying) to generate a brand-new multi-line scene.
          </p>

          <input
            type="text"
            value={sceneTopic}
            onChange={(e) => setSceneTopic(e.target.value)}
            className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-200 mb-3 focus:outline-none focus:border-emerald-500"
            placeholder="Scenario in Madras 1993..."
          />

          <button
            onClick={handleGenerateAIScene}
            disabled={isGeneratingScene}
            className="w-full py-2.5 px-4 rounded-xl font-bold font-mono text-xs uppercase bg-stone-800 hover:bg-stone-750 text-emerald-300 border border-stone-700 flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>{isGeneratingScene ? 'WRITING MADRAS SCENE…' : 'GENERATE 1993 SCENE'}</span>
          </button>

          {generatedScene.length > 0 && (
            <div className="mt-4 space-y-2 max-h-56 overflow-y-auto pr-1">
              {generatedScene.map((line, idx) => (
                <div
                  key={idx}
                  onClick={() => onPlayLine(line.speaker, line.tamilText, line.voiceDirection || '')}
                  className="p-2.5 bg-stone-950 rounded-lg border border-stone-800 hover:border-emerald-500/50 cursor-pointer text-xs transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-[11px]">{line.speaker}:</span>
                    <span className="text-[10px] font-mono text-emerald-400">{line.emotion}</span>
                  </div>
                  <div className="font-serif text-stone-200 text-sm">"{line.tamilText}"</div>
                  <div className="text-[10px] text-stone-400 italic mt-0.5">{line.englishMeaning}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

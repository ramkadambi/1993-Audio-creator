import React from 'react';
import { BookOpen, CheckCircle2, XCircle, Coffee, Compass, Radio, Film } from 'lucide-react';

export const SlangGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 shadow-xl">
        <div className="flex items-center space-x-2 text-xs font-mono text-amber-500 font-bold uppercase mb-2">
          <BookOpen className="w-4 h-4" />
          <span>LINGUISTIC & CULTURAL BLUEPRINT • MADRAS 1993</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          How Middle-Class College Friends Spoke in Madras, 1993
        </h2>
        <p className="text-stone-300 text-sm mt-1 max-w-3xl leading-relaxed">
          The year is 1993. AR Rahman's music from <em>Roja</em> and <em>Thiruda Thiruda</em> blares from cassette shops on Mount Road. College students take Pallavan bus 29C, hang out at Woodlands Drive-in or the Bessy beach sea wall, and converse in an educated, witty, colloquial Madras Tamil that is distinct from both literary Tamil and Sri Lankan dialects.
        </p>
      </div>

      {/* Comparison Grid: Natural Madras vs Formal vs Sri Lankan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Madras 1993 (What we want) */}
        <div className="bg-stone-900 rounded-2xl border-2 border-emerald-600/50 p-5 shadow-lg">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold font-mono text-xs uppercase mb-3">
            <CheckCircle2 className="w-4 h-4" />
            <span>NATURAL MADRAS TAMIL (1993)</span>
          </div>
          <div className="space-y-3 text-xs text-stone-300">
            <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-900/50">
              <span className="font-bold text-emerald-200 block text-sm font-serif">
                "டேய், நாளைக்கு சண்டேடா… அஞ்சு பேரும் எங்கயாவது போலாம்டா!"
              </span>
              <span className="text-stone-400 text-[11px] block mt-1">
                Natural contractions (அஞ்சு, போலாம்டா), English weekday with Tamil vocative, energetic friend cadence.
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-900/50">
              <span className="font-bold text-emerald-200 block text-sm font-serif">
                "நான் வர்றேன். எட்டு மணிக்கு."
              </span>
              <span className="text-stone-400 text-[11px] block mt-1">
                Contraction 'வர்றேன்' instead of bookish 'வருகிறேன்'. Supreme deadpan understatement.
              </span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-stone-300 pt-1 text-[11px]">
              <li>Educated middle-class college student idiom</li>
              <li>Light natural English loanwords (Sunday, bus, ticket)</li>
              <li>Affectionate teasing & casual sarcasm</li>
            </ul>
          </div>
        </div>

        {/* Formal Literary Tamil (Avoid) */}
        <div className="bg-stone-900 rounded-2xl border border-red-900/40 p-5 shadow-lg">
          <div className="flex items-center space-x-2 text-red-400 font-bold font-mono text-xs uppercase mb-3">
            <XCircle className="w-4 h-4" />
            <span>FORMAL / TEXTBOOK TAMIL (AVOID)</span>
          </div>
          <div className="space-y-3 text-xs text-stone-400">
            <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-900/30">
              <span className="font-medium text-red-300 block text-sm font-serif line-through">
                "நாம் நாளை ஞாயிற்றுக்கிழமை எங்காவது செல்வோம்."
              </span>
              <span className="text-stone-500 text-[11px] block mt-1">
                Sounds like an AIR newsreader or 1950s textbook. No real 1993 20yo student ever said this.
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-900/30">
              <span className="font-medium text-red-300 block text-sm font-serif line-through">
                "நான் எட்டு மணிக்கு வருகிறேன்."
              </span>
              <span className="text-stone-500 text-[11px] block mt-1">
                Unnatural formal suffix 'வருகிறேன்' destroys the casual college vibe.
              </span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-stone-400 pt-1 text-[11px]">
              <li>Bookish grammar and high-register vocabulary</li>
              <li>Flat newsreader or oratorical rhythm</li>
              <li>Zero conversational warmth or humor</li>
            </ul>
          </div>
        </div>

        {/* Sri Lankan Tamil (Avoid for Chennai) */}
        <div className="bg-stone-900 rounded-2xl border border-amber-900/40 p-5 shadow-lg">
          <div className="flex items-center space-x-2 text-amber-400 font-bold font-mono text-xs uppercase mb-3">
            <XCircle className="w-4 h-4" />
            <span>SRI LANKAN TAMIL (WRONG REGION)</span>
          </div>
          <div className="space-y-3 text-xs text-stone-400">
            <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/30">
              <span className="font-medium text-amber-300 block text-sm font-serif line-through">
                "நாளைக்கு எங்கயாவது போவமா? நீங்க வாறீங்களா?"
              </span>
              <span className="text-stone-500 text-[11px] block mt-1">
                Distinct Jaffna/Batticaloa vowel shifts ('வாறன்', 'கதைக்கிறன்') and honorific patterns that do not belong to Madras.
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/30">
              <span className="font-medium text-amber-300 block text-sm font-serif line-through">
                "நான் எட்டு மணிக்கு வாறன்."
              </span>
              <span className="text-stone-500 text-[11px] block mt-1">
                'வாறன்' vs Chennai 'வர்றேன்'.
              </span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-stone-400 pt-1 text-[11px]">
              <li>Different phonetic contours and retroflex usage</li>
              <li>Different regional slang and honorifics</li>
              <li>Breaks the Madras 1993 college setting</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 1993 Madras College Cultural Anchors */}
      <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <Compass className="w-4 h-4 text-amber-400" />
          <span>The World of Madras, 1993</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
            <div className="flex items-center space-x-2 text-amber-400 font-bold font-mono mb-1.5">
              <Coffee className="w-3.5 h-3.5" />
              <span>WOODLANDS DRIVE-IN</span>
            </div>
            <p className="text-stone-300 leading-relaxed text-[11px]">
              On Cathedral Road. The quintessential student hangout where five friends would park scooters or bicycles and share one plate of channa bhatura and cutting coffee.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold font-mono mb-1.5">
              <Film className="w-3.5 h-3.5" />
              <span>DEVI THEATRE & CASSETTES</span>
            </div>
            <p className="text-stone-300 leading-relaxed text-[11px]">
              Mount Road's cinematic hub. In 1993, AR Rahman's Thiruda Thiruda and Gentleman audio cassettes rewound with Reynolds ball pens were the talk of every college canteen.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold font-mono mb-1.5">
              <Radio className="w-3.5 h-3.5" />
              <span>PALLAVAN BUS ROUTE 29C</span>
            </div>
            <p className="text-stone-300 leading-relaxed text-[11px]">
              From Perambur to Besant Nagar. Traveling on the footboard with wind in your hair, college bag slung on one shoulder, shouting to friends at signal stops.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
            <div className="flex items-center space-x-2 text-fuchsia-400 font-bold font-mono mb-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>PHYSICS LAB RECORDS</span>
            </div>
            <p className="text-stone-300 leading-relaxed text-[11px]">
              Camlin geometry sets, Parker Quink blue ink, tracing paper, and copying circuit diagrams at 2 AM before practical exams while eating homemade murukku.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

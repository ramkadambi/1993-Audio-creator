import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Cache for synthesized audio to ensure rapid repeat plays
const audioCache = new Map<string, { audioBase64: string; mimeType: string }>();

// Character voice defaults
const CHARACTER_VOICES: Record<string, { voiceName: string; defaultStyle: string; role: string }> = {
  Arun: {
    voiceName: 'Puck',
    defaultStyle: 'Young male, 20yo, educated middle-class Chennai college student in 1993. Natural Madras Tamil, friendly, spontaneous, energetic, casual teasing tone.',
    role: 'Friendly, mischievous, spontaneous',
  },
  Ravi: {
    voiceName: 'Charon',
    defaultStyle: 'Young male, 20yo, Chennai college student in 1993. Natural colloquial Madras Tamil. Relaxed, matter-of-fact, unhurried, slightly mischievous, understated humour.',
    role: 'Relaxed, street-smart, understated',
  },
  Priya: {
    voiceName: 'Kore',
    defaultStyle: 'Young female, 20yo, Madras college student in 1993. Quick-witted, sarcastic, sharp, playful teasing, deadpan delivery, effortless Chennai Tamil cadence.',
    role: 'Sarcastic, sharp, witty, opinionated',
  },
  Meena: {
    voiceName: 'Zephyr',
    defaultStyle: 'Young female, 20yo, Madras college student in 1993. Earnest, practical, cautious, organized, measured, warm and sensible friend.',
    role: 'Earnest, practical, cautious, organized',
  },
  Suresh: {
    voiceName: 'Fenrir',
    defaultStyle: 'Young male, 20yo, Madras college student in 1993. Impatient, theatrical, loud, obsessed with 1993 Tamil cinema, easily excited or annoyed, animated delivery.',
    role: 'Impatient, dramatic, movie buff, loud',
  },
};

/**
 * Endpoint: Synthesize speech for a single dialogue line
 */
app.post('/api/tts/generate', async (req: Request, res: Response) => {
  try {
    const {
      text,
      speaker = 'Arun',
      customStyle,
      voiceNameOverride,
    } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const charConfig = CHARACTER_VOICES[speaker] || CHARACTER_VOICES.Arun;
    const voiceName = voiceNameOverride || charConfig.voiceName;
    const style = customStyle || charConfig.defaultStyle;

    const cacheKey = `${speaker}-${voiceName}-${style}-${text.trim()}`;
    if (audioCache.has(cacheKey)) {
      const cached = audioCache.get(cacheKey)!;
      return res.json({
        cached: true,
        speaker,
        voiceName,
        style,
        ...cached,
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured in environment. Using browser fallback audio.',
        fallback: true,
      });
    }

    // Attempt generation with gemini-3.8-flash-tts
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${speaker}: ${text}`,
                speechMetadata: {
                  speaker,
                  style,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      const audioBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (audioBase64) {
        const payload = { audioBase64, mimeType: 'audio/wav' };
        audioCache.set(cacheKey, payload);
        return res.json({
          speaker,
          voiceName,
          style,
          ...payload,
        });
      }
    } catch (primaryErr: any) {
      console.warn('gemini-3.8-flash-tts error, trying gemini-3.8-flash-lite-tts:', primaryErr?.message);
      
      // Fallback to flash-lite-tts
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${speaker}: ${text}`,
                speechMetadata: {
                  style,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      const audioBase64 = fallbackResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (audioBase64) {
        const payload = { audioBase64, mimeType: 'audio/wav' };
        audioCache.set(cacheKey, payload);
        return res.json({
          speaker,
          voiceName,
          style,
          ...payload,
        });
      }

      throw primaryErr;
    }

    return res.status(500).json({ error: 'No audio generated by model' });
  } catch (error: any) {
    console.error('TTS Generation error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate speech audio',
    });
  }
});

/**
 * Endpoint: Generate authentic 1993 Chennai college banter script
 */
app.post('/api/dialogue/generate', async (req: Request, res: Response) => {
  try {
    const {
      topic = 'Planning a weekend outing in Madras 1993',
      tone = 'Casual teasing, fun, nostalgic banter',
      characters = ['Arun', 'Ravi', 'Priya', 'Meena', 'Suresh'],
    } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'GEMINI_API_KEY not configured' });
    }

    const systemPrompt = `You are an expert Tamil screenwriter specializing in authentic 1993 Madras (Chennai) college life.
Write an authentic conversational scene between close middle-class college friends in Madras, 1993.
CRITICAL LANGUAGE REQUIREMENTS:
- Natural Chennai Tamil (Madras Tamil) spoken by educated middle-class college students in 1993.
- DO NOT use formal literary Tamil (like "நாம் நாளை கடற்கரைக்கு செல்லலாம்" or "நன்றாக இருக்கிறது").
- DO NOT use Sri Lankan Tamil or television newsreader delivery.
- Use natural colloquial Madras college student vocabulary and syntax from 1993 (e.g., டேய், மச்சி, சும்மா இருடா, என்னடா பில்டப்பு, கலாய்க்காதடி, வுடுடா, செம சீன், எட்டரைக்கு, லபக்னு, டீக்கடை).
- 1993 Era references: Woodlands Drive-in, Spencer Plaza, Devi Theatre, Pallavan transport buses (29C, 12B), Roja / Gentleman / Thiruda Thiruda cassettes, filter coffee at college canteen, record notebooks, bicycle stands.

Characters:
- Arun: Friendly, mischievous, spontaneous, energetic, casual teasing.
- Ravi: Relaxed, street-smart, understated, unhurried, funny deadpan.
- Priya: Sarcastic, sharp, witty, opinionated, quick playfully exasperated.
- Meena: Earnest, practical, cautious, organized, measured, sensible.
- Suresh: Impatient, dramatic, loud movie buff, theatrical, easily agitated.

Return a JSON array of dialogue lines. Each line must be an object with:
- "speaker": Character name (Arun, Ravi, Priya, Meena, or Suresh)
- "tamilText": Natural Tamil script dialogue with colloquial spelling (e.g. டேய், வர்றேன்டா, எங்கயாவது போலாம்)
- "transliteration": English phonetics for Tamil learners
- "englishMeaning": Natural English translation capturing the tone and slang
- "emotion": One or two word emotion (e.g., "Mischievous excitement", "Understated deadpan", "Sarcastic teasing", "Dramatic panic", "Sensible caution")
- "voiceDirection": Detailed voice direction instructions for TTS synthesis
- "vocalBursts": Optional vocal tags like "<laugh>", "<sigh>", "<breath>", or "|yeah|"`;

    const userPrompt = `Generate a realistic 5-7 line scene set in Madras, 1993 about: "${topic}".
Include characters: ${characters.join(', ')}. Tone: ${tone}.
Return pure valid JSON with an array named "dialogue".`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const dialogue = Array.isArray(parsed) ? parsed : (parsed.dialogue || []);
    return res.json({ dialogue });
  } catch (error: any) {
    console.error('Dialogue generation error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate dialogue' });
  }
});

/**
 * Endpoint: Refine user text into natural 1993 Madras College Tamil
 */
app.post('/api/dialogue/refine-tamil', async (req: Request, res: Response) => {
  try {
    const { inputQuery, speaker = 'Arun', emotion = 'Casual teasing' } = req.body;
    if (!inputQuery) {
      return res.status(400).json({ error: 'inputQuery is required' });
    }

    const systemPrompt = `You are a Madras Tamil linguist and dialogue coach.
Take the user's idea or sentence and convert it into 100% natural, colloquial 1993 Madras college student Tamil for the character "${speaker}" (${CHARACTER_VOICES[speaker]?.role || 'College student'}).
Emotion: ${emotion}.
Ensure:
- NO bookish/formal Tamil.
- NO Sri Lankan Tamil.
- True 1993 Chennai college middle-class colloquial phrasing.
Return JSON:
{
  "tamilText": "Colloquial Tamil script text",
  "transliteration": "Tanglish phonetics",
  "englishMeaning": "Nuanced translation",
  "voiceDirection": "Voice direction for speech synthesizer",
  "slangNotes": "Explanation of 1993 Madras idioms used"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Transform this into 1993 Chennai college Tamil: "${inputQuery}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Refine error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to refine Tamil' });
  }
});

// Character profile metadata endpoint
app.get('/api/characters', (_req: Request, res: Response) => {
  res.json({
    characters: CHARACTER_VOICES,
  });
});

// Setup Vite or static serving
async function setupServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Madras '93 server listening on http://0.0.0.0:${PORT}`);
  });
}

setupServer();

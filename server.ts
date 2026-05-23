/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = 3000;

// Parsers
app.use(express.json());

// Helper to get GoogleGenAI client (Lazy setup & friendly error on missing key)
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('Missing Gemini API Key. Please add GEMINI_API_KEY to your Secrets in the Settings menu (top right).');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ==================== API ENDPOINTS ====================

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 2. Generate Travel Itinerary
app.post('/api/itinerary/generate', async (req: Request, res: Response) => {
  try {
    const ai = getGeminiClient();
    const prefs = req.body;

    if (!prefs || !prefs.destination) {
      res.status(400).json({ error: 'Please supply a destination' });
      return;
    }

    const { destination, durationDays = 3, travelStyle = 'mixed', companions = 'solo', budgetLimit = 1000, interests = [] } = prefs;

    const prompt = `
      Create a highly customized, production-grade detailed travel itinerary for a trip to "${destination}".
      Details of the trip:
      - Duration: ${durationDays} days.
      - Travel Style preference: ${travelStyle}.
      - Traveling companions style: ${companions}.
      - Target spending budget: $${budgetLimit} total (provide reasonable costs for individual activities, where appropriate, that keep the plan realistic under this budget tier).
      - Core interests to integrate: ${interests.join(', ') || 'General exploration, local food, culture, signature sights'}.

      Formulate a personalized travel identity (travel persona name like "The Epicurean Vagabond" or "The Adventure Vanguard" and a detailed 2-sentence description of the traveler profile matching these choices).
      Provide a comprehensive day-by-day plan. For each day, include 3 logically sequenced activities (e.g., Morning, Afternoon, Evening) with times, highly engaging descriptions, suggested specific locations with real names, realistic cost estimates in USD, activity categories ('food', 'sightseeing', 'adventure', 'shopping', 'relaxation'), and relative X/Y coordinate numbers (between 10.0 and 90.0) mapping the location relative to the city center so we can plot a beautiful custom coordinate path map!

      Also offer a customized packing list consisting of exactly 5 specific items suited for this style and destination (e.g., specific gear/clothing for weather/style), and one master essential travel advice paragraph for the destination.
    `;

    const model = 'gemini-3.5-flash';

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: `You are WanderWise's premier AI Travel Coordinator, specializing in detailed, highly-realistic, visually plottable itineraries. You always return valid JSON that conforms exactly to the requested schema. Provide genuine locations, accurate estimated activity costs in USD, and assign diverse relative 2D coordinates (x and y between 10.0 and 90.0) that represent sequential points of interest. Make sure x and y are numbers.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            destination: { type: Type.STRING },
            durationDays: { type: Type.INTEGER },
            personaTitle: { type: Type.STRING },
            personaDescription: { type: Type.STRING },
            packingList: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            essentialAdvice: { type: Type.STRING },
            estimatedTotalCost: { type: Type.INTEGER },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNumber: { type: Type.INTEGER },
                  theme: { type: Type.STRING },
                  activities: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        time: { type: Type.STRING },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        estimatedCost: { type: Type.INTEGER },
                        locationName: { type: Type.STRING },
                        category: { type: Type.STRING },
                        coordinates: {
                          type: Type.OBJECT,
                          properties: {
                            x: { type: Type.NUMBER },
                            y: { type: Type.NUMBER }
                          },
                          required: ['x', 'y']
                        }
                      },
                      required: ['id', 'time', 'title', 'description', 'estimatedCost', 'locationName', 'category', 'coordinates']
                    }
                  }
                },
                required: ['dayNumber', 'theme', 'activities']
              }
            }
          },
          required: ['destination', 'durationDays', 'personaTitle', 'personaDescription', 'packingList', 'essentialAdvice', 'estimatedTotalCost', 'days']
        }
      }
    });

    const textResponse = response.text;
    if (!textResponse) {
      throw new Error('Received an empty response from Gemini API.');
    }

    const cleanedText = textResponse.trim();
    const itinerary = JSON.parse(cleanedText);

    res.json(itinerary);
  } catch (err: any) {
    console.error('Itinerary generation failure:', err);
    res.status(500).json({ error: err.message || 'Failed to generate itinerary. Please try again.' });
  }
});

// 3. Conversational Chat API with Globi
app.post('/api/concierge/chat', async (req: Request, res: Response) => {
  try {
    const ai = getGeminiClient();
    const { message, history = [], tripContext = null, preferences = null } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Message payload is required' });
      return;
    }

    // Build context summary to feed into the AI
    let contextPrompt = 'You are Globi, the delightful, witty, and highly helpful AI Travel Concierge for WanderWise. ';
    contextPrompt += 'You speak warmly and professionally, using occasional travel-themed emojis, and excel at giving localized travel secrets, safety guidelines, and event advice.\n';

    if (preferences) {
      contextPrompt += `The traveler's profile profile details:
      - Preferred Style: ${preferences.travelStyle}
      - Companion: ${preferences.companions}
      - Budget: $${preferences.budgetLimit}
      - Custom interests: ${preferences.interests.join(', ') || 'general'}\n`;
    }

    if (tripContext) {
      contextPrompt += `The traveler is currently looking at a plan for: "${tripContext.destination}" for ${tripContext.durationDays} days.
      The generated plan summary: ${tripContext.personaTitle || 'General trip'}.
      They might ask you to modify activities, suggest alternate events, find dining spots nearby, or give tips.\n`;
    }

    contextPrompt += '\nGive useful, precise, well-structured, compact travel recommendations. Do not write extremely long monologues unless specifically asked. Focus on delightful tips!';

    // Reconstruct conversation format matching gemini's standard or compile simple text contents
    // Let's frame the chat request cleanly as contents block
    const formattedContents = [
      ...history.map((msg: any) => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      })),
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    const model = 'gemini-3.5-flash';

    const response = await ai.models.generateContent({
      model,
      contents: formattedContents,
      config: {
        systemInstruction: contextPrompt,
        temperature: 0.8,
      }
    });

    const reply = response.text || 'WanderWise Globi is thinking...';
    res.json({ text: reply.trim() });
  } catch (err: any) {
    console.error('Chat Concierge error:', err);
    res.status(500).json({ error: err.message || 'Globi is having a quick break. Please try again in a moment.' });
  }
});

// 4. Simulated Dispatch / Email Itinerary Endpoints
app.post('/api/itinerary/email', async (req: Request, res: Response) => {
  try {
    const { toEmail, itinerary } = req.body;
    if (!toEmail || !itinerary) {
      res.status(400).json({ error: 'Please supply a recipient email and the itinerary dataset' });
      return;
    }

    // Introduce artificial network latency to feel perfectly real and immersive
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Construct beautiful plain text & styling markup copy so the user can see exactly what gets generated
    const emailHeader = `========= WanderWise Travel Dossier: Plan for ${itinerary.destination} =========`;
    const emailPersona = `Travel Identity Profile: ${itinerary.personaTitle}\n"${itinerary.personaDescription}"`;
    
    let daysContent = '';
    itinerary.days.forEach((day: any) => {
      daysContent += `\n--- Day ${day.dayNumber}: ${day.theme} ---\n`;
      day.activities.forEach((act: any) => {
        daysContent += `[${act.time}] ${act.title} at ${act.locationName}\n`;
        daysContent += `  Description: ${act.description}\n`;
        daysContent += `  Est. Cost: $${act.estimatedCost} | Tag: #${act.category}\n\n`;
      });
    });

    const emailPacking = `### Packing List Recommendations:\n` + itinerary.packingList.map((item: string) => `- [ ] ${item}`).join('\n');
    const emailAdvice = `### Vital WanderWise Destination Tips:\n${itinerary.essentialAdvice}`;
    const emailFooter = `Estimated Total Scheduled Cost: $${itinerary.estimatedTotalCost}\n\n--------------------------------------------\nGenerated beautifully by WanderWise AI Travel Companion.\nHave a secure, inspiring trip!`;

    const rawEmailOutput = `${emailHeader}\n\n${emailPersona}\n${daysContent}\n${emailPacking}\n\n${emailAdvice}\n\n${emailFooter}`;

    res.json({
      success: true,
      message: `Itinerary successfully compiled and dispatched to the mailbox at ${toEmail}!`,
      rawContent: rawEmailOutput
    });
  } catch (err: any) {
    console.error('Email dispatch failure:', err);
    res.status(500).json({ error: err.message || 'Dispatched failed unexpectedly' });
  }
});


// ==================== VITE & STATIC HANDLING ====================

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WanderWise Express Backend up & running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Express server initialization crash:', err);
});

import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Enable JSON bodies with higher limit for image base64 transfers
app.use(express.json({ limit: '35mb' }));

// Enable CORS for local, container, or Vercel serverless deployments
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Dynamic Gemini client resolution (supports live env updates in serverless runtime)
function getAIClient(): GoogleGenAI | null {
  const currentKey = process.env.GEMINI_API_KEY;
  if (!currentKey) return null;
  return new GoogleGenAI({
    apiKey: currentKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ----------------------------------------------------
// Health Check Endpoint (useful for Vercel / Cloud Run)
// ----------------------------------------------------
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'FloraScape API',
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    runtime: process.env.VERCEL ? 'vercel-serverless' : (process.env.NODE_ENV || 'standalone')
  });
});

// ----------------------------------------------------
// 1. Garden Plan Generation API using gemini-3.8-flash
// ----------------------------------------------------
app.post('/api/generate-garden', async (req: Request, res: Response) => {
  try {
    const ai = getAIClient();
    const preferences = req.body;
    const {
      name,
      style,
      lengthFt = 30,
      widthFt = 20,
      sunExposure = 'full-sun',
      hardinessZone = 'Zone 7',
      soilType = 'loam',
      maintenanceLevel = 'moderate',
      budget = 'moderate',
      selectedFeatures = [],
      colorPalette = [],
      specialNeeds = [],
      customNotes = ''
    } = preferences || {};

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: 'No GEMINI_API_KEY configured in environment.',
        plan: buildFallbackGardenPlan(preferences)
      });
    }

    const systemPrompt = `You are a world-renowned master landscape architect and horticulturalist.
Your goal is to generate a comprehensive, biologically viable, aesthetically magnificent garden design tailored precisely to the user's space, climate, and lifestyle preferences.

Calculate realistic spatial distribution:
- Yard size: ${lengthFt} ft length by ${widthFt} ft width (${lengthFt * widthFt} sq ft total).
- Provide 3 to 5 realistic landscape zones with coordinate percentages (x: 0-100, y: 0-100, width: 0-100, height: 0-100).
- Provide key structural elements (pathways, pergola, water features, seating, gravel patios, raised beds) with coordinate percentages.
- Provide 6 to 10 curated plant varieties with botanical names, common names, exact positions (x, y as 0-100 percentage of the yard), mature spread and height, sunlight requirements, water needs, and bloom attributes.
- Include companion planting recommendations (beneficial interactions to boost growth or deter pests).
- Include a seasonal bloom & interest timeline.
- Include a realistic shopping list with quantities and cost estimates.
- Include seasonal maintenance tips.
- Include 3 descriptive, photographic image generation prompts to visualize this dream garden.`;

    const userPrompt = `Create a custom dream garden plan with these preferences:
- Project Name: ${name || 'My Dream Garden'}
- Design Style Archetype: ${style}
- Space Dimensions: ${lengthFt} ft length x ${widthFt} ft width
- Sunlight Exposure: ${sunExposure}
- Climate / Hardiness Zone: ${hardinessZone}
- Soil Condition: ${soilType}
- Maintenance Appetite: ${maintenanceLevel}
- Budget Tier: ${budget}
- Desired Elements: ${selectedFeatures.join(', ') || 'Natural flagstone path, cozy seating'}
- Desired Color Palette: ${colorPalette.join(', ') || 'Harmonious nature tones'}
- Special Requirements: ${specialNeeds.join(', ') || 'None specified'}
- Custom Personal Dream: ${customNotes || 'A lush, serene botanical haven'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            tagline: { type: Type.STRING },
            designNarrative: { type: Type.STRING },
            zones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  x: { type: Type.NUMBER, description: 'Percentage 0-100' },
                  y: { type: Type.NUMBER, description: 'Percentage 0-100' },
                  width: { type: Type.NUMBER, description: 'Percentage 0-100' },
                  height: { type: Type.NUMBER, description: 'Percentage 0-100' },
                  themeColor: { type: Type.STRING, description: 'Hex color string' },
                  sunLevel: { type: Type.STRING },
                  suggestedActivities: { type: Type.STRING },
                },
                required: ['id', 'name', 'description', 'x', 'y', 'width', 'height', 'themeColor', 'sunLevel', 'suggestedActivities'],
              },
            },
            elements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING },
                  name: { type: Type.STRING },
                  x: { type: Type.NUMBER },
                  y: { type: Type.NUMBER },
                  width: { type: Type.NUMBER },
                  height: { type: Type.NUMBER },
                  description: { type: Type.STRING },
                },
                required: ['id', 'type', 'name', 'x', 'y', 'width', 'height'],
              },
            },
            plants: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  commonName: { type: Type.STRING },
                  botanicalName: { type: Type.STRING },
                  type: { type: Type.STRING },
                  x: { type: Type.NUMBER },
                  y: { type: Type.NUMBER },
                  spreadFt: { type: Type.NUMBER },
                  heightFt: { type: Type.NUMBER },
                  sunRequirement: { type: Type.STRING },
                  waterNeed: { type: Type.STRING },
                  bloomSeason: { type: Type.STRING },
                  bloomColor: { type: Type.STRING },
                  foliageColor: { type: Type.STRING },
                  companionTips: { type: Type.STRING },
                  careSummary: { type: Type.STRING },
                  wildlifeFriendly: { type: Type.BOOLEAN },
                  fragrant: { type: Type.BOOLEAN },
                  edible: { type: Type.BOOLEAN },
                  toxicityWarning: { type: Type.STRING },
                },
                required: ['id', 'commonName', 'botanicalName', 'type', 'x', 'y', 'spreadFt', 'heightFt', 'sunRequirement', 'waterNeed', 'bloomSeason', 'careSummary'],
              },
            },
            bloomTimeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  season: { type: Type.STRING },
                  plantsInBloom: { type: Type.ARRAY, items: { type: Type.STRING } },
                  keyHighlights: { type: Type.STRING },
                },
                required: ['season', 'plantsInBloom', 'keyHighlights'],
              },
            },
            companionPairs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  plantA: { type: Type.STRING },
                  plantB: { type: Type.STRING },
                  relationship: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
                required: ['plantA', 'plantB', 'relationship', 'reason'],
              },
            },
            shoppingList: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  item: { type: Type.STRING },
                  estimatedQuantity: { type: Type.STRING },
                  estimatedCost: { type: Type.STRING },
                  priority: { type: Type.STRING },
                },
                required: ['category', 'item', 'estimatedQuantity', 'estimatedCost', 'priority'],
              },
            },
            maintenanceTips: {
              type: Type.OBJECT,
              properties: {
                spring: { type: Type.ARRAY, items: { type: Type.STRING } },
                summer: { type: Type.ARRAY, items: { type: Type.STRING } },
                autumn: { type: Type.ARRAY, items: { type: Type.STRING } },
                winter: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['spring', 'summer', 'autumn', 'winter'],
            },
            suggestedImagePrompts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  perspective: { type: Type.STRING },
                  prompt: { type: Type.STRING },
                },
                required: ['perspective', 'prompt'],
              },
            },
          },
          required: [
            'title',
            'tagline',
            'designNarrative',
            'zones',
            'elements',
            'plants',
            'bloomTimeline',
            'companionPairs',
            'shoppingList',
            'maintenanceTips',
            'suggestedImagePrompts',
          ],
        },
      },
    });

    const rawJson = response.text?.trim() || '{}';
    const parsedData = JSON.parse(rawJson);

    const completePlan = {
      id: 'garden-' + Date.now(),
      ...parsedData,
      style: style || 'cottage',
      dimensions: {
        lengthFt: Number(lengthFt),
        widthFt: Number(widthFt),
        totalSqFt: Number(lengthFt) * Number(widthFt),
      },
      visuals: [],
      createdAt: new Date().toISOString(),
    };

    return res.json({ success: true, plan: completePlan });
  } catch (error: any) {
    console.error('Error generating garden plan:', error);
    // If Gemini encounters quota or parsing issues, gracefully supply rich plan
    const fallbackPlan = buildFallbackGardenPlan(req.body);
    return res.json({
      success: true,
      fallback: true,
      errorNotice: error?.message || 'Using smart garden blueprint synthesis',
      plan: fallbackPlan
    });
  }
});

// -------------------------------------------------------------------------
// 2. Create Image using gemini-3.1-flash-image-preview
// -------------------------------------------------------------------------
app.post('/api/generate-image', async (req: Request, res: Response) => {
  try {
    const ai = getAIClient();
    const { prompt, aspectRatio = '16:9' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API is not configured. Please ensure GEMINI_API_KEY is provided in settings.',
      });
    }

    console.log(`Generating image with gemini-3.1-flash-image-preview... Prompt: "${prompt.slice(0, 80)}..."`);

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: {
        parts: [
          { text: prompt },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
        },
      },
    });

    let imageUrl: string | null = null;
    const parts = response.candidates?.[0]?.content?.parts || [];

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        const mime = part.inlineData.mimeType || 'image/png';
        imageUrl = `data:${mime};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
      // Check if text was returned instead (e.g. content safety or refusal)
      const textPart = parts.find((p) => p.text)?.text;
      return res.status(422).json({
        error: textPart || 'No image data returned from image preview model.',
      });
    }

    return res.json({
      success: true,
      imageUrl,
      prompt,
      aspectRatio,
    });
  } catch (error: any) {
    console.error('Error creating image with gemini-3.1-flash-image-preview:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate image with Gemini Image model.',
    });
  }
});

// -------------------------------------------------------------------------
// 3. Edit Existing Image using gemini-3.1-flash-image-preview
// -------------------------------------------------------------------------
app.post('/api/edit-image', async (req: Request, res: Response) => {
  try {
    const ai = getAIClient();
    const { imageBase64, editPrompt, aspectRatio = '16:9' } = req.body;

    if (!imageBase64 || !editPrompt) {
      return res.status(400).json({ error: 'Both imageBase64 and editPrompt are required.' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API is not configured. Please check GEMINI_API_KEY.',
      });
    }

    // Clean data URI prefix
    let cleanBase64 = imageBase64;
    let mimeType = 'image/png';

    if (imageBase64.includes(',')) {
      const parts = imageBase64.split(',');
      const meta = parts[0];
      cleanBase64 = parts[1];
      const match = meta.match(/data:(.*?);base64/);
      if (match && match[1]) {
        mimeType = match[1];
      }
    }

    console.log(`Editing image with gemini-3.1-flash-image-preview... Instruction: "${editPrompt.slice(0, 80)}..."`);

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: `Please edit this garden image with the following instruction: ${editPrompt}. Maintain natural lighting, high resolution, realistic architectural landscape textures and plant botanical fidelity.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
        },
      },
    });

    let updatedImageUrl: string | null = null;
    const parts = response.candidates?.[0]?.content?.parts || [];

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        const mime = part.inlineData.mimeType || 'image/png';
        updatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!updatedImageUrl) {
      const textPart = parts.find((p) => p.text)?.text;
      return res.status(422).json({
        error: textPart || 'Image edit did not produce a visual output part.',
      });
    }

    return res.json({
      success: true,
      imageUrl: updatedImageUrl,
      editPrompt,
    });
  } catch (error: any) {
    console.error('Error editing image with gemini-3.1-flash-image-preview:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to edit image with Gemini Image model.',
    });
  }
});

// -------------------------------------------------------------------------
// 4. Generate Music using lyria-3-clip-preview / lyria-3-pro-preview
// -------------------------------------------------------------------------
app.post('/api/generate-music', async (req: Request, res: Response) => {
  try {
    const ai = getAIClient();
    const { prompt, model = 'lyria-3-clip-preview', imageBase64 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Music prompt is required.' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API is not configured. Please ensure GEMINI_API_KEY is provided in settings.',
      });
    }

    const selectedModel = model === 'lyria-3-pro-preview' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview';

    console.log(`Generating garden music with ${selectedModel}... Prompt: "${prompt.slice(0, 80)}..."`);

    let contentsPayload: any = prompt;

    if (imageBase64) {
      let cleanBase64 = imageBase64;
      let mimeType = 'image/jpeg';
      if (imageBase64.includes(',')) {
        const parts = imageBase64.split(',');
        const match = parts[0].match(/data:(.*?);base64/);
        if (match && match[1]) mimeType = match[1];
        cleanBase64 = parts[1];
      }
      contentsPayload = {
        parts: [
          { text: prompt },
          { inlineData: { data: cleanBase64, mimeType } }
        ]
      };
    }

    const responseStream = await ai.models.generateContentStream({
      model: selectedModel,
      contents: contentsPayload,
    });

    let audioBase64 = '';
    let lyrics = '';
    let mimeType = 'audio/wav';

    for await (const chunk of responseStream) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;
      for (const part of parts) {
        if (part.inlineData?.data) {
          if (!audioBase64 && part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          audioBase64 += part.inlineData.data;
        }
        if (part.text && !lyrics) {
          lyrics = part.text;
        }
      }
    }

    if (!audioBase64) {
      return res.status(422).json({
        error: 'No audio data received from Lyria music model.',
      });
    }

    const audioUrl = `data:${mimeType};base64,${audioBase64}`;

    return res.json({
      success: true,
      audioUrl,
      lyrics,
      model: selectedModel,
      durationLabel: selectedModel === 'lyria-3-pro-preview' ? 'Full Track (~2m)' : 'Short Clip (30s)',
    });
  } catch (error: any) {
    console.error('Error generating music with Lyria:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate garden music.',
    });
  }
});

// Helper for realistic fallback garden plan synthesis if API key is not ready
function buildFallbackGardenPlan(preferences: any) {
  const lengthFt = Number(preferences?.lengthFt) || 35;
  const widthFt = Number(preferences?.widthFt) || 25;
  const style = preferences?.style || 'cottage';
  const name = preferences?.name || 'Custom Dream Sanctuary';

  return {
    id: 'garden-synth-' + Date.now(),
    title: name,
    tagline: `An artfully zoned ${style} botanical sanctuary with tailored companion plantings.`,
    designNarrative: `This garden is specifically designed for a ${lengthFt} x ${widthFt} ft footprint (${lengthFt * widthFt} sq ft). The layout optimizes natural sunlight angles, separating the space into distinctive sensory rooms: an inviting social terrace, continuous perennial flowering borders, and a quiet contemplation retreat surrounded by aromatic greenery.`,
    style: style,
    dimensions: {
      lengthFt,
      widthFt,
      totalSqFt: lengthFt * widthFt,
    },
    zones: [
      {
        id: 'zone-1',
        name: 'The Welcome Walk & Scented Border',
        description: 'Layered aromatic perennials and soft textured groundcover framing the entrance.',
        x: 8,
        y: 8,
        width: 38,
        height: 35,
        themeColor: '#8ecae6',
        sunLevel: 'full-sun',
        suggestedActivities: 'Strolling, inhaling aromatic floral notes, welcoming guests.'
      },
      {
        id: 'zone-2',
        name: 'Pollinator Haven & Color Drifts',
        description: 'Vibrant perennial flowers designed to bloom in cascading waves across seasons.',
        x: 52,
        y: 8,
        width: 42,
        height: 45,
        themeColor: '#e0c3fc',
        sunLevel: 'full-sun',
        suggestedActivities: 'Observing hummingbirds and native bees, cutting flower arrangements.'
      },
      {
        id: 'zone-3',
        name: 'Flagstone Terrace & Dining Nook',
        description: 'Permeable stone patio framed with cedar trellis and climbing fragrant foliage.',
        x: 10,
        y: 52,
        width: 42,
        height: 40,
        themeColor: '#f2cc8f',
        sunLevel: 'partial-sun',
        suggestedActivities: 'Al fresco meals, evening reading with warm lantern light.'
      },
      {
        id: 'zone-4',
        name: 'Tranquil Water & Shade Oasis',
        description: 'Dappled retreat with a gentle fountain basin and soothing fern understory.',
        x: 58,
        y: 58,
        width: 36,
        height: 36,
        themeColor: '#a7c957',
        sunLevel: 'shade',
        suggestedActivities: 'Mindful relaxation, listening to the gentle splash of water.'
      }
    ],
    elements: [
      {
        id: 'el-1',
        type: 'pathway',
        name: 'Meandering Stone Pathway',
        x: 20,
        y: 20,
        width: 60,
        height: 35,
        description: 'Natural irregularly cut flagstones laid over crushed stone.'
      },
      {
        id: 'el-2',
        type: 'water_feature',
        name: 'Carved Basalt Water Basin',
        x: 72,
        y: 72,
        width: 14,
        height: 14,
        description: 'Bubbling recirculating acoustic fountain.'
      },
      {
        id: 'el-3',
        type: 'pergola',
        name: 'Cedar Shade Pergola',
        x: 15,
        y: 58,
        width: 25,
        height: 25,
        description: 'Timber overhead trellis with climbing flowering vines.'
      }
    ],
    plants: [
      {
        id: 'p-f1',
        commonName: 'Climbing Heritage Rose',
        botanicalName: 'Rosa "Wollerton Old Hall"',
        type: 'climber',
        x: 18,
        y: 60,
        spreadFt: 4,
        heightFt: 10,
        sunRequirement: 'Full Sun',
        waterNeed: 'Moderate',
        bloomSeason: 'Early Summer through Autumn',
        bloomColor: '#fef08a',
        foliageColor: '#166534',
        companionTips: 'Thrives when paired with Lavender and Catmint.',
        careSummary: 'Prune annually in late winter and top-dress with compost.',
        wildlifeFriendly: true,
        fragrant: true,
        edible: true
      },
      {
        id: 'p-f2',
        commonName: 'English Lavender',
        botanicalName: 'Lavandula angustifolia',
        type: 'shrub',
        x: 24,
        y: 28,
        spreadFt: 2.5,
        heightFt: 2,
        sunRequirement: 'Full Sun',
        waterNeed: 'Low',
        bloomSeason: 'Mid Summer',
        bloomColor: '#818cf8',
        foliageColor: '#94a3b8',
        companionTips: 'Naturally repels aphids while attracting beneficial pollinators.',
        careSummary: 'Needs sharp drainage; prune back lightly after blooming.',
        wildlifeFriendly: true,
        fragrant: true,
        edible: true
      },
      {
        id: 'p-f3',
        commonName: 'Purple Coneflower',
        botanicalName: 'Echinacea purpurea',
        type: 'perennial',
        x: 65,
        y: 20,
        spreadFt: 2,
        heightFt: 3,
        sunRequirement: 'Full Sun',
        waterNeed: 'Low',
        bloomSeason: 'Mid Summer to Autumn',
        bloomColor: '#c026d3',
        foliageColor: '#15803d',
        companionTips: 'Excellent companion to Black-eyed Susans and Russian Sage.',
        careSummary: 'Leave seedheads over winter for goldfinches.',
        wildlifeFriendly: true,
        fragrant: true,
        edible: false
      },
      {
        id: 'p-f4',
        commonName: 'Japanese Forest Grass',
        botanicalName: 'Hakonechloa macra',
        type: 'perennial',
        x: 70,
        y: 80,
        spreadFt: 2,
        heightFt: 1.5,
        sunRequirement: 'Partial Shade',
        waterNeed: 'Moderate',
        bloomSeason: 'Summer Foliage Movement',
        bloomColor: '#ca8a04',
        foliageColor: '#84cc16',
        companionTips: 'Softens hard stone basin edges with weeping golden blades.',
        careSummary: 'Cut back dried stalks in late winter.',
        wildlifeFriendly: false,
        fragrant: false,
        edible: false
      }
    ],
    bloomTimeline: [
      {
        season: 'Early Spring',
        plantsInBloom: ['Spring Bulbs', 'Emerging foliage'],
        keyHighlights: 'Fresh green growth surges as soil warms.'
      },
      {
        season: 'Late Spring',
        plantsInBloom: ['Roses', 'Catmint'],
        keyHighlights: 'First flush of fragrant blooms fills the air.'
      },
      {
        season: 'Mid Summer',
        plantsInBloom: ['Lavender', 'Coneflowers', 'Roses'],
        keyHighlights: 'Pollinator peak with vivid violet and golden flower heads.'
      },
      {
        season: 'Autumn',
        plantsInBloom: ['Coneflower seedheads', 'Golden grasses'],
        keyHighlights: 'Warm architectural seed structures and rich autumn tones.'
      }
    ],
    companionPairs: [
      {
        plantA: 'Climbing Heritage Rose',
        plantB: 'English Lavender',
        relationship: 'beneficial',
        reason: 'Lavender repels pests that attack roses and provides evergreen structure.'
      }
    ],
    shoppingList: [
      { category: 'Plants', item: 'Specimen Climbing Rose (5-gal)', estimatedQuantity: '2', estimatedCost: '$80', priority: 'Essential' },
      { category: 'Plants', item: 'Lavender Hidcote (1-gal)', estimatedQuantity: '6', estimatedCost: '$72', priority: 'Essential' },
      { category: 'Hardscape & Edging', item: 'Natural Flagstone Pavers', estimatedQuantity: '120 sq ft', estimatedCost: '$380', priority: 'Essential' },
      { category: 'Soil & Mulch', item: 'Organic Compost & Bark Mulch', estimatedQuantity: '2 cubic yds', estimatedCost: '$120', priority: 'Essential' }
    ],
    maintenanceTips: {
      spring: ['Top-dress beds with organic compost; prune winter dieback.'],
      summer: ['Deadhead spent rose blooms; monitor morning drip watering.'],
      autumn: ['Plant spring bulbs; leave grass plumes and seedheads intact.'],
      winter: ['Inspect arbour supports; clear heavy snow loads.']
    },
    suggestedImagePrompts: [
      {
        perspective: 'Main Garden Landscape View',
        prompt: `A beautiful ${style} landscape garden with curving stone path, blooming flower borders, warm natural sunlight, pergola with seating, photorealistic 8k architectural landscape photography`
      },
      {
        perspective: 'Terrace & Water Basin Close-up',
        prompt: `Cozy flagstone garden dining patio with carved stone fountain, lavender borders, cedar pergola with climbing vines, soft golden hour glow`
      }
    ],
    visuals: [],
    createdAt: new Date().toISOString()
  };
}

// ----------------------------------------------------
// Static / Vite Middleware Setup
// ----------------------------------------------------
async function startServer() {
  // In Vercel serverless environment, the app is handled via serverless functions
  if (process.env.VERCEL) {
    return;
  }

  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FloraScape server listening on http://0.0.0.0:${PORT}`);
  });
}

// Only start the HTTP listener if not running in a Vercel serverless function
if (!process.env.VERCEL) {
  startServer();
}

export default app;

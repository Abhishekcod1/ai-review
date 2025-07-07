import { OpenAI } from 'openai';

const apiKey = process.env.OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

export async function rateDesign(buffer) {
  if (!openai) {
    return {
      overall: Math.random() * 10,
      feedback: 'No API key provided, random score',
      layout: Math.random() * 10,
      color: Math.random() * 10,
      typography: Math.random() * 10,
      spacing: Math.random() * 10,
      contrast: Math.random() * 10,
    };
  }

  try {
    const base64 = buffer.toString('base64');
    const { choices } = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a strict graphic-design reviewer.' },
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: `data:image/png;base64,${base64}` } },
            {
              type: 'text',
              text: 'Return JSON with keys: overall, feedback, layout, color, typography, spacing, contrast (numbers 0-10 except feedback). Output nothing else.',
            },
          ],
        },
      ],
      max_tokens: 200,
    });

    const text = choices[0]?.message?.content || '';
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) throw new Error('No JSON in response');
    const json = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
    return json;
  } catch (err) {
    console.error('rateDesign error:', err);
    return null;
  }
}

import { OpenAI } from 'openai';

const apiKey = process.env.OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

export async function rateDesign(buffer) {
  if (!openai) {
    return {
      overall: Math.random() * 10,
      layout: Math.random() * 10,
      visual_hierarchy: Math.random() * 10,
      color_contrast: Math.random() * 10,
      typography_legibility: Math.random() * 10,
      brand_consistency: Math.random() * 10,
      creativity_originality: Math.random() * 10,
      technical_quality: Math.random() * 10,
      accessibility: Math.random() * 10,
      clarity_of_message: Math.random() * 10,
      feedback: 'No API key provided, random score',
    };
  }

  try {
    const base64 = buffer.toString('base64');
    const { choices } = await openai.chat.completions.create({
      model: 'gpt-4o-vision-preview',
      messages: [
        {
          role: 'system',
          content: [
            'You are a strict graphic\u2011design reviewer. For each image you receive, rate it 0\u201110 on overall quality, layout, visual hierarchy, color & contrast, typography & legibility, brand consistency, creativity & originality, technical quality, accessibility, and clarity of message.',
            'Use this checklist of "Don\u2019ts" to guide your scores:',
            '1. Layout & Composition \u2013 Don\u2019t crowd elements, leave strange gaps, or lack a clear focal point.',
            '2. Visual Hierarchy \u2013 Don\u2019t give everything equal weight or create competing sizes/colors that confuse the eye.',
            '3. Color & Contrast \u2013 Don\u2019t mix clashing hues, use unreadable low-contrast text, or stray from the defined palette.',
            '4. Typography & Legibility \u2013 Don\u2019t stack too many fonts, ignore proper kerning/leading, or set text too small.',
            '5. Brand Consistency \u2013 Don\u2019t use off-brand logos, wrong colors, or messaging that drifts from the brief.',
            '6. Creativity & Originality \u2013 Don\u2019t lean on clich\u00e9d stock imagery, recycled icons, or one-size-fits-all concepts.',
            '7. Technical Quality \u2013 Don\u2019t ship pixelated graphics, jagged edges, or incorrect export settings.',
            '8. Accessibility \u2013 Don\u2019t create flashing elements, tiny text, or color combos that fail WCAG contrast.',
            '9. Clarity of Message \u2013 Don\u2019t overload with text, bury the key message, or introduce visual \u201cnoise\u201d.',
            'Return only valid JSON with keys: {"overall","layout","visual_hierarchy","color_contrast","typography_legibility","brand_consistency","creativity_originality","technical_quality","accessibility","clarity_of_message","feedback"}.',
            'Output nothing else.'
          ].join(' '),
        },
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: `data:image/png;base64,${base64}` } },
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

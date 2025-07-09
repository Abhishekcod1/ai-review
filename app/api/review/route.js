import fs from 'fs/promises';
import path from 'path';
import { rateDesign } from '../../../lib/ai.js';
import { writeCsv } from '../../../lib/csv.js';

export async function POST() {
  const dir = path.join(process.cwd(), 'public', 'input_images');
  console.log('Looking for images in directory:', dir);
  const files = await fs.readdir(dir).catch((err) => {
    console.error('Error reading directory:', err);
    return [];
  });
  console.log('Found files:', files);

  const rows = [
    [
      'image_name',
      'overall',
      'layout',
      'visual_hierarchy',
      'color_contrast',
      'typography_legibility',
      'brand_consistency',
      'creativity_originality',
      'technical_quality',
      'accessibility',
      'clarity_of_message',
      'feedback',
    ],
  ];
  let processed = 0;
  for (const file of files) {
    if (!file.match(/\.(png|jpe?g)$/i)) {
      console.log('Skipping non-image file:', file);
      continue;
    }

    console.log('Processing image:', file);
    try {
      const buffer = await fs.readFile(path.join(dir, file));
      console.log('Successfully read file buffer, size:', buffer.length);
      const result = await rateDesign(buffer);
      if (result) {
        rows.push([
          file,
          result.overall ?? '',
          result.layout ?? '',
          result.visual_hierarchy ?? '',
          result.color_contrast ?? '',
          result.typography_legibility ?? '',
          result.brand_consistency ?? '',
          result.creativity_originality ?? '',
          result.technical_quality ?? '',
          result.accessibility ?? '',
          result.clarity_of_message ?? '',
          result.feedback?.replace(/\n/g, ' ') ?? '',
        ]);
        processed++;
        console.log('Successfully processed image:', file);
      } else {
        console.error('rateDesign returned null for:', file);
      }
    } catch (err) {
      console.error('Failed to process', file, err);
    }
  }
  console.log('Total images processed:', processed);

  const outPath = path.join(process.cwd(), 'public', 'design_review_results.csv');
  await writeCsv(rows, outPath);
  return Response.json({ ok: true, processed, csv: '/design_review_results.csv' });
}

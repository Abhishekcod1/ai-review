import fs from 'fs/promises';
import path from 'path';
import { rateDesign } from '../../../lib/ai.js';
import { writeCsv } from '../../../lib/csv.js';

export async function POST() {
  const dir = path.join(process.cwd(), 'public', 'input_images');
  const files = await fs.readdir(dir).catch(() => []);
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
    if (!file.match(/\.(png|jpe?g)$/i)) continue;
    try {
      const buffer = await fs.readFile(path.join(dir, file));
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
      }
    } catch (err) {
      console.error('Failed to process', file, err);
    }
  }
  const outPath = path.join(process.cwd(), 'public', 'design_review_results.csv');
  await writeCsv(rows, outPath);
  return Response.json({ ok: true, processed, csv: '/design_review_results.csv' });
}

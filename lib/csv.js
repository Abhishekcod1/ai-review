import fs from 'fs/promises';

export async function writeCsv(rows, path) {
  const csv = rows.map(r => r.join(',')).join('\n');
  await fs.writeFile(path, csv, 'utf8');
}

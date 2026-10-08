import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { analyzeSkinImage } from '../services/groqVision.service.js';

const directory = process.argv[2];
if (!directory) { console.error('Usage: npm run evaluate -- path/to/images'); process.exit(1); }
const files = (await fs.readdir(directory)).filter((name) => /\.(jpe?g|png|webp)$/i.test(name)).slice(0, 10);
if (files.length < 10) { console.error('Provide at least 10 JPEG, PNG, or WebP images.'); process.exit(1); }
const report = [];
for (const name of files) {
  const buffer = await fs.readFile(path.join(directory, name));
  const detectedMime = name.toLowerCase().endsWith('.png') ? 'image/png' : name.toLowerCase().endsWith('.webp') ? 'image/webp' : 'image/jpeg';
  const labels = [];
  for (let run = 0; run < 3; run += 1) {
    const result = await analyzeSkinImage({ buffer, detectedMime });
    labels.push(result.kind === 'result' ? `${result.data.severity}/${result.data.lesionType}` : `error:${result.error}`);
  }
  report.push({ image: name, labels, consistent: new Set(labels).size === 1 });
}
console.table(report);
console.log(`Consistent images: ${report.filter((item) => item.consistent).length}/${report.length}`);

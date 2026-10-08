import { analyzeSkinImage } from '../services/groqVision.service.js';
import { Analysis } from '../models/Analysis.js';
import { appConfig } from '../config/app.config.js';

export async function analyze(request, response, next) {
  try {
    const result = await analyzeSkinImage(request.file);
    if (result.kind === 'error') return response.status(422).json({ error: result.error });
    const tips = [...appConfig.tips[result.data.severity], appConfig.lesionTips[result.data.lesionType]];
    let historyId = null;
    if (request.userId) {
      const saved = await Analysis.create({ userId: request.userId, ...result.data });
      historyId = saved.id;
    }
    response.json({ ...result.data, tips, historyId });
  } catch (error) { next(error); }
}

export async function listHistory(request, response, next) {
  try {
    const items = await Analysis.find({ userId: request.userId }).sort({ createdAt: -1 }).limit(50).lean();
    response.json({ items });
  } catch (error) { next(error); }
}

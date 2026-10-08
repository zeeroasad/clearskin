import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { appConfig } from '../config/app.config.js';
import { analyze, listHistory } from '../controllers/analysis.controller.js';
import { imageUpload } from '../middleware/upload.js';
import { requireAuth } from '../middleware/auth.js';

export const analysisRouter = Router();
const limiter = rateLimit({ ...appConfig.analysisRateLimit, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many analyses. Please wait a few minutes and try again.' } });
analysisRouter.post('/analyze', limiter, imageUpload, analyze);
analysisRouter.get('/history', requireAuth, listHistory);

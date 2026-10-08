import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { appConfig } from './config/app.config.js';
import { connectDatabase } from './config/database.js';
import { authRouter } from './routes/auth.routes.js';
import { analysisRouter } from './routes/analysis.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: appConfig.corsOrigin, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.get('/api/health', (_request, response) => response.json({ ok: true, service: 'clearskin-ai-server', database: Boolean(appConfig.mongoURI) }));
app.use('/api/auth', authRouter);
app.use('/api/analysis', analysisRouter);
app.use(errorHandler);

connectDatabase().catch((error) => console.error('MongoDB connection failed:', error.message));
app.listen(appConfig.port, () => console.log(`ClearSkin AI server listening on http://localhost:${appConfig.port}`));

export function getMongoURI(env = process.env) {
  return env.MONGODB_URI || env.MONGO_URL || env.MONGO_PUBLIC_URL;
}

export const appConfig = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  upload: {
    maxBytes: Number(process.env.MAX_UPLOAD_BYTES ?? 8 * 1024 * 1024),
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
  },
  labels: {
    severity: ['mild', 'moderate', 'severe'],
    lesionType: ['comedones', 'papules', 'pustules', 'nodules']
  },
  tips: {
    mild: ['Use a gentle cleanser twice daily.', 'Choose non-comedogenic skincare products.'],
    moderate: ['Avoid picking or squeezing lesions.', 'Consider discussing persistent symptoms with a dermatologist.'],
    severe: ['Arrange professional dermatology care promptly.', 'Avoid harsh scrubs and do not squeeze lesions.']
  },
  lesionTips: {
    comedones: 'Keep routines gentle and avoid heavy, pore-clogging products.',
    papules: 'Avoid picking and introduce new products one at a time.',
    pustules: 'Do not squeeze; seek professional advice if widespread or painful.',
    nodules: 'Nodules can scar and should be assessed by a dermatologist.'
  },
  groq: {
    apiKey: process.env.GROQ_API_KEY,
    baseURL: process.env.GROQ_BASE_URL ?? 'https://api.groq.com',
    model: process.env.GROQ_VISION_MODEL ?? 'qwen/qwen3.8-27b',
    fallbackModel: process.env.GROQ_VISION_FALLBACK_MODEL ?? 'qwen/qwen3.6-27b',
    temperature: Number(process.env.GROQ_TEMPERATURE ?? 0.2),
    timeoutMs: Number(process.env.GROQ_REQUEST_TIMEOUT_MS ?? 30000)
  },
  auth: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessTtl: process.env.ACCESS_TOKEN_TTL ?? '15m',
    refreshTtl: process.env.REFRESH_TOKEN_TTL ?? '7d',
    cookieSecure: process.env.NODE_ENV === 'production'
  },
  mongoURI: getMongoURI(),
  analysisRateLimit: { windowMs: 15 * 60 * 1000, max: 10 }
};

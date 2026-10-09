# Classification of Acne

Classification of Acne is a student project that uploads a face/skin image to a Node.js backend for an AI-estimated acne assessment. It classifies both configurable **severity** and **lesion type**. The result is an estimate, not a medical diagnosis.

## Included features

- React/Vite frontend with responsive light/dark UI
- Drag-and-drop upload, preview, and mobile camera capture
- JPEG/PNG/WebP client validation and server magic-byte validation
- In-memory `multer.memoryStorage`; uploaded images are never persisted
- Groq Qwen vision analysis through one service only
- JSON mode, low temperature, strict Zod validation, and one controlled retry
- Friendly rejection for invalid model/image responses
- Configured skincare tips, confidence, reason, and severe-result escalation
- Email/password registration and login
- Short-lived access JWT plus rotating refresh JWT in HTTP-only cookies
- Hashed refresh-token persistence and logout revocation
- MongoDB metadata history; no image storage
- Analysis rate limiting, timeout, Helmet, CORS, and consistent errors
- Ten-image × three-run consistency evaluation script

## Run locally

### Server

```bash
cd server
copy .env.example .env
# Add real GROQ_API_KEY, MONGODB_URI, and strong JWT secrets to .env
npm install
npm run dev
```

Health endpoint: `http://localhost:4000/api/health`

### Client

```bash
cd client
copy .env.example .env
npm install
npm run dev
```

Vite normally runs at `http://localhost:5173`.

## Connect a Railway MongoDB database

1. Add a MongoDB service to the same Railway project as the backend.
2. In the backend service's **Variables**, add `MONGODB_URI` with the Railway reference `${{ Mongo.MONGO_URL }}`. Replace `Mongo` with the exact name of your database service.
3. Add the backend's other required variables (`GROQ_API_KEY`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET`) and set `CORS_ORIGIN` to the deployed frontend's public URL.
4. Deploy the backend, then open `https://<your-backend-domain>/api/health`. Its `database` field should be `true` once MongoDB is connected.

Railway's private `MONGO_URL` is preferred for services in the same project. The backend also accepts `MONGO_URL` directly and `MONGO_PUBLIC_URL` for an intentionally public connection. Do not put database URLs or secrets in frontend variables or share them in chat. If the health endpoint reports `database: false`, check that the variable is set on the backend service in the same environment and review that service's deployment logs for `MongoDB connection failed`.

## Evaluation

Put at least ten test images in a directory and run:

```bash
cd server
npm run evaluate -- ../test-images
```

The script makes exactly three analysis runs per image and reports whether the combined severity/lesion label stayed identical. It does not silently change production requests.

## Configuration and secrets

Real values belong only in `server/.env`; placeholders are in `.env.example`. Never commit secrets. Required values are `GROQ_API_KEY`, `MONGODB_URI`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET`.

The app stores only assessment metadata: labels, confidence, reason, timestamp, and user ID. Uploaded image bytes are held in memory for the request and then discarded.

## Folder structure

```text
server/src/
  config/       Environment, labels, limits, database
  controllers/  Authentication and analysis handlers
  middleware/   Upload, auth, rate limiting, and error handling
  models/       User, refresh token, and image-free analysis schemas
  prompts/      Editable vision prompt builder
  routes/       Express route definitions
  scripts/      Evaluation script
  services/     External integrations; Groq lives in one service only
  utils/        JWT, cookie, and hashing helpers
client/src/
  components/  Reserved reusable UI components
  pages/       Reserved page components
  hooks/        Reserved hooks
  services/api Backend API client
  utils/       Reserved client helpers
  assets/      Static assets
```

## Safety

Every result screen displays: “AI estimate, not a medical diagnosis. See a dermatologist for medical advice.” Severe estimates also recommend professional dermatology care. The system prompt rejects images that are not clear face/skin images, lack a face, are too blurry, or are too dark.

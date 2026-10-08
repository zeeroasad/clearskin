import Groq from 'groq-sdk';
import { z } from 'zod';
import { appConfig } from '../config/app.config.js';
import { buildAcneAssessmentPrompt } from '../prompts/acneAssessment.prompt.js';

const resultSchema = z.object({
  severity: z.enum(appConfig.labels.severity),
  lesionType: z.enum(appConfig.labels.lesionType),
  confidence: z.number().min(0).max(1),
  reason: z.string().min(1).max(1000)
}).strict();
const errorSchema = z.object({ error: z.string().min(1).max(500) }).strict();

function parseModelContent(content) {
  let parsed;
  try { parsed = JSON.parse(content ?? ''); } catch { throw new Error('The AI returned invalid JSON.'); }
  const rejected = errorSchema.safeParse(parsed);
  if (rejected.success) return { kind: 'error', error: rejected.data.error };
  const accepted = resultSchema.safeParse(parsed);
  if (!accepted.success) throw new Error('The AI response did not match the required assessment format.');
  return { kind: 'result', data: accepted.data };
}

export async function analyzeSkinImage(file) {
  if (!appConfig.groq.apiKey) throw Object.assign(new Error('The Groq API key is not configured.'), { status: 503 });
  const client = new Groq({ apiKey: appConfig.groq.apiKey, baseURL: appConfig.groq.baseURL, timeout: appConfig.groq.timeoutMs });
  const imageUrl = `data:${file.detectedMime};base64,${file.buffer.toString('base64')}`;
  let lastError;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await client.chat.completions.create({
        model: attempt === 0 ? appConfig.groq.model : appConfig.groq.fallbackModel,
        temperature: appConfig.groq.temperature,
        max_completion_tokens: 500,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: buildAcneAssessmentPrompt() },
          { role: 'user', content: [{ type: 'text', text: 'Analyze this image and return the required JSON.' }, { type: 'image_url', image_url: { url: imageUrl } }] }
        ]
      });
      return parseModelContent(response.choices?.[0]?.message?.content);
    } catch (error) {
      lastError = error;
    }
  }
  throw Object.assign(new Error('The image could not be assessed safely. Please try another clear photo.'), { status: 502, cause: lastError });
}

import { parseCookies } from '../utils/auth.js';
import { verifyAccessToken } from '../utils/jwt.js';

export function requireAuth(request, response, next) {
  try {
    const token = parseCookies(request).access_token;
    if (!token) return response.status(401).json({ error: 'Please log in to continue.' });
    const payload = verifyAccessToken(token);
    if (payload.type !== 'access') throw new Error('Wrong token type');
    request.userId = payload.sub;
    next();
  } catch {
    response.status(401).json({ error: 'Your session has expired. Please log in again.' });
  }
}

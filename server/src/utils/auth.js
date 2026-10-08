import crypto from 'node:crypto';

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function parseCookies(request) {
  const header = request.headers.cookie ?? '';
  return Object.fromEntries(header.split(';').filter(Boolean).map((part) => {
    const index = part.indexOf('=');
    return [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1).trim())];
  }));
}

export function setAuthCookies(response, accessToken, refreshToken, secure = false) {
  const flags = `Path=/; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}`;
  response.setHeader('Set-Cookie', [
    `access_token=${encodeURIComponent(accessToken)}; ${flags}; Max-Age=900`,
    `refresh_token=${encodeURIComponent(refreshToken)}; ${flags}; Max-Age=604800`
  ]);
}

export function clearAuthCookies(response, secure = false) {
  const flags = `Path=/; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}`;
  response.setHeader('Set-Cookie', [`access_token=; ${flags}; Max-Age=0`, `refresh_token=; ${flags}; Max-Age=0`]);
}

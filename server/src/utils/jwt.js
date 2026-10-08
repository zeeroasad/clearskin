import jwt from 'jsonwebtoken';
import { appConfig } from '../config/app.config.js';

export function createAccessToken(userId) {
  return jwt.sign({ sub: userId, type: 'access' }, appConfig.auth.accessSecret, { expiresIn: appConfig.auth.accessTtl });
}

export function createRefreshToken(userId) {
  return jwt.sign({ sub: userId, type: 'refresh' }, appConfig.auth.refreshSecret, { expiresIn: appConfig.auth.refreshTtl });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, appConfig.auth.accessSecret);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, appConfig.auth.refreshSecret);
}

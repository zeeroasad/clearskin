import test from 'node:test';
import assert from 'node:assert/strict';
import { appConfig, getMongoURI } from './app.config.js';

test('classification labels are configurable and non-empty', () => {
  assert.deepEqual(appConfig.labels.severity, ['mild', 'moderate', 'severe']);
  assert.equal(appConfig.labels.lesionType.length, 4);
});

test('upload limits include the supported image types', () => {
  assert.equal(appConfig.upload.allowedMimeTypes.includes('image/jpeg'), true);
  assert.equal(appConfig.upload.maxBytes > 0, true);
});

test('Railway MongoDB URLs are supported while preserving explicit configuration priority', () => {
  assert.equal(getMongoURI({ MONGODB_URI: 'mongodb://custom', MONGO_URL: 'mongodb://railway' }), 'mongodb://custom');
  assert.equal(getMongoURI({ MONGO_URL: 'mongodb://railway' }), 'mongodb://railway');
  assert.equal(getMongoURI({ MONGO_PUBLIC_URL: 'mongodb://external' }), 'mongodb://external');
  assert.equal(getMongoURI({}), undefined);
});

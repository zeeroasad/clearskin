import test from 'node:test';
import assert from 'node:assert/strict';
import { appConfig } from './app.config.js';

test('classification labels are configurable and non-empty', () => {
  assert.deepEqual(appConfig.labels.severity, ['mild', 'moderate', 'severe']);
  assert.equal(appConfig.labels.lesionType.length, 4);
});

test('upload limits include the supported image types', () => {
  assert.equal(appConfig.upload.allowedMimeTypes.includes('image/jpeg'), true);
  assert.equal(appConfig.upload.maxBytes > 0, true);
});

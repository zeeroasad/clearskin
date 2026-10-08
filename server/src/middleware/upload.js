import multer from 'multer';
import { appConfig } from '../config/app.config.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: appConfig.upload.maxBytes, files: 1 } });

function detectedMime(buffer) {
  if (buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return 'image/jpeg';
  if (buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return 'image/png';
  if (buffer.subarray(0, 4).toString() === 'RIFF' && buffer.subarray(8, 12).toString() === 'WEBP') return 'image/webp';
  return null;
}

export function imageUpload(request, response, next) {
  upload.single('image')(request, response, (error) => {
    if (error) return next(error.code === 'LIMIT_FILE_SIZE' ? Object.assign(new Error('Image is too large.'), { status: 413 }) : error);
    if (!request.file) return next(Object.assign(new Error('Please select an image.'), { status: 400 }));
    const actualMime = detectedMime(request.file.buffer);
    if (!actualMime || !appConfig.upload.allowedMimeTypes.includes(actualMime)) return next(Object.assign(new Error('Only JPEG, PNG, or WebP images are allowed.'), { status: 415 }));
    request.file.detectedMime = actualMime;
    next();
  });
}

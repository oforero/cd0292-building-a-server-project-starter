import request from 'supertest';
import app from '../index.js';
import fs from 'fs';
import path from 'path';

// Get the current file path and directory
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Resizer Endpoint', () => {
  const thumbnailsDir = path.join(__dirname, '../thumbnails');
  const testImage = 'icelandwaterfall.jpg';
  const width = 200;
  const height = 300;

  beforeAll(() => {
    // Ensure the thumbnails directory exists
    if (!fs.existsSync(thumbnailsDir)) {
      fs.mkdirSync(thumbnailsDir);
    }
  });

  afterAll(() => {
    // Clean up: Delete test files in the thumbnails directory
    const testThumbnail = path.join(
      thumbnailsDir,
      `${width}x${height}-${testImage}`
    );
    if (fs.existsSync(testThumbnail)) {
      fs.unlinkSync(testThumbnail);
    }
  });

  it('should resize and return the image', async () => {
    const response = await request(app)
      .get(`/resize/${testImage}`)
      .query({ width, height });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/image/);

    // Verify the resized image exists in the cache
    const resizedImagePath = path.join(
      thumbnailsDir,
      `${width}x${height}-${testImage}`
    );
    expect(fs.existsSync(resizedImagePath)).toBe(true);
  });

  it('should return 404 if the original image does not exist', async () => {
    const response = await request(app)
      .get('/resize/nonexistent.jpg')
      .query({ width, height });

    expect(response.status).toBe(404);
    expect(response.text).toBe("Image doesn't exist");
  });

  it('should return 400 for missing query parameters', async () => {
    const response = await request(app).get(`/resize/${testImage}`).query({});

    expect(response.status).toBe(400);
    expect(response.text).toBe(
      'Width and height query parameters are required'
    );
  });
});

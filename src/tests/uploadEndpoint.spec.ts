import request from 'supertest';
import path from 'path';
import fs from 'fs';
import app from '../index.js';

describe('POST /original/upload', () => {
  const uploadEndpoint = '/original/upload';
  const testImagePath = path.join('./fixtures', 'test.jpg'); // Put test.jpg in __tests__/fixtures/

  it('should upload a JPG file and respond with 200 OK', async () => {
    const response = await request(app)
      .post(uploadEndpoint)
      .attach('jpg', testImagePath);

    expect(response.status).toBe(200);

    // Check if file was saved
    const savedFilename = 'test.jpg';
    const savedFilePath = path.join('./images', savedFilename);

    expect(fs.existsSync(savedFilePath)).toBe(true);

    // Clean up after test
    fs.unlinkSync(savedFilePath);
  });
});

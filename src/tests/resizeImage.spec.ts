import fs from 'fs';
import sharp from 'sharp';
import path from 'path';
import { resizeImage } from '../utilities/imageManipulation.js';

describe('resizeImage', () => {
  const thumbnailsDir = '/test/thumbnails';
  const imagesDir = '/test/images';
  const image = 'test.jpg';
  const width = 200;
  const height = 300;

  it('should resize and save the image when it is not cached', async () => {
    spyOn(fs, 'existsSync').and.callFake((filePath) => {
      // Simulate the file does not exist
      console.info('Simulating file does not exist: ', filePath);
      return false;
    });

    spyOn(fs, 'mkdirSync').and.callFake(() => undefined);
    spyOn(sharp.prototype, 'resize').and.callFake(() => ({
      toFile: jasmine.createSpy('toFile').and.resolveTo({
        format: 'jpeg',
        width,
        height,
        size: 12345,
      }),
    }));

    const result = await resizeImage(
      thumbnailsDir,
      imagesDir,
      image,
      width,
      height
    );

    expect(result.fromCache).toBe(false); // Verify it was not served from cache
    expect(result.resizedImagePath).toBe(
      path.join(thumbnailsDir, `${width}x${height}-${image}`)
    );
    expect(sharp.prototype.resize).toHaveBeenCalledWith(width, height); // Verify resize was called
  });

  it('should return the cached image when it already exists', async () => {
    spyOn(fs, 'mkdirSync').and.callFake(() => undefined);
    spyOn(fs, 'existsSync').and.callFake((filePath) => {
      // Simulate the file does not exist
      console.info('Simulating file does exist: ', filePath);
      return true;
    });
    spyOn(sharp.prototype, 'resize').and.callFake(() => ({
      toFile: jasmine.createSpy('toFile').and.resolveTo({
        format: 'jpeg',
        width,
        height,
        size: 12345,
      }),
    }));

    const result = await resizeImage(
      thumbnailsDir,
      imagesDir,
      image,
      width,
      height
    );

    expect(result.fromCache).toBe(true); // Verify it was served from cache
    expect(result.resizedImagePath).toBe(
      path.join(thumbnailsDir, `${width}x${height}-${image}`)
    );
    expect(sharp.prototype.resize).not.toHaveBeenCalled(); // Ensure resize was not called
  });
});

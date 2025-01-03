import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

async function resizeImage(
  thumbnailsDir: string,
  imagesDir: string,
  image: string,
  width: number,
  height: number
): Promise<{ resizedImagePath: string; fromCache: boolean }> {
  const originalImagePath = path.join(imagesDir, image);
  const resizedImagePath = path.join(
    thumbnailsDir,
    `${width}x${height}-${image}`
  );

  // Check if the resized image already exists
  if (fs.existsSync(resizedImagePath)) {
    return { resizedImagePath, fromCache: true };
  }

  // Resize the image using Sharp
  await sharp(originalImagePath).resize(width, height).toFile(resizedImagePath);

  // The file will exist after the above call
  return { resizedImagePath, fromCache: false };
}

export { resizeImage };

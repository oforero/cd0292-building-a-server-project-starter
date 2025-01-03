import { Request, Response, Router } from 'express';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const router = Router();

// Get the current file path and directory
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesDir = path.join(__dirname, '../images');
const thumbnailsDir = path.join(__dirname, '../thumbnails');

// Ensure thumbnails directory exists
if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir);
}

// Resize and serve an image
async function imageResizer(req: Request, res: Response): Promise<void> {
  try {
    const { filename } = req.params;
    const { width, height } = req.query;

    console.info(
      'Request for image: ',
      filename,
      ' with height ',
      height,
      ' and width ',
      width
    );
    if (!width || !height) {
      res.status(400).send('Width and height query parameters are required');
      return;
    }

    const parsedWidth = parseInt(width as string, 10);
    const parsedHeight = parseInt(height as string, 10);

    if (isNaN(parsedWidth) || isNaN(parsedHeight)) {
      res.status(400).send('Width and height must be valid numbers');
      return;
    }

    const originalImagePath = path.join(imagesDir, filename);
    const resizedImagePath = path.join(
      thumbnailsDir,
      `${parsedWidth}x${parsedHeight}-${filename}`
    );

    // Check if the original image exists
    if (!fs.existsSync(originalImagePath)) {
      res.status(404).send('Original image not found');
      return;
    }

    // Check if the resized image already exists
    if (fs.existsSync(resizedImagePath)) {
      res.sendFile(resizedImagePath);
      return;
    }

    // Resize the image using Sharp
    await sharp(originalImagePath)
      .resize(parsedWidth, parsedHeight)
      .toFile(resizedImagePath);

    console.log(`Resized image saved to: ${resizedImagePath}`);
    res.sendFile(resizedImagePath);
  } catch (error) {
    console.error('Error resizing image:', error);
    res.status(500).send('Error processing the image');
  }
}

router.get('/:filename', imageResizer);

export default router;

import { Request, Response, Router } from 'express';
import path from 'path';
import fs from 'fs';
import { resizeImage } from '../utilities/imageManipulation.js';

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

const isPositiveInteger = (value: string): boolean => /^\d+$/.test(value);

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

    if (
      !isPositiveInteger(width as string) ||
      !isPositiveInteger(height as string)
    ) {
      res.status(400).send('Width and height must be valid positive integers');
      return;
    }

    const parsedWidth = parseInt(width as string, 10);
    const parsedHeight = parseInt(height as string, 10);

    const originalImagePath = path.join(imagesDir, filename);
    if (!fs.existsSync(originalImagePath)) {
      res.status(404).send("Image doesn't exist");
      return;
    }

    if (isNaN(parsedWidth) || isNaN(parsedHeight)) {
      res.status(400).send('Width and height must be valid numbers');
      return;
    }

    // Resize the image using Sharp
    const resized = await resizeImage(
      thumbnailsDir,
      imagesDir,
      filename,
      parsedWidth,
      parsedHeight
    );

    console.log(`Resized image saved to: ${resized.resizedImagePath}`);
    res.sendFile(resized.resizedImagePath);
  } catch (error) {
    console.error('Error resizing image:', error);
    res.status(500).send('Error processing the image');
  }
}

router.get('/:filename', imageResizer);

export default router;

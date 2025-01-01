import { Router } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();

// Get the current file path and directory
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get a list of all available images
router.get('/list', (req, res) => {
  const imagesDir = path.join(__dirname, '../images');

  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.error('Error reading images directory:', err);
      res.status(500).json({ error: 'Unable to fetch images' });
      return;
    }

    // Filter for image files (e.g., .jpg, .png)
    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|gif)$/i.test(file)
    );

    res.json(imageFiles);
  });
});

// Serve an image dynamically based on the filename
router.get('/:imagename', (req, res) => {
  const { imagename } = req.params;
  const imagePath = path.join(__dirname, '../images', imagename);

  // Check if the file exists
  fs.access(imagePath, fs.constants.R_OK, (err) => {
    if (err) {
      console.error('File not found:', imagePath);
      res.status(404).send('Image not found');
      return;
    }

    // Serve the image file
    res.sendFile(imagePath);
  });
});

export default router;

import { Router } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();

// Get the current file path and directory
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

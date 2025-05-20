import { Request, Response, Router } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve('./images'));
  },
  filename: (req, file, cb) => {
    // Save using original file name (it will overwrite)
    cb(null, path.basename(file.originalname));
  },
});

const upload = multer({ storage });

// Get a list of all available images
function listImagesHandler(req: Request, res: Response): void {
  const imagesDir = path.resolve('./images');

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
}

// Serve an image dynamically based on the filename
function serveImageHandler(req: Request, res: Response): void {
  const { imagename } = req.params;
  const imagePath = path.join(path.resolve('./images'), imagename);

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
}

function uploadImageHandler(req: Request, res: Response): void {
  console.log(req.file, req.body);
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
  }
  res.status(200).json({ message: 'Image uploaded successfuly.' });
}

router.get('/list', listImagesHandler);
router.get('/:imagename', serveImageHandler);
router.post('/upload', upload.single('jpg'), uploadImageHandler);

export default router;

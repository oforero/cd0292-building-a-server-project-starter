import express from 'express';
import path from 'path';
import helloRouter from './routes/hello.js';

const app = express();
const PORT = 3000;

import { fileURLToPath } from 'url';

// Get the current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the static directory
app.use(express.static(path.join(__dirname, 'static')));

// Add the /hello route
app.use('/hello', helloRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

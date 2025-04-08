import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import htmlRoutes from './routes/htmlRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Import the routes
import routes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 3001;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// TODO: Serve static files of entire client dist folder
app.use(express.static(path.join(__dirname, '../../client/dist')));
// TODO: Implement middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// TODO: Implement middleware to connect the routes
app.use(routes);
app.use(htmlRoutes);
// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));

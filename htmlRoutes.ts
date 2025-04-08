// import path from 'node:path';
// import { fileURLToPath } from 'node:url';
// import { Router } from 'express';
// import express from 'express';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const router = Router();

// const clientDistPath = path.resolve(__dirname, '../../../client/dist');
// router.use(express.static(clientDistPath));

// // TODO: Define route to serve index.html
// router.get('*', (_req, res) => {
//     res.sendFile(path.join(clientDistPath, 'index.html'));
//   });
// export default router;

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';
import fs from 'fs/promises';  // Use fs.promises API for async file handling
import { v4 as uuidv4 } from 'uuid';
import WeatherService from '../service/weatherService.js';  // Your weather service

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

// Serve the index.html file at the root route
router.get('/', (_req, res, next) => {
    const indexPath = path.join(__dirname, '../../client/dist/index.html');
    res.sendFile(indexPath, (err) => {
      if (err) {
        return next(err); // Pass the error to the default error handler
      }
      res.status(200).end(); // End the response if file is sent successfully
    });
  });

// API route to get the search history from searchHistory.json
router.get('/api/weather/history', async (_req, res) => {
  const filePath = path.join(__dirname, 'db/db.json');
  
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const cities = JSON.parse(data);
    return res.status(200).json(cities);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to read search history' });
  }
});

// API route to save a city and fetch its weather data
router.post('/api/weather', async (req, res) => {
  const { cityName } = req.body;

  if (!cityName) {
    return res.status(400).json({ error: 'City name is required' });
  }

  const newCity = {
    id: uuidv4(),  // Generate a unique ID
    name: cityName,
  };

  const filePath = path.join(__dirname, 'db/db.json');

  try {
    // Read the current history from the searchHistory.json file
    const data = await fs.readFile(filePath, 'utf8');
    const cities = JSON.parse(data);
    
    // Add the new city to the history
    cities.push(newCity);

    // Write the updated list of cities back to the searchHistory.json file
    await fs.writeFile(filePath, JSON.stringify(cities, null, 2), 'utf8');

    try {
      // Fetch weather data for the city using the WeatherService
      const weatherData = await WeatherService.getWeather(cityName);

      // Respond with the weather data and the new city info
      return res.status(200).json({
        city: newCity,
        weather: weatherData,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Error fetching weather data' });
    }

  } catch (err) {
    return res.status(500).json({ error: 'Failed to read or save search history' });
  }
});

export default router;




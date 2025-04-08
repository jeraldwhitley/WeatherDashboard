import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (_req, res) => {
  // TODO: GET weather data from city name
  const { cityName } = _req.body;
  if (!cityName) {
    return res.status(400).json({ error: 'City name is required' });
  }
  try {
    // Fetch weather data for the city
    const weatherData = await WeatherService.getWeather(cityName);
    // TODO: save city to search history
    // Save city to search history
    HistoryService.addCityToHistory(cityName);

    // Respond with the weather data
    return res.status(200).json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return res.status(500).json({ error: 'Failed to fetch weather data' });
  }
  
});

// TODO: GET search history
router.get('/history', async (_req: any, res) => {
  try {
    // Fetch the history of cities from the HistoryService
    const history = await HistoryService.getHistory();
    return res.status(200).json(history); // Return search history as JSON
  } catch (error) {
    console.error('Error fetching history:', error);
    return res.status(500).json({ error: 'Failed to fetch search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (_req: { params: { id: any; }; }, res) => {
  const { id } = _req.params;

  try {
    // Remove the city by its ID from the history using HistoryService
    const success = await HistoryService.removeCity(id);

    if (!success) {
      return res.status(404).json({ error: 'City not found in history' });
    }

    return res.status(200).json({ message: 'City removed from history' });
  } catch (error) {
    console.error('Error deleting city from history:', error);
    return res.status(500).json({ error: 'Failed to delete city from history' });
  }
});

export default router;

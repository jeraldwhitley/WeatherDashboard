import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// TODO: Define a City class with name and id properties
class City {
  id: string;
  name: string;
  //toLowerCase: any;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
// TODO: Complete the HistoryService class
class HistoryService {
  private historyFilePath: string;
  constructor() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    // Define the path to the searchHistory.json file
    this.historyFilePath = path.resolve(__dirname, '../../data/searchHistory.json');
  }
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.promises.readFile(this.historyFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading history file:', error);
      return [];
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    try {
      await fs.promises.writeFile(this.historyFilePath, JSON.stringify(cities, null, 2));
    } catch (error) {
      console.error('Error writing to history file:', error);
    }
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getHistory(): Promise <City[]>{
    return await this.read();
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCityToHistory(city: string): Promise<void>{
    const cities = await this.read();
    console.log(cities)
    // Check if city already exists in history to avoid duplicates
    //if (!cities.some((city) => city.name.toLowerCase() === city.name.toLowerCase())) {
      const newCity = new City(Date.now().toString(), city);
      cities.push(newCity);
      await this.write(cities);
    //}
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<boolean>{
    const cities = await this.read();
    const updatedCities = cities.filter((city) => city.id !== id);
    
    if (cities.length === updatedCities.length) {
      return false; // City was not found
    }

    await this.write(updatedCities);
    return true;
  }
  };

export default new HistoryService();

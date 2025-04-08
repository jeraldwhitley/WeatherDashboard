import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}

interface Weather {
  description: string;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
}

interface OpenWeatherResponse {
  coord: {
    lat: number;
    lon: number;
  };
  weather: { description: string }[];
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
  };
  cod: number;
  message?: string;
}

class WeatherService {
  private baseURL: string = 'https://api.openweathermap.org/data/2.5/';
  private apiKey: string = process.env.API_KEY || '';

  // Fetch coordinates using city name
  private async fetchLocationData(query: string): Promise<Coordinates> {
    const url = this.buildGeocodeQuery(query);
    const response = await fetch(url);
    const data = await response.json() as OpenWeatherResponse;
    if (data.cod !== 200) {
      throw new Error('City not found');
    }
    return { lat: data.coord.lat, lon: data.coord.lon };
  }

  private destructureLocationData(locationData: Coordinates): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon,
    };
  }

  private buildGeocodeQuery(city: string): string {
    return `${this.baseURL}weather?q=${city}&appid=${this.apiKey}&units=metric`;
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
  }

  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    const rawLocationData = await this.fetchLocationData(city);
    return this.destructureLocationData(rawLocationData);
  }

  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    console.log("========");
    const url = this.buildWeatherQuery(coordinates);
    const response = await fetch(url);
    console.log(response);
    const data = await response.json() as OpenWeatherResponse;
    if (data.cod !== 200) {
      throw new Error('Failed to fetch weather data');
    }
    const _currentWeather: Weather = this.parseCurrentWeather(response.list[0]);
    const forecast: Weather[] = this.buildForecastArray(_currentWeather, data.list)
    console.log(data);
    return forecast;
  }

  private parseCurrentWeather(response: any): Weather {
    return {
      description: response.weather[0].description,
      temperature: response.main.temp,
      humidity: response.main.humidity,
      pressure: response.main.pressure,
      windSpeed: response.wind.speed,
    };
  }

  private buildForecastArray(_currentWeather: Weather, weatherData: any[]): Weather[] {
    return weatherData.map((data: any) => ({
      description: data.weather[0].description,
      temperature: data.main.temp,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
    }));
  }

  async getWeather(city: string): Promise<Weather> {
    try {
      const coordinates = await this.fetchAndDestructureLocationData(city);
      console.log(coordinates);
      const weatherData = await this.fetchWeatherData(coordinates);
      console.log(weatherData);
      return this.parseCurrentWeather(weatherData);
    } catch (error: any) {
      throw new Error('Error fetching weather for the city: ' + error.message);
    }
  }
}

export default new WeatherService();

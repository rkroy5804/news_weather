import { useState, useEffect } from "react";

export interface ForecastDay {
  date: string;
  temperature: number;
  condition: string;
  icon: string;
}

export interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: ForecastDay[];
}

export const useWeather = (cityId: number) => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
        const url = `http://api.openweathermap.org/data/2.5/forecast?id=${cityId}&units=metric&appid=${apiKey}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch weather");

        const json = await res.json();

        const weatherData: WeatherData = {
          city: json.city.name,
          temperature: json.list[0].main.temp,
          condition: json.list[0].weather[0].main,
          humidity: json.list[0].main.humidity,
          windSpeed: json.list[0].wind.speed,
          forecast: json.list.slice(0, 5).map((item: any) => ({
            date: item.dt_txt,
            temperature: item.main.temp,
            condition: item.weather[0].main,
            icon: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
          })),
        };

        setData(weatherData);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [cityId]);

  return { data, loading, error };
};

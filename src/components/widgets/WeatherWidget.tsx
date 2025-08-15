"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WeatherWidgetProps {
  cityId?: number;
}

interface WeatherData {
  current: {
    temp: number;
    condition: string;
    humidity: number;
    wind: number;
    icon: string;
  };
  forecast: {
    date: string;
    temp: number;
    condition: string;
    icon: string;
  }[];
  city: string;
}

const cities = [
  { id: 1259229, name: "Pune" },
  { id: 1275339, name: "Mumbai" },
  { id: 1277333, name: "Bengaluru" },
  { id: 1269843, name: "Chennai" },
  { id: 1269515, name: "Kolkata" },
];

export default function WeatherWidget({ cityId = 1259229 }: WeatherWidgetProps) {
  const [selectedCity, setSelectedCity] = useState(cityId);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
        if (!apiKey) throw new Error("OpenWeatherMap API key not set");

        const resCurrent = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?id=${selectedCity}&units=metric&appid=${apiKey}`
        );
        const dataCurrent = await resCurrent.json();

        const resForecast = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?id=${selectedCity}&units=metric&appid=${apiKey}`
        );
        const dataForecast = await resForecast.json();

        const forecastList = dataForecast.list
          .filter((_: any, index: number) => index % 8 === 0)
          .map((f: any) => ({
            date: new Date(f.dt_txt).toLocaleDateString("en-IN", { weekday: "short", day: "numeric" }),
            temp: f.main.temp,
            condition: f.weather[0].main,
            icon: `https://openweathermap.org/img/wn/${f.weather[0].icon}@2x.png`,
          }));

        setWeather({
          city: dataCurrent.name,
          current: {
            temp: dataCurrent.main.temp,
            condition: dataCurrent.weather[0].main,
            humidity: dataCurrent.main.humidity,
            wind: dataCurrent.wind.speed,
            icon: `https://openweathermap.org/img/wn/${dataCurrent.weather[0].icon}@2x.png`,
          },
          forecast: forecastList,
        });
      } catch (err: any) {
        setError(err.message || "Failed to fetch weather");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [selectedCity]);

  return (
    <Card className="w-full max-w-8xl h-[80vh] mx-auto p-4 py-12 relative hover:shadow-xl transition-shadow bg-white dark:bg-gray-800">
      {/* Header */}
      <CardHeader className="text-center mb-4 flex flex-col sm:flex-row sm:justify-between items-center gap-4">
        {/* Weather Title */}
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 order-1 sm:order-1">
          Weather
        </CardTitle>

        {/* City Selector */}
        <div className="mt-2 sm:mt-0 order-2 sm:order-2">
          <Select value={String(selectedCity)} onValueChange={(val) => setSelectedCity(Number(val))}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select City" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city.id} value={String(city.id)}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      {loading && <p className="text-center mt-20 text-gray-900 dark:text-gray-100">Loading weather...</p>}
      {error && <p className="text-red-500 text-center mt-20">{error}</p>}

      {weather && (
        <>
          {/* Current Weather Info */}
          <div className="text-center mb-4">
            <p className="text-xl text-gray-900 dark:text-gray-100 font-semibold">{weather.city}</p>
            <p className="text-lg text-gray-900 dark:text-gray-200">
              {weather.current.temp}°C - {weather.current.condition}
            </p>
            <div className="flex flex-col sm:flex-row justify-center mt-2 gap-2 sm:gap-4 text-gray-700 dark:text-gray-300">
              <p>Humidity: {weather.current.humidity}%</p>
              <p>Wind: {weather.current.wind} m/s</p>
            </div>
          </div>

          {/* Weather Icon */}
          <div className="flex justify-center mb-4 animate-fade-in">
            <img src={weather.current.icon} alt={weather.current.condition} className="w-32 h-32" />
          </div>

          {/* 5-Day Forecast */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mt-4">
            {weather.forecast.map((f) => (
              <div
                key={f.date}
                className="flex flex-col items-center bg-gradient-to-b from-blue-100 to-blue-50 dark:from-gray-700 dark:to-gray-600 p-2 rounded-lg shadow hover:scale-105 transform transition"
              >
                <p className="font-semibold text-gray-900 dark:text-gray-100">{f.date}</p>
                <img src={f.icon} alt={f.condition} className="w-16 h-16" />
                <p className="text-gray-900 dark:text-gray-100">{f.temp}°C</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{f.condition}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}

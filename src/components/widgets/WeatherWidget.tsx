"use client";

import { useState, useEffect, FC } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WeatherWidgetProps {
  cityId?: number;
}

interface ForecastItem {
  date: string;
  temp: number;
  condition: string;
  icon: string;
}

interface WeatherData {
  current: {
    temp: number;
    condition: string;
    humidity: number;
    wind: number;
    icon: string;
  };
  forecast: ForecastItem[];
  city: string;
}

interface OpenWeatherForecastItem {
  dt_txt: string;
  main: { temp: number };
  weather: { main: string; icon: string }[];
}

interface OpenWeatherForecastResponse {
  list: OpenWeatherForecastItem[];
}

const cities = [
  { id: 1259229, name: "Pune" },
  { id: 1275339, name: "Mumbai" },
  { id: 1277333, name: "Bengaluru" },
  { id: 1269843, name: "Chennai" },
  { id: 1269515, name: "Kolkata" },
];

const WeatherWidget: FC<WeatherWidgetProps> = ({ cityId = 1259229 }) => {
  const [selectedCity, setSelectedCity] = useState<number>(cityId);
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

        const currentRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?id=${selectedCity}&units=metric&appid=${encodeURIComponent(apiKey)}`
        );
        const currentData = await currentRes.json();

        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?id=${selectedCity}&units=metric&appid=${encodeURIComponent(apiKey)}`
        );
        const forecastData: OpenWeatherForecastResponse = await forecastRes.json();

        const forecastList: ForecastItem[] = forecastData.list
          .filter((_, index) => index % 8 === 0)
          .map((f: OpenWeatherForecastItem) => ({
            date: new Date(f.dt_txt).toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
            }),
            temp: Math.round(f.main?.temp ?? 0),
            condition: f.weather?.[0]?.main ?? "N/A",
            icon: f.weather?.[0]?.icon
              ? `https://openweathermap.org/img/wn/${f.weather[0].icon}@2x.png`
              : "/placeholder.png",
          }));

        setWeather({
          city: currentData.name,
          current: {
            temp: Math.round(currentData.main.temp),
            condition: currentData.weather?.[0]?.main ?? "N/A",
            humidity: currentData.main.humidity,
            wind: currentData.wind.speed,
            icon: currentData.weather?.[0]?.icon
              ? `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`
              : "/placeholder.png",
          },
          forecast: forecastList,
        });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to fetch weather");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [selectedCity]);

  return (
    <Card className="w-full max-w-8xl mx-auto p-4 sm:p-6 bg-white dark:bg-gray-800">
      {/* Header */}
      <CardHeader className="text-center mb-4 flex flex-col sm:flex-row sm:justify-between items-center gap-4">
        <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
          Weather
        </CardTitle>
        <Select value={String(selectedCity)} onValueChange={(val) => setSelectedCity(Number(val))}>
          <SelectTrigger className="w-36 sm:w-40">
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
      </CardHeader>

      {/* Loading / Error */}
      {loading && <p className="text-center mt-8">Loading weather...</p>}
      {error && <p className="text-red-500 text-center mt-8">{error}</p>}

      {/* Weather Data */}
      {weather && (
        <>
          {/* Current Weather */}
          <div className="text-center mb-4">
            <p className="text-lg sm:text-xl font-semibold">{weather.city}</p>
            <p className="text-base sm:text-lg">
              {weather.current.temp}°C - {weather.current.condition}
            </p>
            <div className="flex flex-col sm:flex-row justify-center mt-2 gap-2 sm:gap-4 text-sm sm:text-base">
              <p>Humidity: {weather.current.humidity}%</p>
              <p>Wind: {weather.current.wind} m/s</p>
            </div>
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <Image
              src={weather.current.icon}
              alt={weather.current.condition}
              width={128}
              height={128}
              className="sm:w-32 sm:h-32"
              priority
            />
          </div>

          {/* Forecast */}
          <div className="flex overflow-x-auto gap-4 sm:grid sm:grid-cols-5 sm:overflow-visible pb-2">
            {weather.forecast.map((f: ForecastItem, idx: number) => (
              <div
                key={`${f.date}-${idx}`}
                className="flex-shrink-0 w-28 sm:w-auto flex flex-col items-center bg-gradient-to-b from-blue-100 to-blue-50 dark:from-gray-700 dark:to-gray-600 p-2 rounded-lg shadow"
              >
                <p className="font-semibold text-sm sm:text-base">{f.date}</p>
                <Image src={f.icon} alt={f.condition} width={64} height={64} className="sm:w-16 sm:h-16" />
                <p className="text-sm sm:text-base">{f.temp}°C</p>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{f.condition}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
};

export default WeatherWidget;

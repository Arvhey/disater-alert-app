import { useState, useEffect } from 'react';

const POLOMOLOK_COORDS = {
  lat: 6.2187,
  lng: 125.0645
};

export const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      // Using Open-Meteo API (Free, no key required)
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${POLOMOLOK_COORDS.lat}&longitude=${POLOMOLOK_COORDS.lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto`
      );
      
      if (!response.ok) throw new Error('Weather data unavailable');
      
      const data = await response.json();
      setWeather(data.current);
      setError(null);
    } catch (err) {
      console.error('Weather Fetch Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    // Refresh every 15 minutes
    const interval = setInterval(fetchWeather, 900000);
    return () => clearInterval(interval);
  }, []);

  return { weather, loading, error, refresh: fetchWeather };
};

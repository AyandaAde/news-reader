import type { WeatherTemperatureUnit } from "@/lib/platform-settings";

export function fahrenheitToCelsius(temperatureF: number) {
  return (temperatureF - 32) * (5 / 9);
}

export function getWeatherTemperatureValue(
  temperatureF: number,
  unit: WeatherTemperatureUnit,
) {
  if (unit === "celsius") {
    return Math.round(fahrenheitToCelsius(temperatureF));
  }

  return Math.round(temperatureF);
}

export function formatWeatherTemperature(
  temperatureF: number,
  unit: WeatherTemperatureUnit,
) {
  const value = getWeatherTemperatureValue(temperatureF, unit);
  return unit === "celsius" ? `${value}°C` : `${value}°F`;
}

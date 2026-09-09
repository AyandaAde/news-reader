import {
  Cloud,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
  type LucideIcon,
} from "lucide-react";

export function getWeatherIcon(iconId: string): LucideIcon {
  switch (iconId) {
    case "i-sun":
      return Sun;
    case "i-cloud-sun":
      return CloudSun;
    case "i-cloud":
      return Cloud;
    case "i-cloud-rain":
      return CloudRain;
    case "i-cloud-snow":
      return CloudSnow;
    case "i-cloud-storm":
      return CloudLightning;
    default:
      return CloudSun;
  }
}

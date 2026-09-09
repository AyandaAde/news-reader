import type { IpLocation } from "@/lib/ipinfo";

export type SupportedCity = {
  id: string;
  label: string;
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
};

export const SUPPORTED_CITIES: SupportedCity[] = [
  {
    id: "atlanta-ga",
    label: "Atlanta, GA",
    city: "Atlanta",
    region: "Georgia",
    country: "US",
    latitude: 33.749,
    longitude: -84.388,
  },
  {
    id: "austin-tx",
    label: "Austin, TX",
    city: "Austin",
    region: "Texas",
    country: "US",
    latitude: 30.2672,
    longitude: -97.7431,
  },
  {
    id: "boston-ma",
    label: "Boston, MA",
    city: "Boston",
    region: "Massachusetts",
    country: "US",
    latitude: 42.3601,
    longitude: -71.0589,
  },
  {
    id: "chicago-il",
    label: "Chicago, IL",
    city: "Chicago",
    region: "Illinois",
    country: "US",
    latitude: 41.8781,
    longitude: -87.6298,
  },
  {
    id: "dallas-tx",
    label: "Dallas, TX",
    city: "Dallas",
    region: "Texas",
    country: "US",
    latitude: 32.7767,
    longitude: -96.797,
  },
  {
    id: "denver-co",
    label: "Denver, CO",
    city: "Denver",
    region: "Colorado",
    country: "US",
    latitude: 39.7392,
    longitude: -104.9903,
  },
  {
    id: "detroit-mi",
    label: "Detroit, MI",
    city: "Detroit",
    region: "Michigan",
    country: "US",
    latitude: 42.3314,
    longitude: -83.0458,
  },
  {
    id: "houston-tx",
    label: "Houston, TX",
    city: "Houston",
    region: "Texas",
    country: "US",
    latitude: 29.7604,
    longitude: -95.3698,
  },
  {
    id: "las-vegas-nv",
    label: "Las Vegas, NV",
    city: "Las Vegas",
    region: "Nevada",
    country: "US",
    latitude: 36.1699,
    longitude: -115.1398,
  },
  {
    id: "los-angeles-ca",
    label: "Los Angeles, CA",
    city: "Los Angeles",
    region: "California",
    country: "US",
    latitude: 34.0522,
    longitude: -118.2437,
  },
  {
    id: "miami-fl",
    label: "Miami, FL",
    city: "Miami",
    region: "Florida",
    country: "US",
    latitude: 25.7617,
    longitude: -80.1918,
  },
  {
    id: "nashville-tn",
    label: "Nashville, TN",
    city: "Nashville",
    region: "Tennessee",
    country: "US",
    latitude: 36.1627,
    longitude: -86.7816,
  },
  {
    id: "new-york-ny",
    label: "New York, NY",
    city: "New York",
    region: "New York",
    country: "US",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    id: "philadelphia-pa",
    label: "Philadelphia, PA",
    city: "Philadelphia",
    region: "Pennsylvania",
    country: "US",
    latitude: 39.9526,
    longitude: -75.1652,
  },
  {
    id: "phoenix-az",
    label: "Phoenix, AZ",
    city: "Phoenix",
    region: "Arizona",
    country: "US",
    latitude: 33.4484,
    longitude: -112.074,
  },
  {
    id: "pittsburgh-pa",
    label: "Pittsburgh, PA",
    city: "Pittsburgh",
    region: "Pennsylvania",
    country: "US",
    latitude: 40.4406,
    longitude: -79.9959,
  },
  {
    id: "portland-or",
    label: "Portland, OR",
    city: "Portland",
    region: "Oregon",
    country: "US",
    latitude: 45.5152,
    longitude: -122.6784,
  },
  {
    id: "san-diego-ca",
    label: "San Diego, CA",
    city: "San Diego",
    region: "California",
    country: "US",
    latitude: 32.7157,
    longitude: -117.1611,
  },
  {
    id: "san-francisco-ca",
    label: "San Francisco, CA",
    city: "San Francisco",
    region: "California",
    country: "US",
    latitude: 37.7749,
    longitude: -122.4194,
  },
  {
    id: "seattle-wa",
    label: "Seattle, WA",
    city: "Seattle",
    region: "Washington",
    country: "US",
    latitude: 47.6062,
    longitude: -122.3321,
  },
  {
    id: "washington-dc",
    label: "Washington, DC",
    city: "Washington",
    region: "District of Columbia",
    country: "US",
    latitude: 38.9072,
    longitude: -77.0369,
  },
];

export function getSupportedCityById(cityId: string) {
  return SUPPORTED_CITIES.find((city) => city.id === cityId) ?? null;
}

export function supportedCityToIpLocation(city: SupportedCity): IpLocation {
  return {
    ip: "",
    city: city.city,
    region: city.region,
    country: city.country,
    label: city.label,
    lat: city.latitude,
    lon: city.longitude,
  };
}

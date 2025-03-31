interface WeatherIcon {
  icon: string;
  description: string;
}

export function getWeatherIcon(code: number): WeatherIcon {
  const iconMap: { [key: number]: string } = {
    // Thunderstorm (2xx)
    200: "11d",
    201: "11d",
    202: "11d",
    210: "11d",
    211: "11d",
    212: "11d",
    221: "11d",
    230: "11d",
    231: "11d",
    232: "11d",

    // Drizzle (3xx)
    300: "09d",
    301: "09d",
    302: "09d",
    310: "09d",
    311: "09d",
    312: "09d",
    313: "09d",
    314: "09d",
    321: "09d",

    // Rain (5xx)
    500: "10d",
    501: "10d",
    502: "10d",
    503: "10d",
    504: "10d",
    511: "13d",
    520: "09d",
    521: "09d",
    522: "09d",
    531: "09d",

    // Snow (6xx)
    600: "13d",
    601: "13d",
    602: "13d",
    611: "13d",
    612: "13d",
    613: "13d",
    615: "13d",
    616: "13d",
    620: "13d",
    621: "13d",
    622: "13d",

    // Atmosphere (7xx)
    701: "50d",
    711: "50d",
    721: "50d",
    731: "50d",
    741: "50d",
    751: "50d",
    761: "50d",
    762: "50d",
    771: "50d",
    781: "50d",

    // Clear (800)
    800: "01d",

    // Clouds (80x)
    801: "02d",
    802: "03d",
    803: "04d",
    804: "04d",
  };

  const iconCode = iconMap[code] || "01d";

  return {
    icon: `https://openweathermap.org/img/wn/${iconCode}@2x.png`,
    description: getWeatherDescription(code),
  };
}

function getWeatherDescription(code: number): string {
  const descriptions: { [key: number]: string } = {
    // Thunderstorm
    200: "Thunderstorm with light rain",
    201: "Thunderstorm with rain",
    202: "Thunderstorm with heavy rain",
    210: "Light thunderstorm",
    211: "Thunderstorm",
    212: "Heavy thunderstorm",
    221: "Ragged thunderstorm",
    230: "Thunderstorm with light drizzle",
    231: "Thunderstorm with drizzle",
    232: "Thunderstorm with heavy drizzle",

    // Drizzle
    300: "Light intensity drizzle",
    301: "Drizzle",
    302: "Heavy intensity drizzle",
    310: "Light intensity drizzle rain",
    311: "Drizzle rain",
    312: "Heavy intensity drizzle rain",
    313: "Shower rain and drizzle",
    314: "Heavy shower rain and drizzle",
    321: "Shower drizzle",

    // Rain
    500: "Light rain",
    501: "Moderate rain",
    502: "Heavy intensity rain",
    503: "Very heavy rain",
    504: "Extreme rain",
    511: "Freezing rain",
    520: "Light intensity shower rain",
    521: "Shower rain",
    522: "Heavy intensity shower rain",
    531: "Ragged shower rain",

    // Snow
    600: "Light snow",
    601: "Snow",
    602: "Heavy snow",
    611: "Sleet",
    612: "Light shower sleet",
    613: "Shower sleet",
    615: "Light rain and snow",
    616: "Rain and snow",
    620: "Light shower snow",
    621: "Shower snow",
    622: "Heavy shower snow",

    // Atmosphere
    701: "Mist",
    711: "Smoke",
    721: "Haze",
    731: "Sand/dust whirls",
    741: "Fog",
    751: "Sand",
    761: "Dust",
    762: "Volcanic ash",
    771: "Squalls",
    781: "Tornado",

    // Clear
    800: "Clear sky",

    // Clouds
    801: "Few clouds",
    802: "Scattered clouds",
    803: "Broken clouds",
    804: "Overcast clouds",
  };

  return descriptions[code] || "Unknown weather condition";
}

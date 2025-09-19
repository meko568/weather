'use client'
import styles from "./page.module.css";
import {useState, useEffect} from "react"

export default function Home() {
  // Format a UNIX timestamp (seconds) for a target city's local time using
  // OpenWeather's timezone offset (in seconds). This avoids relying on the
  // browser's locale/timezone which can produce inconsistent output across environments.
  function getWindDirection(deg: number): string {
    const directions = ["North", "NorthEast", "East", "SouthEast", "South", "SouthWest", "West", "NorthWest"];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  }

  /**
   * Convert Unix timestamp + timezone offset into a human-readable local time.
   */
  function formatLocalTime(unix: number, timezoneOffset: number): string {
    const date = new Date((unix + timezoneOffset) * 1000);
    return date.toLocaleTimeString("en-US", {
      timeZone: "UTC",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }
  
  /**
   * Component for displaying sunrise time
   */function Sunrise({ unix, timezoneOffset }: { unix: number; timezoneOffset: number }) {
    return <span>{formatLocalTime(unix, timezoneOffset)}</span>;
  }
  
  /**
   * Component for displaying sunset time
   */function Sunset({ unix, timezoneOffset }: { unix: number; timezoneOffset: number }) {
    return <span>{formatLocalTime(unix, timezoneOffset)}</span>;
  }
  
  /**
   * Component for displaying the *current* local time (updates every second)
   */
  function LiveLocalTime({ timezoneOffset }: { timezoneOffset: number }) {
    const [time, setTime] = useState(() => formatLocalTime(Math.floor(Date.now() / 1000), timezoneOffset));
  
    useEffect(() => {
      const interval = setInterval(() => {
        setTime(formatLocalTime(Math.floor(Date.now() / 1000), timezoneOffset));
      }, 1000);
  
      return () => clearInterval(interval);
    }, [timezoneOffset]);
  
    return <span>{time}</span>;
  }
  
  
  // Strongly typed shapes for the OpenWeatherMap response (expanded per your pasted example)
  type WeatherMain = {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };

  type WeatherSys = {
    sunrise: number;
    sunset: number;
    country: string;
    type: number;
    id: number;
  };

  type WeatherWind = {
    speed: number;
    deg: number;
    gust: number;
  };

  type WeatherSummary = {
    main: string;
    description: string;
    icon?: string;
  };

  type Weather = {
    main: WeatherMain;
    sys: WeatherSys;
    wind: WeatherWind;
    visibility: number;
    timezone: number;
    weather: WeatherSummary[];
    // Additional fields from your example (optional)
    base: string;
    clouds: { all: number };
    cod: number;
    coord: { lon: number; lat: number };
    dt: number;
    id: number;
    name: string;
  };

  type CityWeather = {
    name: string;
    lat: number;
    lon: number;
    weather: Weather | null;
  };
  
  // Static list used for initial state and fetch; keeps effect dependency stable
  const initialCities: Array<Pick<CityWeather, 'name' | 'lat' | 'lon'>> = [
    { name: "Cairo", lat: 30.0444, lon: 31.2357 },
    { name: "Giza", lat: 30.0131, lon: 31.2089 },
    { name: "Alexandria", lat: 31.2001, lon: 29.9187 },
    { name: "Port Said", lat: 31.2653, lon: 32.3019 },
    { name: "Suez", lat: 29.9668, lon: 32.5498 },
    { name: "Ismailia", lat: 30.6043, lon: 32.2723 },
    { name: "Luxor", lat: 25.6872, lon: 32.6396 },
    { name: "Aswan", lat: 24.0889, lon: 32.8998 },
    { name: "Asyut", lat: 27.18, lon: 31.1837 },
    { name: "Beni Suef", lat: 29.0661, lon: 31.0994 },
    { name: "Faiyum", lat: 29.3084, lon: 30.8418 },
    { name: "Minya", lat: 28.1099, lon: 30.7503 },
    { name: "Sohag", lat: 26.556, lon: 31.6948 },
    { name: "Qena", lat: 26.1551, lon: 32.716 },
    { name: "Hurghada", lat: 27.2579, lon: 33.8116 },
    { name: "Damanhur", lat: 31.0341, lon: 30.4682 },
    { name: "Zagazig", lat: 30.5877, lon: 31.502 },
    { name: "Mansoura", lat: 31.0409, lon: 31.3785 },
    { name: "Tanta", lat: 30.7885, lon: 31.0004 },
    { name: "Shibin El Kom", lat: 30.5526, lon: 30.9963 },
    { name: "Kafr El Sheikh", lat: 31.1107, lon: 30.939 },
    { name: "Marsa Matruh", lat: 31.3543, lon: 27.2373 },
    { name: "Kharga", lat: 25.451, lon: 30.5466 },
    { name: "Arish", lat: 31.1316, lon: 33.7984 },
    { name: "El Tor", lat: 28.241, lon: 33.6222 },
    { name: "Damietta", lat: 31.4165, lon: 31.8133 },
    { name: "Banha", lat: 30.4591, lon: 31.1786 },
  ];

  const [cities, setCities] = useState<CityWeather[]>(
    initialCities.map((c) => ({ ...c, weather: null }))
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getWeather(lat: number, lon: number): Promise<Weather | null> {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=670bbd8c254a4185251fc8f5eae1302d&units=metric`
        );
        
        if (!res.ok) {
          throw new Error(`Failed to fetch weather data: ${res.statusText}`);
        }
        
        const data = await res.json();
        return data;
      } catch (err) {
        console.error(`Error fetching weather for lat=${lat}, lon=${lon}:`, err);
        return null;
      }
    }

    async function fetchAllWeather() {
      setLoading(true);
      setError(null);
      
      try {
        const results = await Promise.all(
          initialCities.map(c => getWeather(c.lat, c.lon))
        );

        const updated: CityWeather[] = initialCities.map((c, i) => ({
          ...c,
          weather: results[i]
        }));
        
        setCities(updated);
        
        // Check if any requests failed
        const failedRequests = results.filter(r => r === null).length;
        if (failedRequests > 0) {
          setError(`Failed to load weather for ${failedRequests} cities. Check console for details.`);
        }
      } catch (err) {
        console.error('Error in fetchAllWeather:', err);
        setError('Failed to load weather data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchAllWeather();
  }, []);

  const [query, setQuery] = useState<string>("");

  // Theme state with persistence (avoid client-only checks during initial render)
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // On mount, resolve the preferred theme and apply it
  useEffect(() => {
    setMounted(true);
    try {
      const saved = window.localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') {
        setTheme(saved);
        return;
      }
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement; // html element
    root.setAttribute('data-theme', theme);
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const filteredCities = cities.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Loading weather data...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {error && <div className={styles.error}>{error}</div>}
      <main className={styles.main}>
        <div className={styles.search}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cities..."
            aria-label="Search cities"
            className={styles.searchInput}
          />
          <button
            type="button"
            className={styles.themeToggle}
            onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
            aria-pressed={theme === 'dark'}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {mounted ? (theme === 'light' ? 'Dark mode' : 'Light mode') : 'Toggle theme'}
          </button>
        </div>
        <div className={styles.container}>
        {filteredCities.map((e, index) => (
  <div key={index} className={styles.city}>
    <h1>{e.name}</h1>
    {e.weather ? (
      <>
              <h1>Local Time: <LiveLocalTime timezoneOffset={e.weather.timezone} /></h1>
        <h2>{e.weather.weather[0].main}</h2>
        <h3>{e.weather.weather[0].description}</h3>
        <div className={styles.tempcontainer}>
          <p>Temperature: {e.weather.main.temp} °C</p>
          <p>Feels like: {e.weather.main.feels_like} °C</p>
          <p>Max temp: {e.weather.main.temp_max} °C</p>
          <p>Min temp: {e.weather.main.temp_min} °C</p>
        </div>
        <div className={styles.details}>
        <p>Sunrise: <Sunrise unix={e.weather.sys.sunrise} timezoneOffset={e.weather.timezone} /></p>
        <p>Sunset: <Sunset unix={e.weather.sys.sunset} timezoneOffset={e.weather.timezone} /></p>
          <p>Humidity: {e.weather.main.humidity}%</p>
          <p>
            Wind: {e.weather.wind.speed} m/s (
            {(e.weather.wind.speed * 3.6).toFixed(1)} km/h),{" "}
            {getWindDirection(e.weather.wind.deg)}
          </p>
          <p>Visibility: {(e.weather.visibility / 1000).toFixed(1)} km</p>
          <p>Pressure: {e.weather.main.pressure} hPa</p>
        </div>
      </>
    ) : (
      <p>Loading weather...</p>
    )}
  </div>
))}

        </div>
      </main>
    </div>
  );
}

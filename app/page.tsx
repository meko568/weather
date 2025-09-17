'use client'
import Image from "next/image";
import styles from "./page.module.css";
import {useState, useEffect} from "react"

export default function Home() {
  function gettime(time: number){
    const sunrise = time; // from API
    return new Date(sunrise * 1000).toLocaleTimeString(); // multiply by 1000 to convert seconds → ms
  }
  function getWindDirection(deg: number): string {
    const directions = ["North", "NorthEast", "East", "SouthEast", "South", "SouthWest", "West", "NourthWest"];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  }
  function formatLocalTime(unix: number, timezoneOffset: number): string {
    // unix is in seconds, timezoneOffset is in seconds
    const localTime = new Date((unix + timezoneOffset) * 1000);
    return localTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  }
  
  
  let [cities, setCities] = useState<any[]>([
    { name: "Cairo", lat: 30.0444, lon: 31.2357, weather: {} },
    { name: "Giza", lat: 30.0131, lon: 31.2089, weather: {} },
    { name: "Alexandria", lat: 31.2001, lon: 29.9187, weather: {} },
    { name: "Port Said", lat: 31.2653, lon: 32.3019, weather: {} },
    { name: "Suez", lat: 29.9668, lon: 32.5498, weather: {} },
    { name: "Ismailia", lat: 30.6043, lon: 32.2723, weather: {} },
    { name: "Luxor", lat: 25.6872, lon: 32.6396, weather: {} },
    { name: "Aswan", lat: 24.0889, lon: 32.8998, weather: {} },
    { name: "Asyut", lat: 27.18, lon: 31.1837, weather: {} },
    { name: "Beni Suef", lat: 29.0661, lon: 31.0994, weather: {} },
    { name: "Faiyum", lat: 29.3084, lon: 30.8418, weather: {} },
    { name: "Minya", lat: 28.1099, lon: 30.7503, weather: {} },
    { name: "Sohag", lat: 26.556, lon: 31.6948, weather: {} },
    { name: "Qena", lat: 26.1551, lon: 32.716, weather: {} },
    { name: "Hurghada", lat: 27.2579, lon: 33.8116, weather: {} },
    { name: "Damanhur", lat: 31.0341, lon: 30.4682, weather: {} },
    { name: "Zagazig", lat: 30.5877, lon: 31.502, weather: {} },
    { name: "Mansoura", lat: 31.0409, lon: 31.3785, weather: {} },
    { name: "Tanta", lat: 30.7885, lon: 31.0004, weather: {} },
    { name: "Shibin El Kom", lat: 30.5526, lon: 30.9963, weather: {} },
    { name: "Kafr El Sheikh", lat: 31.1107, lon: 30.939, weather: {} },
    { name: "Marsa Matruh", lat: 31.3543, lon: 27.2373, weather: {} },
    { name: "Kharga", lat: 25.451, lon: 30.5466, weather: {} },
    { name: "Arish", lat: 31.1316, lon: 33.7984, weather: {} },
    { name: "El Tor", lat: 28.241, lon: 33.6222, weather: {} },
    { name: "Damietta", lat: 31.4165, lon: 31.8133, weather: {} },
    { name: "Banha", lat: 30.4591, lon: 31.1786, weather: {} }
  ]);
  useEffect(() => {
    async function getWeather(lat:number, lon: number): Promise<any> {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=670bbd8c254a4185251fc8f5eae1302d&units=metric`
      );
      return await res.json();
    }
  
    Promise.all(cities.map(c => getWeather(c.lat, c.lon)))
      .then((results) => {
        const updated = cities.map((c, i) => ({
          ...c,
          weather: results[i]
        }));
        setCities(updated);
      });
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

  return (
    <div className={styles.page}>
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
    {e.weather.main ? (
      <>
        <h1>{formatLocalTime(e.weather.sys.sunrise, e.weather.timezone)}</h1>
        <h2>{e.weather.weather[0].main}</h2>
        <h3>{e.weather.weather[0].description}</h3>
        <div className={styles.tempcontainer}>
          <p>Temperature: {e.weather.main.temp} °C</p>
          <p>Feels like: {e.weather.main.feels_like} °C</p>
          <p>Max temp: {e.weather.main.temp_max} °C</p>
          <p>Min temp: {e.weather.main.temp_min} °C</p>
        </div>
        <div className={styles.details}>
          <p>Sunrise: {gettime(e.weather.sys.sunrise)}</p>
          <p>Sunset: {gettime(e.weather.sys.sunset)}</p>
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

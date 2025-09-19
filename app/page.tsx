'use client'
import styles from "./page.module.css";
import { useState, useEffect, useMemo } from "react"

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
    country?: string;
    type?: number;
    id?: number;
    timezone?: number;
  };

  type WeatherWind = {
    speed: number;
    deg: number;
    gust?: number;
  };

  type WeatherSummary = {
    id: number;
    main: string;
    description: string;
    icon: string;
  };

  type Weather = {
    coord: { lon: number; lat: number };
    weather: Array<WeatherSummary>;
    base: string;
    main: WeatherMain;
    visibility: number;
    wind: WeatherWind;
    clouds: { all: number };
    dt: number;
    sys: WeatherSys;
    timezone: number;
    id: number;
    name: string;
    cod: number;
  };

  type CityWeather = {
    name: string;
    country: string;
    lat: number;
    lon: number;
    weather: Weather | null;
  };
  
  // List of major world cities with their coordinates and country codes
  const majorCities = [
    // Africa - Egypt
    { name: 'Cairo', country: 'EG', lat: 30.0444, lon: 31.2357 },
    { name: 'Alexandria', country: 'EG', lat: 31.2001, lon: 29.9187 },
    { name: 'Giza', country: 'EG', lat: 30.0131, lon: 31.2089 },
    { name: 'Shubra El-Kheima', country: 'EG', lat: 30.1238, lon: 31.2397 },
    { name: 'Port Said', country: 'EG', lat: 31.2565, lon: 32.2841 },
    { name: 'Suez', country: 'EG', lat: 29.9737, lon: 32.5263 },
    { name: 'Luxor', country: 'EG', lat: 25.6872, lon: 32.6396 },
    { name: 'Al-Mansura', country: 'EG', lat: 31.0409, lon: 31.3785 },
    { name: 'El-Mahalla El-Kubra', country: 'EG', lat: 30.9697, lon: 31.1642 },
    { name: 'Tanta', country: 'EG', lat: 30.7826, lon: 30.9995 },
    { name: 'Asyut', country: 'EG', lat: 27.1783, lon: 31.1859 },
    { name: 'Ismailia', country: 'EG', lat: 30.6043, lon: 32.2723 },
    { name: 'Fayyum', country: 'EG', lat: 29.3084, lon: 30.8441 },
    { name: 'Zagazig', country: 'EG', lat: 30.5877, lon: 31.5020 },
    { name: 'Aswan', country: 'EG', lat: 24.0889, lon: 32.8998 },
    { name: 'Damietta', country: 'EG', lat: 31.4165, lon: 31.8133 },
    { name: 'Damanhur', country: 'EG', lat: 31.0411, lon: 30.4730 },
    { name: 'Al-Minya', country: 'EG', lat: 28.1099, lon: 30.7503 },
    { name: 'Beni Suef', country: 'EG', lat: 29.0667, lon: 31.0833 },
    { name: 'Qena', country: 'EG', lat: 26.1644, lon: 32.7267 },
    { name: 'Sohag', country: 'EG', lat: 26.5569, lon: 31.6948 },
    { name: 'Hurghada', country: 'EG', lat: 27.2579, lon: 33.8116 },
    { name: '6th of October City', country: 'EG', lat: 29.9361, lon: 30.9269 },
    { name: 'Sharm El Sheikh', country: 'EG', lat: 27.9158, lon: 34.3300 },
    { name: 'Arish', country: 'EG', lat: 31.1325, lon: 33.8031 },
    { name: 'El Arish', country: 'EG', lat: 31.1325, lon: 33.8031 },
    { name: '10th of Ramadan City', country: 'EG', lat: 30.2964, lon: 31.7417 },
    { name: 'Lagos', country: 'NG', lat: 6.5244, lon: 3.3792 },
    { name: 'Kano', country: 'NG', lat: 12.0022, lon: 8.5927 },
    { name: 'Ibadan', country: 'NG', lat: 7.3776, lon: 3.9470 },
    { name: 'Johannesburg', country: 'ZA', lat: -26.2041, lon: 28.0473 },
    { name: 'Cape Town', country: 'ZA', lat: -33.9249, lon: 18.4241 },
    { name: 'Durban', country: 'ZA', lat: -29.8587, lon: 31.0218 },
    { name: 'Nairobi', country: 'KE', lat: -1.2921, lon: 36.8219 },
    { name: 'Mombasa', country: 'KE', lat: -4.0435, lon: 39.6682 },
    { name: 'Casablanca', country: 'MA', lat: 33.5731, lon: -7.5898 },
    { name: 'Rabat', country: 'MA', lat: 33.9716, lon: -6.8498 },
    { name: 'Tunis', country: 'TN', lat: 36.8065, lon: 10.1815 },
    { name: 'Algiers', country: 'DZ', lat: 36.7538, lon: 3.0588 },
    
    // Asia
    { name: 'Tokyo', country: 'JP', lat: 35.6762, lon: 139.6503 },
    { name: 'Osaka', country: 'JP', lat: 34.6937, lon: 135.5023 },
    { name: 'Kyoto', country: 'JP', lat: 35.0116, lon: 135.7681 },
    { name: 'Delhi', country: 'IN', lat: 28.6139, lon: 77.2090 },
    { name: 'Mumbai', country: 'IN', lat: 19.0760, lon: 72.8777 },
    { name: 'Bangalore', country: 'IN', lat: 12.9716, lon: 77.5946 },
    { name: 'Chennai', country: 'IN', lat: 13.0827, lon: 80.2707 },
    { name: 'Kolkata', country: 'IN', lat: 22.5726, lon: 88.3639 },
    { name: 'Shanghai', country: 'CN', lat: 31.2304, lon: 121.4737 },
    { name: 'Beijing', country: 'CN', lat: 39.9042, lon: 116.4074 },
    { name: 'Guangzhou', country: 'CN', lat: 23.1291, lon: 113.2644 },
    { name: 'Shenzhen', country: 'CN', lat: 22.5431, lon: 114.0579 },
    { name: 'Istanbul', country: 'TR', lat: 41.0082, lon: 28.9784 },
    { name: 'Ankara', country: 'TR', lat: 39.9334, lon: 32.8597 },
    { name: 'Moscow', country: 'RU', lat: 55.7558, lon: 37.6173 },
    { name: 'Saint Petersburg', country: 'RU', lat: 59.9343, lon: 30.3351 },
    { name: 'Seoul', country: 'KR', lat: 37.5665, lon: 126.9780 },
    { name: 'Busan', country: 'KR', lat: 35.1796, lon: 129.0756 },
    { name: 'Bangkok', country: 'TH', lat: 13.7563, lon: 100.5018 },
    { name: 'Singapore', country: 'SG', lat: 1.3521, lon: 103.8198 },
    { name: 'Kuala Lumpur', country: 'MY', lat: 3.1390, lon: 101.6869 },
    { name: 'Jakarta', country: 'ID', lat: -6.2088, lon: 106.8456 },
    { name: 'Manila', country: 'PH', lat: 14.5995, lon: 120.9842 },
    { name: 'Hanoi', country: 'VN', lat: 21.0278, lon: 105.8342 },
    { name: 'Ho Chi Minh City', country: 'VN', lat: 10.8231, lon: 106.6297 },
    
    // Europe
    { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 },
    { name: 'Birmingham', country: 'GB', lat: 52.4862, lon: -1.8904 },
    { name: 'Manchester', country: 'GB', lat: 53.4808, lon: -2.2426 },
    { name: 'Paris', country: 'FR', lat: 48.8566, lon: 2.3522 },
    { name: 'Marseille', country: 'FR', lat: 43.2965, lon: 5.3698 },
    { name: 'Lyon', country: 'FR', lat: 45.7640, lon: 4.8357 },
    { name: 'Berlin', country: 'DE', lat: 52.5200, lon: 13.4050 },
    { name: 'Munich', country: 'DE', lat: 48.1351, lon: 11.5820 },
    { name: 'Hamburg', country: 'DE', lat: 53.5511, lon: 9.9937 },
    { name: 'Rome', country: 'IT', lat: 41.9028, lon: 12.4964 },
    { name: 'Milan', country: 'IT', lat: 45.4642, lon: 9.1900 },
    { name: 'Naples', country: 'IT', lat: 40.8518, lon: 14.2681 },
    { name: 'Madrid', country: 'ES', lat: 40.4168, lon: -3.7038 },
    { name: 'Barcelona', country: 'ES', lat: 41.3851, lon: 2.1734 },
    { name: 'Amsterdam', country: 'NL', lat: 52.3676, lon: 4.9041 },
    { name: 'Brussels', country: 'BE', lat: 50.8503, lon: 4.3517 },
    { name: 'Vienna', country: 'AT', lat: 48.2082, lon: 16.3738 },
    { name: 'Prague', country: 'CZ', lat: 50.0755, lon: 14.4378 },
    { name: 'Warsaw', country: 'PL', lat: 52.2297, lon: 21.0122 },
    { name: 'Budapest', country: 'HU', lat: 47.4979, lon: 19.0402 },
    { name: 'Athens', country: 'GR', lat: 37.9838, lon: 23.7275 },
    { name: 'Lisbon', country: 'PT', lat: 38.7223, lon: -9.1393 },
    { name: 'Stockholm', country: 'SE', lat: 59.3293, lon: 18.0686 },
    { name: 'Oslo', country: 'NO', lat: 59.9139, lon: 10.7522 },
    { name: 'Helsinki', country: 'FI', lat: 60.1699, lon: 24.9384 },
    { name: 'Copenhagen', country: 'DK', lat: 55.6761, lon: 12.5683 },
    
    // North America
    { name: 'New York', country: 'US', lat: 40.7128, lon: -74.0060 },
    { name: 'Los Angeles', country: 'US', lat: 34.0522, lon: -118.2437 },
    { name: 'Chicago', country: 'US', lat: 41.8781, lon: -87.6298 },
    { name: 'Houston', country: 'US', lat: 29.7604, lon: -95.3698 },
    { name: 'Phoenix', country: 'US', lat: 33.4484, lon: -112.0740 },
    { name: 'Philadelphia', country: 'US', lat: 39.9526, lon: -75.1652 },
    { name: 'San Antonio', country: 'US', lat: 29.4241, lon: -98.4936 },
    { name: 'San Diego', country: 'US', lat: 32.7157, lon: -117.1611 },
    { name: 'Dallas', country: 'US', lat: 32.7767, lon: -96.7970 },
    { name: 'San Jose', country: 'US', lat: 37.3382, lon: -121.8863 },
    { name: 'Toronto', country: 'CA', lat: 43.6532, lon: -79.3832 },
    { name: 'Montreal', country: 'CA', lat: 45.5017, lon: -73.5673 },
    { name: 'Vancouver', country: 'CA', lat: 49.2827, lon: -123.1207 },
    { name: 'Mexico City', country: 'MX', lat: 19.4326, lon: -99.1332 },
    { name: 'Guadalajara', country: 'MX', lat: 20.6597, lon: -103.3496 },
    { name: 'Monterrey', country: 'MX', lat: 25.6866, lon: -100.3161 },
    { name: 'Havana', country: 'CU', lat: 23.1136, lon: -82.3666 },
    
    // South America
    { name: 'São Paulo', country: 'BR', lat: -23.5505, lon: -46.6333 },
    { name: 'Rio de Janeiro', country: 'BR', lat: -22.9068, lon: -43.1729 },
    { name: 'Brasília', country: 'BR', lat: -15.7975, lon: -47.8919 },
    { name: 'Buenos Aires', country: 'AR', lat: -34.6037, lon: -58.3816 },
    { name: 'Córdoba', country: 'AR', lat: -31.4201, lon: -64.1888 },
    { name: 'Lima', country: 'PE', lat: -12.0464, lon: -77.0428 },
    { name: 'Bogotá', country: 'CO', lat: 4.7110, lon: -74.0721 },
    { name: 'Medellín', country: 'CO', lat: 6.2442, lon: -75.5812 },
    { name: 'Santiago', country: 'CL', lat: -33.4489, lon: -70.6693 },
    { name: 'Caracas', country: 'VE', lat: 10.4806, lon: -66.9036 },
    
    // Oceania
    { name: 'Sydney', country: 'AU', lat: -33.8688, lon: 151.2093 },
    { name: 'Melbourne', country: 'AU', lat: -37.8136, lon: 144.9631 },
    { name: 'Brisbane', country: 'AU', lat: -27.4698, lon: 153.0251 },
    { name: 'Perth', country: 'AU', lat: -31.9505, lon: 115.8605 },
    { name: 'Adelaide', country: 'AU', lat: -34.9285, lon: 138.6007 },
    { name: 'Auckland', country: 'NZ', lat: -36.8485, lon: 174.7633 },
    { name: 'Wellington', country: 'NZ', lat: -41.2865, lon: 174.7762 },
    { name: 'Christchurch', country: 'NZ', lat: -43.5321, lon: 172.6362 },
  ];
  
  const [cities, setCities] = useState<CityWeather[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('EG'); // Default to Egypt
  const [availableCities, setAvailableCities] = useState<Array<{name: string, lat: number, lon: number}>>([]);

  // Get unique countries for filter with search functionality
  const [countrySearch, setCountrySearch] = useState('');
  const countries = useMemo(() => {
    const countryMap = new Map();
    
    // Process all cities to get unique countries with their names
    majorCities.forEach(city => {
      if (!countryMap.has(city.country)) {
        countryMap.set(city.country, {
          code: city.country,
          name: new Intl.DisplayNames(['en'], { type: 'region' }).of(city.country) || city.country
        });
      }
    });

    // Convert to array and sort by country name
    let result = Array.from(countryMap.values())
      .sort((a, b) => a.name.localeCompare(b.name));

    // Filter by search term if any
    if (countrySearch.trim()) {
      const searchLower = countrySearch.toLowerCase().trim();
      result = result.filter(country => 
        country.name.toLowerCase().includes(searchLower) ||
        country.code.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [countrySearch]);

  // Fetch cities for the selected country
  useEffect(() => {
    async function fetchCitiesByCountry(countryCode: string) {
      try {
        setLoading(true);
        setError(null);
        
        // Filter major cities by selected country
        const countryCities = majorCities.filter(city => city.country === countryCode);
        setAvailableCities(countryCities);
        
        // Fetch weather for ALL cities in the country (no limit)
        const results = await Promise.all(
          countryCities.map(async (city) => {
            try {
              const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=670bbd8c254a4185251fc8f5eae1302d&units=metric`
              );
              
              if (!res.ok) {
                console.error(`Failed to fetch weather for ${city.name}:`, res.statusText);
                return null;
              }
              
              const weatherData = await res.json();
              return {
                name: city.name,
                country: city.country,
                lat: city.lat,
                lon: city.lon,
                weather: weatherData
              };
            } catch (err) {
              console.error(`Error fetching weather for ${city.name}:`, err);
              return null;
            }
          })
        );
        
        // Filter out failed requests and update state
        const successfulResults = results.filter((result): result is CityWeather => result !== null);
        setCities(successfulResults);
        
        if (successfulResults.length === 0) {
          setError('No weather data available for the selected country.');
        } else if (successfulResults.length < results.length) {
          setError(`Failed to load weather for ${results.length - successfulResults.length} cities.`);
        }
      } catch (err) {
        console.error('Error fetching cities by country:', err);
        setError('Failed to load city data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    if (selectedCountry && selectedCountry !== 'all') {
      fetchCitiesByCountry(selectedCountry);
    } else {
      setCities([]);
      setAvailableCities([]);
    }
  }, [selectedCountry]);
  
  // Get country name from country code
  const getCountryName = (code: string) => {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code;
  };

  // Filter cities based on search term (city name or country name)
  const filteredCities = useMemo(() => {
    if (!searchTerm.trim()) return cities;
    
    const searchLower = searchTerm.toLowerCase().trim();
    return cities.filter(city => {
      const countryName = getCountryName(city.country).toLowerCase();
      return (
        city.name.toLowerCase().includes(searchLower) ||
        city.country.toLowerCase().includes(searchLower) ||
        countryName.includes(searchLower)
      );
    });
  }, [cities, searchTerm]);

  // Theme state with server-side rendering support
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // On mount, resolve the preferred theme and apply it
  useEffect(() => {
    setMounted(true);
    // Only run on client-side
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('theme');
        if (saved === 'light' || saved === 'dark') {
          setTheme(saved);
          return;
        }
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
      } catch (e) {
        console.error('Failed to load theme preference:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement; // html element
    root.setAttribute('data-theme', theme);
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  // Search and filter logic is now handled by the useMemo hook above

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
          <div className={styles.searchContainer}>
            <div className={styles.searchGroup}>
              <label htmlFor="countrySearch" className={styles.searchLabel}>Search Country</label>
              <div className={styles.countrySearchContainer}>
                <span className={styles.searchIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </span>
                <input
                  id="countrySearch"
                  type="text"
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  placeholder="Search country..."
                  className={styles.countrySearchInput}
                  aria-label="Search country"
                />
                <div className={styles.countrySelectContainer}>
                  <select
                    value={selectedCountry}
                    onChange={(e) => {
                      setSelectedCountry(e.target.value);
                      setCountrySearch(''); // Clear search after selection
                    }}
                    className={styles.countrySelect}
                    aria-label="Select country"
                  >
                    {countries.length === 0 ? (
                      <option value="" disabled>No countries found</option>
                    ) : (
                      countries.map(country => (
                        <option key={country.code} value={country.code}>
                          {country.name} ({country.code})
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.searchGroup}>
              <label htmlFor="citySearch" className={styles.searchLabel}>Search City</label>
              <div style={{ position: 'relative' }}>
                <span className={styles.searchIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </span>
                <input
                  id="citySearch"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={selectedCountry 
                    ? `Search in ${countries.find(c => c.code === selectedCountry)?.name || 'selected country'}...`
                    : 'Select a country first'}
                  aria-label="Search cities"
                  className={styles.searchInput}
                  disabled={!selectedCountry || selectedCountry === 'all'}
                />
              </div>
            </div>
          </div>
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
    <h1>{e.name}, {new Intl.DisplayNames(['en'], { type: 'region' }).of(e.country)}</h1>
    {e.weather ? (
      <>
        <h2><LiveLocalTime timezoneOffset={e.weather.timezone} /></h2>
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

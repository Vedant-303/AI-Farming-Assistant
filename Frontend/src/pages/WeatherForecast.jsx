import React, { useState, useEffect } from 'react';
import { CloudRain, Sun, Cloud, Wind, Droplets, MapPin, Loader2, RefreshCw, Search } from 'lucide-react';
import './WeatherForecast.css';

const WEATHER_CODES = {
    0: { label: 'Clear sky', icon: <Sun className="weather-icon clear" /> },
    1: { label: 'Mainly clear', icon: <Sun className="weather-icon clear" /> },
    2: { label: 'Partly cloudy', icon: <Cloud className="weather-icon cloudy" /> },
    3: { label: 'Overcast', icon: <Cloud className="weather-icon cloudy" /> },
    45: { label: 'Fog', icon: <Cloud className="weather-icon foggy" /> },
    48: { label: 'Depositing rime fog', icon: <Cloud className="weather-icon foggy" /> },
    51: { label: 'Light drizzle', icon: <CloudRain className="weather-icon rainy" /> },
    53: { label: 'Moderate drizzle', icon: <CloudRain className="weather-icon rainy" /> },
    55: { label: 'Dense drizzle', icon: <CloudRain className="weather-icon rainy" /> },
    61: { label: 'Slight rain', icon: <CloudRain className="weather-icon rainy" /> },
    63: { label: 'Moderate rain', icon: <CloudRain className="weather-icon rainy" /> },
    65: { label: 'Heavy rain', icon: <CloudRain className="weather-icon rainy" /> },
    71: { label: 'Slight snow fall', icon: <Cloud className="weather-icon snowy" /> },
    80: { label: 'Slight rain showers', icon: <CloudRain className="weather-icon rainy" /> },
    95: { label: 'Thunderstorm', icon: <CloudRain className="weather-icon stormy" /> },
};

const getIcon = (code) => {
    if (WEATHER_CODES[code]) return WEATHER_CODES[code].icon;
    return <Cloud className="weather-icon cloudy" />;
};

const getLabel = (code) => {
    if (WEATHER_CODES[code]) return WEATHER_CODES[code].label;
    return 'Unknown';
};

const WeatherForecast = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [locationName, setLocationName] = useState('Detecting Location...');
    const [searchInput, setSearchInput] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchInput.trim()) return;

        setIsSearching(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:8000/api/geocode?query=${encodeURIComponent(searchInput)}`);
            if (!response.ok) throw new Error('Location not found');
            const data = await response.json();

            if (data && data.length > 0) {
                const result = data[0];
                const newLat = result.latitude;
                const newLon = result.longitude;
                const displayName = result.admin1 ? `${result.name}, ${result.admin1}` : `${result.name}, ${result.country || ''}`;
                setLocationName(displayName);
                setSearchInput('');
                fetchWeather(newLat, newLon);
            } else {
                throw new Error('Location not found');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSearching(false);
        }
    };

    const fetchWeather = async (lat, lon) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:8000/api/weather?lat=${lat}&lon=${lon}`);
            if (!response.ok) throw new Error('Failed to fetch weather data from server');
            const result = await response.json();
            setData(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getUserLocation = () => {
        setLoading(true);
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    // Fetch city name from backend
                    fetch(`http://localhost:8000/api/reverse-geocode?lat=${latitude}&lon=${longitude}`)
                        .then(res => {
                            if (!res.ok) throw new Error('Geocode failed');
                            return res.json();
                        })
                        .then(geoData => {
                            if (geoData.display_name) {
                                setLocationName(geoData.display_name);
                            } else {
                                setLocationName(`Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`);
                            }
                        })
                        .catch(() => {
                            setLocationName(`Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`);
                        });
                    fetchWeather(latitude, longitude);
                },
                (err) => {
                    console.warn('Geolocation blocked or failed. Using default location (New Delhi).', err);
                    setLocationName('New Delhi, India (Default)');
                    fetchWeather(28.61, 77.20); // Default to New Delhi
                }
            );
        } else {
            setLocationName('New Delhi, India (Default)');
            fetchWeather(28.61, 77.20);
        }
    };

    useEffect(() => {
        getUserLocation();
    }, []);

    if (loading && !data) {
        return (
            <div className="weather-container section">
                <div className="glass-panel text-center loading-state">
                    <Loader2 className="spinner" size={48} />
                    <h2>Fetching localized weather...</h2>
                    <p>Please allow location access if prompted.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="weather-container section">
                <div className="glass-panel error-state">
                    <h2>Oops! Data Unavailable</h2>
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={getUserLocation}>
                        <RefreshCw size={18} /> Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="weather-container section animate-fade-in">
            <div className="weather-header">
                <h1 className="brand-title">Smart Weather Forecast</h1>
                <div className="location-badge">
                    <MapPin size={18} /> {locationName}
                    <button className="refresh-btn" onClick={getUserLocation} title="Auto-detect Location">
                        <RefreshCw size={14} />
                    </button>
                </div>

                <form className="search-bar-container" onSubmit={handleSearch}>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search for a city..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        disabled={isSearching}
                    />
                    <button type="submit" className="search-btn" disabled={isSearching || !searchInput.trim()}>
                        {isSearching ? <Loader2 className="spinner" size={18} /> : <Search size={18} />}
                    </button>
                </form>
            </div>

            {data && (
                <>
                    {/* Current Weather Card */}
                    <div className="current-weather-card glass-panel">
                        <div className="current-main">
                            <div className="current-icon-lg">
                                {getIcon(data.current.weather_code)}
                            </div>
                            <div className="current-temp-info">
                                <span className="current-temp">{data.current.temperature_2m}°C</span>
                                <span className="current-condition">{getLabel(data.current.weather_code)}</span>
                            </div>
                        </div>

                        <div className="current-details">
                            <div className="detail-item">
                                <Wind size={20} />
                                <div>
                                    <p className="detail-label">Wind</p>
                                    <p className="detail-val">{data.current.wind_speed_10m} km/h</p>
                                </div>
                            </div>
                            {data.current && data.current.relative_humidity_2m !== undefined && (
                                <div className="detail-item">
                                    <Droplets size={20} />
                                    <div>
                                        <p className="detail-label">Humidity</p>
                                        <p className="detail-val">{data.current.relative_humidity_2m}%</p>
                                    </div>
                                </div>
                            )}
                            {data.current && data.current.precipitation !== undefined && (
                                <div className="detail-item">
                                    <CloudRain size={20} />
                                    <div>
                                        <p className="detail-label">Precip</p>
                                        <p className="detail-val">{data.current.precipitation} mm</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <h2 className="forecast-title">7-Day Outlook</h2>

                    {/* Daily Forecast Scroll */}
                    <div className="forecast-scroll-container">
                        {data.daily.time.map((dateStr, index) => {
                            const dateObj = new Date(dateStr);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                            const isToday = index === 0;

                            return (
                                <div key={dateStr} className={`forecast-card glass-panel ${isToday ? 'active-day' : ''}`}>
                                    <p className="fc-day">{isToday ? 'Today' : dayName}</p>
                                    <p className="fc-date">{dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                    <div className="fc-icon">
                                        {getIcon(data.daily.weather_code[index])}
                                    </div>
                                    <div className="fc-temps">
                                        <span className="fc-max">{Math.round(data.daily.temperature_2m_max[index])}°</span>
                                        <span className="fc-min">{Math.round(data.daily.temperature_2m_min[index])}°</span>
                                    </div>
                                    {data.daily.precipitation_sum[index] > 0 && (
                                        <div className="fc-precip">
                                            <Droplets size={12} /> {data.daily.precipitation_sum[index]}mm
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default WeatherForecast;

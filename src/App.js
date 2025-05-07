import React, { useEffect, useState } from 'react';
import HeroSection from './components/HeroSection';
import WeatherTimeline from './components/WeatherTimeline';
import WindMapSection from './components/WindMap';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [coords, setCoords] = useState({ latitude: 9.9312, longitude: 76.2673 }); // Kochi by default
  const [weather, setWeather] = useState(null);
  const [locationInfo, setLocationInfo] = useState(null);

  const fetchWeather = async (lat, lon) => {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation,windspeed_10m,weathercode&daily=sunrise,sunset&current_weather=true&past_days=3&timezone=auto`;
      const res = await fetch(url);
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      console.error('Failed to fetch weather data:', err);
    }
  };

  const fetchLocationName = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );
      const data = await res.json();

      if (data) {
        const country = data.countryName;
        const city = data.locality || data.city;

        const adminInfo = data.localityInfo?.administrative || [];
        const districtObj = adminInfo.find(item =>
          item.adminLevel === 5 || item.description?.toLowerCase().includes('district')
        );
        const district = districtObj?.name;

        setLocationInfo({ country, district, city });
      }
    } catch (err) {
      console.error('Failed to reverse geocode', err);
    }
  };

  useEffect(() => {
    fetchWeather(coords.latitude, coords.longitude);
    fetchLocationName(coords.latitude, coords.longitude);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCoords({ latitude, longitude });
          fetchWeather(latitude, longitude);
          fetchLocationName(latitude, longitude);
        },
        (error) => {
          console.warn('Geolocation permission denied or failed:', error.message);
        }
      );
    } else {
      console.warn('Geolocation not supported by browser');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header
        setCoords={setCoords}
        fetchWeather={fetchWeather}
        fetchLocationName={fetchLocationName}
        setLocationInfo={setLocationInfo}
      />

      {weather && (
        <HeroSection
          current={weather.current_weather}
          locationInfo={locationInfo}
          setCoords={setCoords}
          fetchWeather={fetchWeather}
          setLocationInfo={setLocationInfo}
          fetchLocationName={fetchLocationName}
          pastData={weather.hourly}
          weather={weather}
        />
      )}

      {weather ? (
        <WeatherTimeline data={weather.hourly} timezone={weather.timezone} />
      ) : (
        <p className="text-center py-10">Loading weather data...</p>
      )}

      {coords && <WindMapSection latitude={coords.latitude} longitude={coords.longitude} />}
      <Footer />
    </div>
  );
}

export default App;

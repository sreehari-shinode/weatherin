import React from 'react';
import Lottie from 'lottie-react';
import { WiThermometer, WiRaindrop, WiStrongWind } from 'react-icons/wi';
import sunny from '../animations/sunny1.json';
import snow from '../animations/snowy.json';
import sunset from '../animations/sunset.json';
import sunrise from '../animations/sunrise.json';
import starrynight from '../animations/starrynight.json';
import rainyday from '../animations/rainyday.json';
import rainynight from '../animations/rainynight.json';


const getAnimation = (code, isDay) => {
  const isRain = code >= 51 && code < 80;      
  const isSnow = code >= 71 && code < 80;
  const isCloud = code >= 3 && code < 45;

  if (isSnow) return snow;

  if (isRain) {
    return isDay ? rainyday : rainynight;
  }

  if (code < 3 || isCloud) {
    return isDay ? sunny : starrynight;
  }

  return isDay ? sunny : starrynight;
};

const getQuote = (animationType) => {
  switch (animationType) {
    case sunny:
      return "Perfect beach day weather — grab your shades and flip-flops!";
    case starrynight:
      return "The best seat in the house for stargazing — your roof is waiting";
    case rainyday:
      return "Don't forget your umbrella today — unless you're into the wet-hair look";
    case rainynight:
      return "Perfect excuse to light up the fireplace — or to take a sip of hot chocolate"
    case snow:
      return "Time to dust off those snow boots — Winter is coming";
    default:
      return "";
  }
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
};


const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
};

// Get next sunrise/sunset after the current time
const getNextSunTimes = (sunriseTimes, sunsetTimes, currentTimeStr) => {
  const currentTime = new Date(currentTimeStr);

  const nextSunrise = sunriseTimes
    .map((t) => new Date(t))
    .find((t) => t > currentTime);

  const nextSunset = sunsetTimes
    .map((t) => new Date(t))
    .find((t) => t > currentTime);

  return {
    nextSunrise,
    nextSunset,
  };
};

const HeroSection = ({ current, locationInfo, pastData, weather }) => {
  const animationData = getAnimation(current.weathercode, current.is_day);
  const quote = getQuote(animationData);
  const grouped = {};

  if (pastData?.time?.length) {
    pastData.time.forEach((t, i) => {
      const date = t.split('T')[0];
      if (!grouped[date]) {
        grouped[date] = { temps: [], rain: 0, wind: [], codes: [] };
      }

      const temp = pastData.temperature_2m?.[i];
      const rain = pastData.precipitation?.[i];
      const wind = pastData.windspeed_10m?.[i];
      const code = pastData.weathercode?.[i];

      if (typeof temp === 'number') grouped[date].temps.push(temp);
      if (typeof rain === 'number') grouped[date].rain += rain;
      if (typeof wind === 'number') grouped[date].wind.push(wind);
      if (typeof code === 'number') grouped[date].codes.push(code);
    });
  }

  const today = new Date().toISOString()?.split('T')[0];

  const past3Days = Object.entries(grouped)
    .filter(([date]) => date < today)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .slice(-3)
    .map(([date, { temps, rain, wind, codes }]) => ({
      date,
      min: Math.min(...temps),
      max: Math.max(...temps),
      rain: rain.toFixed(1),
      wind: (wind.reduce((a, b) => a + b, 0) / wind.length).toFixed(1),
      code: codes[Math.floor(codes.length / 2)],
    }));

  // Get correct upcoming sunrise/sunset based on current time
  const { nextSunrise, nextSunset } = getNextSunTimes(
    weather?.daily?.sunrise || [],
    weather?.daily?.sunset || [],
    current.time
  );

  const getWindDirection = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };
  

  return (
    <div className="mt-2 mr-4 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6 text-white relative z-10 ">
      <div className="flex items-center justify-center w-full h-full overflow-hidden rounded-r-[50px]">
        <Lottie
          animationData={animationData}
          loop
          autoplay
          className="w-full h-full object-contain"
        />
      </div>

<div className="flex flex-col justify-between w-full h-full">
        <div className="flex p-4">
          <p className="text-xl flex items-center text-justify justify-center font-semibold">"{quote}"</p>
        </div>
        <div className="flex flex-col items-center justify-center text-center ">
        {locationInfo && (
          <>
            {locationInfo.city ? (
              (() => {
                const cleanedDistrict = (locationInfo.district || '').replace(/district/i, '').trim();
                const city = locationInfo.city.trim();

                return cleanedDistrict.toLowerCase() === city.toLowerCase() ? (
                  <p className="text-[40px] leading-none">{city}</p>
                ) : (
                  <>
                    {/* <p className="text-sm text-white/80">{cleanedDistrict}</p> */}
                    <p className="text-[40px] leading-none">{city}</p>
                  </>
                );
              })()
            ) : (
              <>
                {/* <span className="text-sm text-white/80">{locationInfo.country}</span> */}
                <h2 className="text-[40px] leading-none">{(locationInfo.district || '').replace(/district/i, '').trim()}</h2>
              </>
            )}
          </>
        )}
        <p className="text-[80px] leading-none ml-2 mt-2">{Math.round(current.temperature)}°</p>
        <p className="flex items-center text-md text-white/80 mt-2">
          W: {current.windspeed} km/h • {getWindDirection(current.winddirection)}
        </p>

        </div>
        {nextSunrise && nextSunset && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 w-full items-end">
            <div className="flex items-center bg-white bg-opacity-10 backdrop-blur-md pr-2 rounded-2xl  shadow">
              <div className="w-[80px] h-[80px] overflow-hidden rounded-2xl">
                <Lottie animationData={sunrise} loop autoplay />
              </div>
              <div className="ml-4">
                <h3 className="text-[14px] font-semibold">Upcoming Sunrise</h3>
                <p className="text-2xl ml-2">{formatTime(nextSunrise)}</p>
              </div>
            </div>

            <div className="flex items-center bg-white bg-opacity-10 backdrop-blur-md pr-4 rounded-2xl shadow">
              <div className="w-[80px] h-[80px] overflow-hidden rounded-2xl">
              <Lottie
                animationData={sunset}
                loop
                autoplay
                direction={-1}
                initialSegment={[0, 180]} />              
                </div>
              <div className="ml-4">
                <h3 className="text-[14px] font-semibold">Upcoming Sunset</h3>
                <p className="text-2xl ml-2">{formatTime(nextSunset)}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 mt-8">
        <span className="text-xl font-bold">Past 3 Days</span>
        {past3Days.map((day, i) => (
          <div key={i} className="bg-white bg-opacity-10 backdrop-blur-md py-2 pl-4 rounded-2xl shadow space-y-3">
            <p className="text-md font-semibold">{formatDate(day.date)}</p>
            <div className="flex items-center">
              <WiThermometer className="text-popyellow mt-1" size={30} />
              <span className="text-sm">Temp:</span>
              <span className="text-sm font-semibold ml-3">{day.min}°</span>
              <div className="flex-1 ml-3 h-2 bg-gradient-to-r from-blue-600 to-red-600 rounded-full max-w-[250px]" />
              <span className="text-sm ml-3 font-semibold">{day.max}°</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-white/90">
              <div className="flex items-center">
                <WiRaindrop className="text-popyellow mt-1" size={30} />
                <span>Rain: {day.rain} mm</span>
              </div>
              <div className="flex items-center gap-2">
                <WiStrongWind className="text-popyellow" size={30} />
                <span>Wind: {day.wind} km/h</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { WiRaindrop, WiStrongWind } from 'react-icons/wi';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { IoRainy, IoCloudy, IoThunderstormSharp, IoCloudyNight } from "react-icons/io5";
import { MdSunny } from "react-icons/md";
import { BsFillCloudSnowFill } from "react-icons/bs";
import { DateTime } from "luxon";


const WeatherTimeline = ({ data, timezone }) => {
  const containerRef = useRef();
  const itemRefs = useRef([]);
  const [currentHourIndex, setCurrentHourIndex] = useState(null);

  useEffect(() => {
    if (!data?.time || !timezone) return;
  
    const now = DateTime.now().setZone(timezone);
  
    const index = data.time.findIndex((utcString) => {
      const localTime = DateTime.fromISO(utcString, { zone: timezone });
  
      return (
        localTime.hour === now.hour &&
        localTime.toFormat("yyyy-MM-dd") === now.toFormat("yyyy-MM-dd")
      );
    });
  
    console.log("Local time in zone:", now.toString());
    console.log("Found index:", index, data.time[index]);
  
    setCurrentHourIndex(index !== -1 ? index : 0);
  }, [data, timezone]);
  
  
  
  

  const getWeatherIcon = (code, hour) => {
    const isNight = hour >= 19 || hour < 6;
    if (code < 3) return isNight ? <IoCloudyNight size={40} /> : <MdSunny size={40} /> ; 
    if (code < 45) return isNight ? <IoCloudyNight size={40} /> : <IoCloudy size={40} />;
    if (code < 65) return <IoRainy size={40} />;
    if (code < 80) return <BsFillCloudSnowFill size={40} />;
    return <IoThunderstormSharp size={40} />;
  };

  const getDisplayHours = () => {
    if (currentHourIndex === null) return [];

    const start = currentHourIndex;
    const end = start + 72; // Next 3 days (72 hours)
    return data.time.slice(start, end).map((time, i) => {
      const actualIndex = start + i;
      return {
        time,
        temp: data.temperature_2m[actualIndex],
        rain: data.precipitation[actualIndex],
        wind: data.windspeed_10m[actualIndex],
        weathercode: data.weathercode[actualIndex],
        isNow: actualIndex === currentHourIndex,
      };
    });
  };

  useEffect(() => {
    if (itemRefs.current.length && currentHourIndex !== null) {
      itemRefs.current[0]?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [currentHourIndex]);

  const scrollBy = (offset) => {
    containerRef.current.scrollBy({
      left: offset,
      behavior: 'smooth',
    });
  };

  const displayHours = getDisplayHours();

  return (
    <motion.div
      className="relative bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4 pb-6 mt-8 shadow-lg mx-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <h2 className="text-2xl font-bold mb-4 ml-12 text-white">Upcoming 72 Hour Forecast</h2>

      <div className="relative">
        <button
          onClick={() => scrollBy(-200)}
          className="absolute left-0 z-10 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-70 p-2 rounded-full"
        >
          <BiChevronLeft className="text-white" />
        </button>

        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-scroll no-scrollbar px-4 mx-10 scroll-smooth snap-x"
        >
          {displayHours.map((hour, i) => (
            <div
              ref={(el) => (itemRefs.current[i] = el)}
              key={hour.time}
              className={`flex flex-col items-center min-w-[160px] h-42 p-[6px] py-3 snap-center rounded-xl transition-all ${hour.isNow ? 'bg-popyellow text-black shadow' : 'bg-white bg-opacity-10 text-white'}`}
            >
              <div className='flex items-center gap-2'>
              <span className="text-sm font-medium">{new Date(hour.time).toLocaleTimeString([], { hour: 'numeric', hour12: true })}</span>
              <span className="text-sm text-center">
                ({new Date(hour.time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })})
              </span>
              </div>
              <div className="text-[30px] mt-4">{getWeatherIcon(hour.weathercode, new Date(hour.time).getHours())}</div>
              <div className="flex items-center text-sm mt-5">
                <span className='text-[24px] font-semibold'>{hour.temp}°C</span>
              </div>
              <div className="flex items-center text-sm gap-[6px] mt-2">
                <div className="flex items-center text-[12px]">
                  <WiRaindrop size={25} className='mt-[1px]' />
                  <span>{hour.rain} mm</span>
                </div>
                <div className="flex items-center gap-1 text-[12px]">
                  <WiStrongWind size={20} />
                  <span>{hour.wind} km/h</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => scrollBy(200)}
          className="absolute right-0 z-10 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-70 p-2 rounded-full"
        >
          <BiChevronRight className="text-white" />
        </button>
      </div>
    </motion.div>
  );
};

export default WeatherTimeline;

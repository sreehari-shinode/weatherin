import React from 'react';
import SearchBar from './SearchBar';
import logo from '../assets/logo.png';

const Header = ({ setCoords, fetchWeather, fetchLocationName, setLocationInfo }) => {
  return (
    <div className="bg-[#131c2f] rounded-b-2xl mb-6 pr-4 pl-2 py-2 flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <img src={logo} alt="Weatherin logo" className="h-14 w-14 object-contain" />
        <h1 className="text-white text-3xl font-bold drop-shadow">Weatherin</h1>
      </div>
      <div className="relative z-50">
        <SearchBar
          setCoords={setCoords}
          fetchWeather={fetchWeather}
          fetchLocationName={fetchLocationName}
          setLocationInfo={setLocationInfo}
        />
      </div>
    </div>
  );
};

export default Header;

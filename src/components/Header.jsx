import React, { useState } from 'react';
import SearchBar from './SearchBar';
import logo from '../assets/logo.png';
import { FaSearch } from 'react-icons/fa';

const Header = ({ setCoords, fetchWeather, fetchLocationName, setLocationInfo }) => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="bg-[#131c2f] rounded-b-2xl mb-3 md:mb-6 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-3 flex-grow">
        <img src={logo} alt="Weatherin logo" className="h-10 w-10 object-contain" />
        <h1 className={`text-white text-2xl font-bold drop-shadow transition-all duration-300 ${
            showSearch ? 'hidden' : 'block'} md:block`}
        >Weatherin</h1>
        <div className="flex-grow ml-2 md:hidden">
          {showSearch && (
            <SearchBar
              setCoords={setCoords}
              fetchWeather={fetchWeather}
              fetchLocationName={fetchLocationName}
              setLocationInfo={setLocationInfo}
              autoFocus={true}
              onBlur={() => setShowSearch(false)}
              compact={true} 
            />
          )}
        </div>
      </div>

      <div className="md:hidden">
        {!showSearch && (
          <button onClick={() => setShowSearch(true)}>
            <FaSearch className="text-white text-xl" />
          </button>
        )}
      </div>

      <div className="hidden md:block w-full max-w-md">
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

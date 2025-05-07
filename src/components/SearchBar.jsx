import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({
  setCoords,
  fetchWeather,
  fetchLocationName,
  setLocationInfo,
  autoFocus = false,
  onBlur = null,
  compact = false,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [displayedQuery, setDisplayedQuery] = useState('');
  const [suppressSuggestions, setSuppressSuggestions] = useState(false);

  useEffect(() => {
    if (suppressSuggestions || query === displayedQuery) return;
  
    let ignore = false;
  
    const fetchSuggestions = async () => {
      if (query.length === 0) {
        setSuggestions([]);
        return;
      }
  
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5`
        );
        const data = await res.json();
  
        if (!ignore) {
          setSuggestions(data.results || []);
        }
      } catch (error) {
        if (!ignore) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        }
      }
    };
  
    const debounce = setTimeout(fetchSuggestions, 300);
    return () => {
      ignore = true;
      clearTimeout(debounce);
    };
  }, [query, displayedQuery, suppressSuggestions]);
  
  

  const handleSelect = (location) => {
    const { latitude, longitude } = location;
    setSuppressSuggestions(true);
    setQuery(''); // clear the input completely
    setCoords({ latitude, longitude });
    fetchWeather(latitude, longitude);
    fetchLocationName(latitude, longitude);
    setSuggestions([]);
  
    setTimeout(() => setSuppressSuggestions(false), 300);
  };
  

  console.log('Suggestions:', suggestions);

  return (
<div className={`relative ${compact ? 'w-full max-w-xs' : 'w-full max-w-3xl min-w-[28rem]'} mr-4`}>
<div className="flex items-center bg-white bg-opacity-20 backdrop-blur-md text-white rounded-full px-4 py-2 shadow w-full">
        <FaSearch className="mr-2 text-white" />
        <input
          type="text"
          placeholder="Search city..."
          className="bg-transparent outline-none w-full placeholder-white text-white"
          value={query}
          autoFocus={autoFocus}
          onBlur={onBlur}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {suggestions.length > 0 && (
        <ul className="absolute z-[9999] left-0 right-0 w-full bg-white bg-opacity-90 shadow-md mt-2 rounded-md overflow-hidden text-black">
        {suggestions.map((city) => (
            <li
              key={`${city.name}-${city.latitude}`}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelect(city)}
            >
              {city.name}, {city.admin1 ? city.admin1 + ', ' : ''}{city.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;

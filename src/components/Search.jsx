import React, { useState } from 'react';

const Search = ({ label, onSelect , onsearch}) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);


  

  const handleSearchJob = async (query) => {
    setQuery(query);

    if (query.length < 1) {
      setSearchResults([]);
      return;
    }

    try {
      let token = localStorage.getItem("usersdatatoken");
      const url = `/api/searchitem`;
      console.log('Searching:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({ "name": query }),
      });

      if (response.status === 200) {
        const data = await response.json();
        setSearchResults(data);
        console.log(data);
      } else {
        console.error('Failed to fetch search results', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSearchResource = async (query) => {
    setQuery(query);

    if (query.length < 1) {
      setSearchResults([]);
      return;
    }

    try {
      let token = localStorage.getItem("usersdatatoken");
      const url = `/api/labors/search`;
      console.log('Searching:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({ "name": query }),
      });

      if (response.status === 200) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        console.error('Failed to fetch search results', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSearch = onsearch === 'Job' ? handleSearchJob : handleSearchResource;

  const handleSelect = (item) => {
    setSearchResults([]);
    setQuery('');
    onSelect(item);
  };

  return (
    <div className="search-container">
      <label className="search-label">{label}</label>
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="search-input"
      />
      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelect(item)}
              className="search-result-item"
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;

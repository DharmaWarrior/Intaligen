import React, { useState, useEffect } from 'react';

const Search = ({ label, onSelect, onsearch }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

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
        setHighlightedIndex(-1); // Reset highlighted index on new search
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
        setHighlightedIndex(-1); // Reset highlighted index on new search
      } else {
        console.error('Failed to fetch search results', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSearchCustomer = async (query) => {
    setQuery(query);

    if (query.length < 1) {
      setSearchResults([]);
      return;
    }

    try {
      let token = localStorage.getItem("usersdatatoken");
      const url = `/api/search_partner`;
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
        setHighlightedIndex(-1); // Reset highlighted index on new search
      } else {
        console.error('Failed to fetch search results', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSearch = onsearch === 'Job' ? handleSearchJob : onsearch === 'Resource' ? handleSearchResource : onsearch === 'Customer' ? handleSearchCustomer : null;

  const handleSelect = (item) => {
    setSearchResults([]);
    setQuery(item.name);
    onSelect(item);
  };

  const handleKeyDown = (e) => {
    if (searchResults.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prevIndex) =>
          prevIndex === searchResults.length - 1 ? 0 : prevIndex + 1
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prevIndex) =>
          prevIndex <= 0 ? searchResults.length - 1 : prevIndex - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < searchResults.length) {
          handleSelect(searchResults[highlightedIndex]);
        }
      }
    }
  };

  useEffect(() => {
    // Attach keydown event listener to handle keyboard navigation
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [highlightedIndex, searchResults]);

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
          {searchResults.map((item, index) => (
            <div
              key={item.id}
              onClick={() => handleSelect(item)}
              className={`search-result-item ${
                index === highlightedIndex ? 'highlighted' : ''
              }`}
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

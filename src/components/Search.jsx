import React, { useState } from 'react';

const Search = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (query) => {
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
      } else {
        console.error('Failed to fetch search results', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSelect = (item) => {
    setSearchResults([]);
    setQuery('');
    onSelect(item);
  };

  return (
    <div>
      <label className="block text-gray-600">Search:</label>
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="border border-gray-300 p-2 rounded w-full"
      />
      {searchResults.length > 0 && (
        <div className="border border-gray-300 rounded mt-2 max-h-48 overflow-y-auto">
          {searchResults.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelect(item)}
              className="p-2 hover:bg-gray-200 cursor-pointer"
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

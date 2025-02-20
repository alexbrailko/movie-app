import React, { useState, useCallback, useEffect, useRef } from 'react';
import { fetchMovies, searchMovies } from '../store/moviesSlice';
import { useAppDispatch } from '../store/store';
import debounce from 'lodash/debounce';
import '../styles/SearchBar.scss';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const dispatch = useAppDispatch();
  const hasTyped = useRef(false);

  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      if (searchQuery.length > 2) {
        dispatch(searchMovies(searchQuery));
      }
      if (!searchQuery.length && hasTyped.current) {
        dispatch(fetchMovies(1));
      }
    }, 300),
    [dispatch],
  );

  useEffect(() => {
    debouncedSearch(query);

    return debouncedSearch.cancel;
  }, [query, debouncedSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    hasTyped.current = true;
    setQuery(e.target.value);
  };

  return (
    <div className="searchbar">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search movies..."
      />
    </div>
  );
};

export default SearchBar;

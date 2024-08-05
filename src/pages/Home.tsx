import React, { FC } from 'react';
import SearchBar from '../components/SearchBar';
import MovieList from '../components/MovieList';

export const Home: FC = () => {
  return (
    <>
      <SearchBar />
      <MovieList />
    </>
  );
};

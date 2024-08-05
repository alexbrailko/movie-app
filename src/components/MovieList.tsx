import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { fetchMovies, setCurrentPage } from '../store/moviesSlice';
import MovieItem from './MovieItem';
import Pagination from './Pagination';
import { RootState, useAppDispatch } from '../store/store';
import '../styles/MovieList.scss';

const MovieList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { movies, loading, error, currentPage, itemsPerPage, totalPages } =
    useSelector((state: RootState) => state.movies);

  useEffect(() => {
    dispatch(fetchMovies(Math.ceil(currentPage / 2)));
  }, [dispatch, currentPage]);

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const startIndex = ((currentPage - 1) * itemsPerPage) % 20;
  const endIndex = startIndex + itemsPerPage;
  const currentMovies = movies.slice(startIndex, endIndex);

  return (
    <div className="movie-list-container">
      {loading && <div>Loading...</div>}
      {!!currentMovies.length && (
        <div className="movie-list">
          {currentMovies.map((movie) => (
            <MovieItem key={movie.id} {...movie} />
          ))}
        </div>
      )}

      {!movies.length && !loading && <div>No results</div>}
      {error && <div>{error}</div>}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default MovieList;

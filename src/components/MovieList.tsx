import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { fetchMovies, setCurrentPage } from '../store/moviesSlice';
import { MovieItem } from './MovieItem';
import Pagination from './Pagination';
import { RootState, useAppDispatch } from '../store/store';
import '../styles/MovieList.scss';
import { Loading } from './common/Loading';

const MovieList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { movies, loading, error, currentPage, itemsPerPage, totalPages } =
    useSelector((state: RootState) => state.movies);

  useEffect(() => {
    dispatch(fetchMovies(currentPage));
  }, [dispatch, currentPage]);

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const startIndex = ((currentPage - 1) * itemsPerPage) % 20;
  const endIndex = startIndex + itemsPerPage;
  const currentMovies = movies.slice(startIndex, endIndex);

  return (
    <div className="movies">
      {loading && <Loading />}
      {!!currentMovies.length && (
        <div className="movies__list">
          {currentMovies.map((movie) => (
            <MovieItem key={movie.id} {...movie} className="movies__item" />
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
          className="movies__pagination"
        />
      )}
    </div>
  );
};

export default MovieList;

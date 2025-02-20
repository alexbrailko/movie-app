import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { clearMovie, fetchMovie } from '../store/moviesSlice';
import '../styles/MovieDetails.scss';
import { RootState, useAppDispatch } from '../store/store';
import { Loading } from './common/Loading';

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { movie, loading, error } = useSelector(
    (state: RootState) => state.movies,
  );

  useEffect(() => {
    dispatch(clearMovie());
    dispatch(fetchMovie(Number(id)));
  }, [dispatch, id]);

  const posterUrl = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w400${movie.poster_path}`
    : '';

  return (
    <div className="movie-details-wrapper">
      <Link className="movie-details__back-button" to="/">
        &#x2190; Back
      </Link>
      {loading && <Loading />}
      {!!movie && (
        <div className="movie-details__container">
          <div className="movie-details__poster">
            <img src={posterUrl} alt={movie.title} loading="lazy" />
          </div>
          <div className="movie-details__info">
            <h2 className="movie-details__info-title">{movie.title}</h2>
            <p className="movie-details__info-overview">{movie.overview}</p>
          </div>
        </div>
      )}

      {error && <div>{error}</div>}

      {!loading && !error && !movie && <div>No movie found</div>}
    </div>
  );
};

export default MovieDetails;

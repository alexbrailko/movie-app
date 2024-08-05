import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchMovie } from '../store/moviesSlice';
import '../styles/MovieDetails.scss';
import { RootState, useAppDispatch } from '../store/store';

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { movie, loading, error } = useSelector(
    (state: RootState) => state.movies,
  );

  useEffect(() => {
    dispatch(fetchMovie(Number(id)));
  }, [dispatch, id]);

  const posterUrl = `https://image.tmdb.org/t/p/w500${movie?.poster_path}`;

  return (
    <div className="movie-details-wrapper">
      <Link className="back-button" to="/">
        &#x2190; Back
      </Link>
      {loading && <div className="text-center">Loading...</div>}
      {!!movie && (
        <div className="movie-details">
          <img src={posterUrl} alt={movie.title} />
          <div className="movie-info">
            <h2>{movie.title}</h2>
            <p>{movie.overview}</p>
          </div>
        </div>
      )}

      {error && <div>{error}</div>}

      {!loading && !error && !movie && <div>No movie found</div>}
    </div>
  );
};

export default MovieDetails;

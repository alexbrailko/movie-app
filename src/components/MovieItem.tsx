import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/MovieItem.scss';

interface MovieItemProps {
  id: number;
  title: string;
  poster_path: string;
}

const MovieItem: React.FC<MovieItemProps> = ({ id, title, poster_path }) => {
  const posterUrl = `https://image.tmdb.org/t/p/w400${poster_path}`;

  return (
    <div className="movie-item">
      <Link to={`/movie/${id}`}>
        <img src={posterUrl} alt={title} />
        <h3>{title}</h3>
      </Link>
    </div>
  );
};

export default MovieItem;

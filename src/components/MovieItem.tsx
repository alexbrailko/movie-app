import React, { memo } from 'react';
import { Link } from 'react-router-dom';

interface MovieItemProps {
  id: number;
  title: string;
  poster_path: string;
  className?: string;
}

export const MovieItem: React.FC<MovieItemProps> = memo(
  ({ id, title, poster_path, className }) => {
    const posterUrl = `https://image.tmdb.org/t/p/w400${poster_path}`;

    return (
      <div className={className}>
        <Link to={`/movie/${id}`}>
          <img src={posterUrl} alt={title} loading="lazy" />
          <h3>{title}</h3>
        </Link>
      </div>
    );
  },
);

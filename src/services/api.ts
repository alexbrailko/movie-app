import axios from 'axios';
import { MovieProps, MovieResponse } from '../store/moviesSlice';

const API_KEY = 'e758486787d65a9321cdb3cc8b2d46c5';
const BASE_URL = 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const getMovies = (page: number) =>
  api.get<MovieResponse>('/discover/movie', { params: { page } });

export const getMovieDetails = (id: number) =>
  api.get<MovieProps>(`/movie/${id}`);

export const getSearchMovies = (query: string) =>
  api.get<MovieResponse>('/search/movie', { params: { query } });

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getMovieDetails, getMovies, getSearchMovies } from '../services/api';

export interface MovieProps {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
}

interface MoviesState {
  movies: MovieProps[];
  movie: MovieProps | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

const initialState: MoviesState = {
  movies: [],
  movie: null,
  loading: false,
  error: null,
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  totalPages: 0,
};

export interface MovieResponse {
  page: number;
  results: MovieProps[];
  total_results: number;
  total_pages: number;
}

export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async (page: number) => {
    const response = await getMovies(page);

    return response.data;
  },
);

export const fetchMovie = createAsyncThunk(
  'movies/fetchMovie',
  async (id: number) => {
    const response = await getMovieDetails(id);
    return response.data;
  },
);

export const searchMovies = createAsyncThunk(
  'movies/searchMovies',
  async (query: string) => {
    const response = await getSearchMovies(query);
    return response.data;
  },
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.results;
        state.totalItems = action.payload.total_results;
        state.totalPages = Math.ceil(
          action.payload.total_results / state.itemsPerPage,
        );
      })
      .addCase(fetchMovies.rejected, (state) => {
        state.loading = false;
        state.error = 'Error fetching movies';
      })
      .addCase(fetchMovie.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMovie.fulfilled, (state, action) => {
        state.loading = false;
        state.movie = action.payload;
      })
      .addCase(fetchMovie.rejected, (state) => {
        state.loading = false;
        state.error = 'Error fetching movie details';
      })
      .addCase(searchMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.results;
        state.totalItems = action.payload.total_results;
        state.totalPages = Math.ceil(
          action.payload.total_results / state.itemsPerPage,
        );
      })
      .addCase(searchMovies.rejected, (state) => {
        state.loading = false;
        state.error = 'Error searching movies';
      });
  },
});

export default moviesSlice.reducer;
export const { setCurrentPage } = moviesSlice.actions;

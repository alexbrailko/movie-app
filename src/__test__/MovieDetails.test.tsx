import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from '../store/moviesSlice';
import * as moviesSlice from '../store/moviesSlice';
import '@testing-library/jest-dom';
import MovieDetails from '../components/MovieDetails';
import { RootState } from '../store/store';

// Mock movie data
const mockMovie = {
  id: 123,
  title: 'Test Movie',
  overview: 'Test Overview',
  poster_path: '/test-poster.jpg',
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '123' }),
}));

describe('MovieDetails', () => {
  const createMockStore = (initialState: Partial<RootState>) => {
    return configureStore({
      reducer: {
        movies: moviesReducer,
      },
      preloadedState: initialState as RootState,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();

    jest.mock('../store/moviesSlice', () => ({
      ...jest.requireActual('../store/moviesSlice'),
      fetchMovie: jest.fn(),
      clearMovie: jest.fn(),
    }));
  });

  it('should display movie details when data is loaded', async () => {
    // @ts-ignore
    jest.spyOn(moviesSlice, 'fetchMovie').mockImplementation(() => ({
      type: 'movies/fetchMovie/fulfilled',
      payload: mockMovie,
    }));

    const initialState = {
      movies: {
        movies: [],
        movie: mockMovie,
        loading: false,
        error: null,
        currentPage: 1,
        itemsPerPage: 10,
        totalPages: 0,
        totalItems: 0,
      },
    };
    const store = createMockStore(initialState);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <MovieDetails />
        </BrowserRouter>
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText(mockMovie.title)).toBeInTheDocument();
    expect(screen.getByText(mockMovie.overview)).toBeInTheDocument();
    expect(screen.getByAltText(mockMovie.title)).toHaveAttribute(
      'src',
      `https://image.tmdb.org/t/p/w400${mockMovie.poster_path}`,
    );
  });

  it('should display error message when there is an error', async () => {
    const errorMessage = 'Failed to fetch movie';
    // @ts-ignore
    jest.spyOn(moviesSlice, 'fetchMovie').mockImplementation(() => () => ({
      type: 'movies/fetchMovie/rejected',
      payload: 'Failed to fetch movie',
    }));

    const initialState = {
      movies: {
        movies: [],
        movie: null,
        loading: false,
        error: errorMessage,
        currentPage: 1,
        itemsPerPage: 10,
        totalPages: 0,
        totalItems: 0,
      },
    };
    const store = createMockStore(initialState);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <MovieDetails />
        </BrowserRouter>
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MovieList from '../components/MovieList';
import { BrowserRouter } from 'react-router-dom';
import moviesReducer from '../store/moviesSlice';
import { RootState } from '../store/store';

const createMockStore = (initialState: Partial<RootState>) => {
  return configureStore({
    reducer: {
      movies: moviesReducer,
    },
    preloadedState: initialState as RootState,
  });
};

describe('MovieList', () => {
  it('renders loading state', () => {
    const initialState = {
      movies: {
        movies: [],
        movie: null,
        loading: true,
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
          <MovieList />
        </BrowserRouter>
      </Provider>,
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders movie list', () => {
    const initialState = {
      movies: {
        movies: [
          {
            id: 1,
            title: 'Movie 1',
            poster_path: '/path1.jpg',
            overview: 'Overview 1',
          },
          {
            id: 2,
            title: 'Movie 2',
            poster_path: '/path2.jpg',
            overview: 'Overview 2',
          },
        ],
        movie: null,
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
          <MovieList />
        </BrowserRouter>
      </Provider>,
    );

    expect(screen.getByText('Movie 1')).toBeInTheDocument();
    expect(screen.getByText('Movie 2')).toBeInTheDocument();
  });
});

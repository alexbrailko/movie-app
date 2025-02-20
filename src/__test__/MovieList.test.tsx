import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MovieList from '../components/MovieList';
import { BrowserRouter } from 'react-router-dom';
import moviesReducer from '../store/moviesSlice';
import { RootState } from '../store/store';

describe('MovieList', () => {
  const createMockStore = (initialState: Partial<RootState>) => {
    return configureStore({
      reducer: {
        movies: moviesReducer,
      },
      preloadedState: initialState as RootState,
    });
  };

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

describe('MovieList Pagination', () => {
  const createMockStore = (initialState = {}) => {
    return configureStore({
      reducer: {
        movies: moviesReducer,
      },
      preloadedState: {
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
          loading: false,
          error: null,
          currentPage: 1,
          itemsPerPage: 10,
          totalPages: 3,
          totalItems: 30,
          movie: null,
          ...initialState,
        },
      },
    });
  };

  test('renders pagination when totalPages > 1', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MovieList />
        </BrowserRouter>
      </Provider>,
    );

    expect(screen.getByText('1 of 3')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  test('previous button is disabled on first page', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MovieList />
        </BrowserRouter>
      </Provider>,
    );

    const previousButton = screen.getByText('Previous');
    expect(previousButton).toBeDisabled();
  });

  test('next button is disabled on last page', () => {
    const store = createMockStore({ currentPage: 3 });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MovieList />
        </BrowserRouter>
      </Provider>,
    );

    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  test('clicking next button increments page', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MovieList />
        </BrowserRouter>
      </Provider>,
    );

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    const pageIndicator = screen.getByText('2 of 3');
    expect(pageIndicator).toBeInTheDocument();
  });

  test('clicking previous button decrements page', () => {
    const store = createMockStore({ currentPage: 2 });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MovieList />
        </BrowserRouter>
      </Provider>,
    );

    const previousButton = screen.getByText('Previous');
    fireEvent.click(previousButton);

    const pageIndicator = screen.getByText('1 of 3');
    expect(pageIndicator).toBeInTheDocument();
  });

  test('pagination is not rendered when totalPages <= 1', () => {
    const store = createMockStore({ totalPages: 1 });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MovieList />
        </BrowserRouter>
      </Provider>,
    );

    expect(screen.queryByText('1 of 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });
});

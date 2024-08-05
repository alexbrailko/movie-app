import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SearchBar from '../components/SearchBar';
import moviesReducer from '../store/moviesSlice';

const createMockStore = () => {
  return configureStore({
    reducer: {
      movies: moviesReducer,
    },
  });
};

jest.useFakeTimers();

describe('SearchBar', () => {
  it('renders search input', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <SearchBar />
      </Provider>,
    );

    expect(screen.getByPlaceholderText('Search movies...')).toBeInTheDocument();
  });

  it('debounces search for more than 2 characters', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <SearchBar />
      </Provider>,
    );

    const input = screen.getByPlaceholderText('Search movies...');
    fireEvent.change(input, { target: { value: 'abc' } });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    const state = store.getState();
    expect(state.movies.loading).toBe(true);
  });
});

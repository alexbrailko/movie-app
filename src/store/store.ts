import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './moviesSlice';
import { useDispatch } from 'react-redux';

const store = configureStore({
  reducer: {
    movies: moviesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;

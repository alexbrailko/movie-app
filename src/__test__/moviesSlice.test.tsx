import moviesReducer, {
  fetchMovies,
  fetchMovie,
  searchMovies,
  setCurrentPage,
  clearMovie,
  MovieProps,
} from '../store/moviesSlice';
import { getMovies, getMovieDetails, getSearchMovies } from '../services/api';

jest.mock('../services/api');

describe('Movies Slice', () => {
  const initialState = {
    movies: [],
    movie: null,
    loading: false,
    error: null,
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
  };

  const mockMovie: MovieProps = {
    id: 1,
    title: 'Test Movie',
    poster_path: '/test.jpg',
    overview: 'Test overview',
  };

  const mockMovieResponse = {
    page: 1,
    results: [mockMovie],
    total_results: 20,
    total_pages: 2,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Reducers', () => {
    it('should handle initial state', () => {
      expect(moviesReducer(undefined, { type: 'unknown' })).toEqual(
        initialState,
      );
    });

    it('should handle setCurrentPage', () => {
      const actual = moviesReducer(initialState, setCurrentPage(2));
      expect(actual.currentPage).toEqual(2);
    });

    it('should handle clearMovie', () => {
      const stateWithMovie = { ...initialState, movie: mockMovie };
      const actual = moviesReducer(stateWithMovie, clearMovie());
      expect(actual.movie).toBeNull();
    });
  });

  describe('Async Thunks', () => {
    it('should handle fetchMovies.fulfilled', async () => {
      (getMovies as jest.Mock).mockResolvedValue({ data: mockMovieResponse });

      const action = {
        type: fetchMovies.fulfilled.type,
        payload: mockMovieResponse,
      };
      const state = moviesReducer(initialState, action);

      expect(state.movies).toEqual([mockMovie]);
      expect(state.loading).toBeFalsy();
      expect(state.totalItems).toBe(20);
      expect(state.totalPages).toBe(2);
    });

    it('should handle fetchMovies.pending', () => {
      const action = { type: fetchMovies.pending.type };
      const state = moviesReducer(initialState, action);

      expect(state.loading).toBeTruthy();
    });

    it('should handle fetchMovies.rejected', () => {
      const action = { type: fetchMovies.rejected.type };
      const state = moviesReducer(initialState, action);

      expect(state.loading).toBeFalsy();
      expect(state.error).toBe('Error fetching movies');
    });

    it('should handle fetchMovie.fulfilled', () => {
      const action = { type: fetchMovie.fulfilled.type, payload: mockMovie };
      const state = moviesReducer(initialState, action);

      expect(state.movie).toEqual(mockMovie);
      expect(state.loading).toBeFalsy();
    });

    it('should handle searchMovies.fulfilled', () => {
      const action = {
        type: searchMovies.fulfilled.type,
        payload: mockMovieResponse,
      };
      const state = moviesReducer(initialState, action);

      expect(state.movies).toEqual([mockMovie]);
      expect(state.loading).toBeFalsy();
      expect(state.totalItems).toBe(20);
      expect(state.totalPages).toBe(2);
    });
  });

  describe('Thunk Actions', () => {
    it('should fetch movies successfully', async () => {
      (getMovies as jest.Mock).mockResolvedValue({ data: mockMovieResponse });

      const dispatch = jest.fn();
      const thunk = fetchMovies(1);
      await thunk(dispatch, () => ({}), undefined);

      const [pending, fulfilled] = dispatch.mock.calls.map(
        (call) => call[0].type,
      );
      expect(pending).toBe(fetchMovies.pending.type);
      expect(fulfilled).toBe(fetchMovies.fulfilled.type);
    });

    it('should fetch movie details successfully', async () => {
      (getMovieDetails as jest.Mock).mockResolvedValue({ data: mockMovie });

      const dispatch = jest.fn();
      const thunk = fetchMovie(1);
      await thunk(dispatch, () => ({}), undefined);

      const [pending, fulfilled] = dispatch.mock.calls.map(
        (call) => call[0].type,
      );
      expect(pending).toBe(fetchMovie.pending.type);
      expect(fulfilled).toBe(fetchMovie.fulfilled.type);
    });

    it('should search movies successfully', async () => {
      (getSearchMovies as jest.Mock).mockResolvedValue({
        data: mockMovieResponse,
      });

      const dispatch = jest.fn();
      const thunk = searchMovies('test');
      await thunk(dispatch, () => ({}), undefined);

      const [pending, fulfilled] = dispatch.mock.calls.map(
        (call) => call[0].type,
      );
      expect(pending).toBe(searchMovies.pending.type);
      expect(fulfilled).toBe(searchMovies.fulfilled.type);
    });
  });
});

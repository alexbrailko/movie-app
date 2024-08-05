import React from 'react';
import { Route, Routes  } from 'react-router-dom';
import { Home } from './pages/Home';
import { Movie } from './pages/Movie';

const App: React.FC = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/movie/:id" Component={Movie} />
      </Routes>
    </div>
  );
};

export default App;
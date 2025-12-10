import './static/CSS/App.css';
import api from "./api/axios-config";
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import Layout from "./components/Layout";
import Home from './components/Home';
import Trailer from './components/Trailer';
import MoviesGrid from './components/MoviesGrid';
import MovieDetails from './components/MovieDetails';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);

  const getMovies = async () => {
    try {
      const response = await api.get("/api/v1/movies");
      setMovies(response.data);
      setFilteredMovies(response.data);
    } catch (e) {
      console.error("Failed to load films:", e);
    }
  };

  const handleSearch = (query) => {
    if (!query) {
      setFilteredMovies(movies);
      return;
    }
    const lower = query.toLowerCase();
    const filtered = movies.filter((m) =>
      m.title.toLowerCase().includes(lower)
    );
    setFilteredMovies(filtered);
  };

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout onSearch={handleSearch} />}>
          <Route index element={<Home movies={filteredMovies} />} />
          <Route path="Trailer/:ytTrailerId" element={<Trailer />} />
          <Route path="/movies" element={<MoviesGrid />} />
          <Route path="/movies/:imdbId" element={<MovieDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;

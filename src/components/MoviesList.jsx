import React from "react";
import { useState, useEffect } from "react";
import { fetchMovies } from "../api.js";
import { Link } from "react-router-dom";

function MoviesList({ filtro }) {
  const [movies, setMovies] = useState([]);

  // Consultar API
  useEffect(() => {
    fetchMovies().then((data) => {
      setMovies(data);
      console.log(data);
    });
  }, []);

  // Comprobar filtro
  useEffect(() => {
    if (filtro) {
      const filteredMovies = movies.filter((movie) =>
        movie.title.toLowerCase().includes(filtro.toLowerCase())
      );
      setMovies(filteredMovies);
    } else {
      fetchMovies().then((data) => {
        setMovies(data);
      });
    }
  }, [filtro]);

  return (
    <div className="grid grid-cols-2 px-4 md:px-auto md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-x-10 gap-y-8">
      {movies.slice(0, 20).map((movie) => (
        <Link to={`/movie/${movie.id}`} key={movie.id}>
          {/* Contenedor de cada película con hover */}
          <div className="relative bg-base-300 rounded-lg flex flex-col items-center cursor-pointer group">
            {/* Imagen de la película */}
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-auto rounded-lg group-hover:opacity-30 transition-opacity duration-300"
            />
            {/* Información oculta que aparece con hover */}
            <div
              className="absolute inset-0 bg-base-200 rounded-lg flex items-center 
            justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <div className="flex flex-col gap-y-2 text-center p-2 [&>div>p]:font-semibold 2xl:text-xl">
                <div className="">
                  <p>Title: </p>
                  <h3 className="text-white">{movie.title}</h3>
                </div>
                <div>
                  <p>Release date: </p>
                  <span className="text-white">{movie.release_date}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default MoviesList;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import NavBarLinks from "./NavBarLinks";

const API_URL = import.meta.env.VITE_URL_BASE;
const API_KEY = import.meta.env.VITE_API_KEY;

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [videoKey, setVideoKey] = useState(null);

  // Petición a la API de TMDB (película por ID)
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNDc2M2U1NGE2Y2Q2YjgzOWE2MmM4MWYzOTM0MTc4OSIsIm5iZiI6MTc0MTU5MjUwNi4yMjcsInN1YiI6IjY3Y2U5N2JhZmYxYTg0MGI5OTExMTYwOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5rh7XM0PXnSj26lLgXGug5y80U-c84e3jDxB5fs57Tk",
    },
  };

  useEffect(() => {
    // Info película
    axios
      .get(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`,
        options
      )
      .then((response) => {
        setMovie(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    // Vídeo película
    axios
      .get(
        `${API_URL}/movie/${id}/videos?api_key=04763e54a6cd6b839a62c81f39341789`,
        options
      )
      .then((response) => {
        const trailer = response.data.results[0];
        if (trailer) {
          setVideoKey(trailer.key);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  useEffect(() => {
    console.log(movie);
    console.log(videoKey);
  }, [movie, videoKey]);

  if (!movie) {
    return <p className="bg-base-100">Loading...</p>;
  }

  return (
    <div className="my-10 bg-base-100 p-4 flex flex-col items-center gap-y-10">
      <NavBarLinks ruta_actual="/no_navegable"></NavBarLinks>
      <h1 className="text-3xl">Film details</h1>

      {/* Contenedor principal cuadro */}
      <div className="w-5/5 sm:w-3/5 flex flex-col lg:flex-row gap-y-10 gap-x-10 bg-base-100">
        {/* Contenedor izq */}
        <div className=" flex flex-col gap-y-4 min-w-3/5 justify-center items-center py-4">
          {" "}
          <div className="w-56 ">
            <img
              className=" rounded-lg"
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
            ></img>
          </div>
          <div className="flex flex-col gap-y-4 justify-center items-center">
            <a
              target="_blank"
              href={`https://www.youtube.com/embed/${videoKey}`}
            >
              <button className="btn btn-primary">Trailer</button>
            </a>
            {/* <a href={`https://www.youtube.com/embed/${videoKey}`}>
              <button className="btn btn-primary">Trailer</button>
            </a> */}
          </div>
        </div>

        {/* Contenedor der. */}
        <div className=" [&>div]:p-4 p-6 bg-base-300 rounded-md">
          {" "}
          <div>
            <h2 className="text-2xl font-semibold">{movie.title}</h2>
          </div>
          <div>
            <h3>Sinopsis:</h3>
            <p>{movie.overview}</p>
          </div>
          <div>
            <h3>Release date: </h3>
            <p>{movie.release_date}</p>
          </div>
          <div>
            <h3>Original language: </h3>
            <p>
              {movie.original_language === "en"
                ? "English"
                : movie.original_language === "es"
                ? "Spanish"
                : movie.original_language}
            </p>
          </div>
          <div>
            <h3>Genre: </h3>
            <ul className="flex flex-wrap gap-x-2">
              {movie.genres.map((genre) => (
                <li key={genre.id}>{genre.name}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;

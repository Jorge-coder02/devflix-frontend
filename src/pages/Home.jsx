import "../index.css";
import MoviesList from "../components/MoviesList.jsx";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar.jsx";
import { useState, useEffect } from "react";
import NavBarLinks from "../components/NavBarLinks.jsx";

function Home() {
  const [authenticated, setAuthenticated] = useState(false); // 👤

  // 👤 Comprobar token Inicio Sesión
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setAuthenticated(true);
    }
  }, []);

  const [filtro, setFiltro] = useState("");
  const handleChange = (value) => {
    setFiltro(value);
    console.log(value);
  };
  return (
    <div className="flex justify-center min-h-[100dvh] py-4">
      {authenticated ? (
        <div>
          <span className="flex gap-x-4 absolute top-0 right-0  pr-8 lg:pr-36 pt-6">
            <Link to="/logout">Log Out</Link>
          </span>
        </div>
      ) : (
        <NavBarLinks ruta_actual="/"></NavBarLinks>
      )}

      <div className="flex flex-col items-center md:w-4/5 lg:w-3/5 py-10 gap-y-4 ">
        <h1 className="mt-4 text-center text-4xl font-bold text-">DevFlix</h1>
        <SearchBar handleChange={handleChange}></SearchBar>
        <MoviesList filtro={filtro}></MoviesList>
      </div>
    </div>
  );
}

export default Home;

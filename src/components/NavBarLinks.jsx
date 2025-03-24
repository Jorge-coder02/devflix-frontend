import React from "react";
import { Link } from "react-router-dom";

function NavBarLinks({ ruta_actual }) {
  {
    /* Todas las posibles rutas accesibles */
  }
  const rutas = [
    { to: "/", innerText: "Home" },
    { to: "/register", innerText: "Sign up" },
    { to: "/login", innerText: "Log in" },
  ];

  return (
    <span className="flex gap-x-4 absolute top-0 right-0 pr-8 lg:pr-26 pt-6">
      {/* Muestro rutas diferentes de la actual */}
      {rutas.map(
        (ruta) =>
          ruta.to !== ruta_actual && (
            <Link
              key={ruta.to}
              to={ruta.to}
              className="hover:text-cyan-50 transition-all ease-in-out duration-300"
            >
              {ruta.innerText}
            </Link>
          )
      )}
    </span>
  );
}

export default NavBarLinks;

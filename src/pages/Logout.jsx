import React from "react";
import { Link } from "react-router-dom";
import NavBarLinks from "../components/NavBarLinks";

function Logout() {
  localStorage.removeItem("token"); // Borrar ❌ el token del localStorage

  return (
    <div className="bg-base-100">
      <NavBarLinks ruta_actual="/logout"></NavBarLinks>
      <div
        className="container flex flex-col gap-y-4 justify-center items-center 
        min-h-[40dvh] mt-20 mx-auto bg-base-200 shadow-lg rounded-xl"
      >
        <h2 className="text-3xl">Logout page</h2>
        <div>
          <p className="font-bold mb-4 text-center">Session closed</p>
          <div className="flex flex-col gap-y-2 place-items-center text-lg">
            <Link
              to="/"
              className="my-8 btn bg-base-300 text-white w-32 hover:bg-base-100"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Logout;

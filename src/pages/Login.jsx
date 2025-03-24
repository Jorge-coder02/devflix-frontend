import { useReducer, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBarLinks from "../components/NavBarLinks";

import axios from "axios";
import { Link } from "react-router-dom";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const initialState = {
  email: "",
  password: "",
};

function reducer(state, action) {
  return {
    ...state,
    [action.field]: action.value,
  };
}

function Login({}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    dispatch({
      field: e.target.id, // estado que quiero cambiar
      value: e.target.value, // valor que va a tomar
    });
  };

  const handleAutocompletar = (e) => {
    e.preventDefault();
    // auto completar
    dispatch({ field: "email", value: "userdefault@devflix.com" });
    dispatch({ field: "password", value: "12345%validar2" });
  };

  const enviarFormulario = async (e) => {
    e.preventDefault();
    // enviar formulario
    console.log("Sending: ", state);
    const userData = {
      email: state.email,
      password: state.password,
    };
    try {
      // ✅ Respuesta correcta
      const response = await axios.post(`${VITE_BACKEND_URL}/login`, userData);
      console.log(response);
      const jwt = response.data.token;
      console.log("Token: ", jwt);
      if (response.status === 200) {
        console.log("Login successful");
      } else if (response.status === 400) {
        // ❌ Respuesta incorrecta
        console.log("Incorrect login");
      }
      localStorage.setItem("token", jwt); // Guardar el token en localStorage
      setError(null); // limpio errores
      navigate("/"); // redirijo a la ruta Home

      // ❌ Manejo de errores
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        // Error del backend
        console.error("Error response from backend:", error.response.data);
        setError(
          error.response.data.err ||
            error.response.data.message ||
            "Unknown error"
        );
      } else if (error.request) {
        // No se recibe respuesta del servidor
        console.error("No response from server:", error.request);
        setError("No response from server. Please try again later.");
      } else {
        // Error al configurar la solicitud
        console.error("Error setting up request:", error.message);
        setError("Error in request setup.");
      }
    }
  };

  return (
    <div className="bg-base-100 flex justify-center items-center ">
      {/* Enlaces */}

      <NavBarLinks ruta_actual="/"></NavBarLinks>

      {/* Formulario */}
      <div className="mt-16 w-full md:w-2/4 pt-12 pb-20 gap-y-6 rounded-lg shadow-lg bg-base-200   ">
        <form
          className="flex flex-col items-center justify-center gap-y-4 [&>div>input]:mb-2 [&>div>input]:rounded-md 
          [&>div>input]:w-60 [&>div>input]:p-1.5 [&>div>label]:text-lg min-w-full [&>div]:flex 
          [&>div]:flex-col [&>div]:gap-y-1 md:py-16"
        >
          <h1 className="text-2xl">Login</h1>
          <div>
            <label htmlFor="email">Email</label>
            <input
              onChange={handleChange}
              type="email"
              id="email"
              autoComplete="email"
              value={state.email}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              onChange={handleChange}
              type="password"
              id="password"
              autoComplete="current-password"
              value={state.password}
            />
          </div>

          {/* Create account message */}
          <div className="flex place-items-center w-auto md:w-96">
            <Link to="/register" className="text-blue-600 text-lg">
              Create a new account
            </Link>
          </div>

          {/* Form buttons */}
          <div className="!flex-row gap-x-8">
            <button
              onClick={enviarFormulario}
              className="btn btn-primary text-white w-36 mt-4"
            >
              Login
            </button>
            <button
              onClick={handleAutocompletar}
              className="btn btn-success text-white w-36 mt-4"
            >
              Autocomplete
            </button>
            {/* Mensaje errores */}
          </div>
          {error && <span className="text-red-500">{error}</span>}
        </form>
      </div>
    </div>
  );
}

export default Login;

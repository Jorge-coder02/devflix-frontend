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
  const [isPassShown, setIsPassShown] = useState(false);

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
      <div className="mt-16 w-full md:w-2/4 pt-12 pb-20 gap-y-6 rounded-lg shadow-lg bg-base-200">
        <form
          className="flex flex-col items-center justify-center gap-y-4 [&_input]:mb-2 [&_input]:rounded-md [&_input]:w-60
          [&_input]:p-1.5 [&_label]:text-lg min-w-full [&_div]:flex [&>div]:flex-col [&_div]:gap-y-1 [&>div>div]:gap-x-2 md:py-16"
        >
          <h1 className="text-3xl">Login</h1>
          <div className="mt-2 ml-6 flex flex-col [&>div]:flex-col  ">
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
              <div className=" gap-x-2 [&>button]:w-8 [&>button]:p-1">
                <input
                  onChange={handleChange}
                  type={isPassShown ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  value={state.password}
                />
                <button
                  type="button"
                  onClick={() => setIsPassShown((prev) => !prev)}
                  className="btn btn-sm btn-primary"
                >
                  {!isPassShown ? (
                    <svg
                      className="w-4"
                      fill="none"
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 6.36185C8.36209 5.55936 10.0212 5 12 5C18.3074 5 21.3671 10.6832 21.9109 11.808C21.9705 11.9311 21.9702 12.0694 21.9107 12.1926C21.5585 12.9208 20.1542 15.5545 17.5 17.3244M14 18.8001C13.3735 18.9286 12.7071 19 12 19C5.69265 19 2.63286 13.3168 2.08909 12.192C2.02953 12.0689 2.03049 11.9291 2.09008 11.8059C2.30875 11.3539 2.9298 10.1741 4 8.92114"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                      <path
                        d="M10 9.76389C10.5308 9.28885 11.2316 9 12 9C13.6569 9 15 10.3431 15 12C15 12.7684 14.7111 13.4692 14.2361 14"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                      <path
                        d="M3 3L21 21"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="feather feather-eye w-4"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
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

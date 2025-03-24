import React from "react";
import { useReducer, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBarLinks from "../components/NavBarLinks";
import useAuth from "../hooks/useAuth";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const initialState = {
  name: "",
  email: "",
  password: "",
  password2: "",
  age: "", // parsear a number
};

function reducer(state, action) {
  return {
    ...state,
    [action.field]: action.value,
  };
}

const initialStatePassIsShown = {
  password1: false,
  password2: false,
};

function reducer2(state, action) {
  switch (action.type) {
    case "TOGGLE_PASSWORD1":
      return { ...state, password1: !state.password1 };
    case "TOGGLE_PASSWORD2":
      return { ...state, password2: !state.password2 };
    default:
      return state;
  }
}

function Register({}) {
  const navigate = useNavigate();
  // 👤 Comprobar token Inicio Sesión
  const authenticated = useAuth();

  useEffect(() => {
    if (authenticated) {
      navigate("/");
    }
  }, [authenticated, navigate]);

  const [state, dispatch] = useReducer(reducer, initialState);
  const [msgRespuesta, setMsgRespuesta] = useState("");
  const [loading, setLoading] = useState(false);

  const [stateBtnsPassword, dispatch2] = useReducer(
    reducer2,
    initialStatePassIsShown
  );

  const [errores, setErrores] = useState({
    name: [],
    email: [],
    password: [],
    password2: [],
    age: [],
  });

  const handleChange = (e) => {
    if (e.target.id === "age") {
      dispatch({ field: e.target.id, value: parseInt(e.target.value) });
    } else {
      dispatch({
        field: e.target.id, // estado que quiero cambiar
        value: e.target.value, // valor que va a tomar
      });
    }
  };

  // Generar email y password random para registro
  const generarCadena = (longitud) => {
    const caracteres =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let cadena = "user";
    for (let i = 0; i < longitud; i++) {
      const caracter_random = caracteres.charAt(
        Math.floor(Math.random() * caracteres.length)
      );
      cadena += caracter_random;
    }
    return cadena;
  };

  const handleAutocompletar = (e) => {
    e.preventDefault();
    const password_generada = generarCadena(6);
    dispatch({ field: "name", value: "User Default" });
    dispatch({ field: "email", value: generarCadena(6) + "@devflix.com" });
    dispatch({ field: "password", value: password_generada });
    dispatch({ field: "password2", value: password_generada });
    dispatch({ field: "age", value: 20 });
  };

  // 📋 Validar campos en cliente
  const validarCampos = () => {
    // Trabajo con una copia de los errores para retornarla después
    const errores = {
      name: [],
      email: [],
      password: [],
      password2: [],
      age: [],
    };

    const { name, email, password, password2, age } = state; // ** eliminar línea

    // Validación de campos vacíos
    const campos = Object.keys(state).map((key) => ({
      campo: key,
      valor: state[key],
    }));

    campos.forEach(({ campo, valor }) => {
      // valido age a parte
      if (campo === "age") {
        if (valor === "") {
          errores[campo] = [...errores[campo], `Field ${campo} can't be empty`];
        }
      } else if (campo !== "password2") {
        // *** Modificación validar age sin trim ***
        // no compruebo password2 ni age vacíos
        if (valor.trim() === "") {
          errores[campo] = [...errores[campo], `Field ${campo} can't be empty`];
        }
      }
    });

    // Validación de contraseñas coincidentes
    if (password !== password2) {
      errores.password2 = [...errores.password2, "Passwords don't match"];
    }

    // Devolver los errores para ser usados en el componente
    return errores;
  };

  // 🚀 Enviar formulario
  const enviarFormulario = async (e) => {
    e.preventDefault();

    // Limpiar errores antes de cada validación
    setErrores({
      name: [],
      email: [],
      password: [],
      password2: [],
      age: [],
    });

    // Llamar a la función de validación para obtener los errores
    const errores = validarCampos();

    // ❌ Verificar si había errores y manejarlos
    if (
      errores.name.length > 0 ||
      errores.email.length > 0 ||
      errores.password.length > 0 ||
      errores.password2.length > 0 ||
      errores.age.length > 0
    ) {
      setErrores(errores); // actualizar estado errores
      return;
    }

    // ✅ Si no hay errores, enviar el formulario
    const stateSinPassword2 = { ...state };
    delete stateSinPassword2.password2; // Eliminar el campo password2

    // 🚀 Envío de datos al backend
    try {
      setLoading(true);
      const response = await axios.post(
        `${VITE_BACKEND_URL}/register`,
        stateSinPassword2
      );
      // Mostrar en Front respuesta servidor
      if (response.status === 201) {
        setMsgRespuesta(response.data.message); // ✅
      } else {
        setMsgRespuesta("Incorrect register. Internal server error"); // ❌
      }
    } catch (error) {
      setMsgRespuesta("Incorrect register: " + error.response.data.err); // ❌
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-100 flex justify-center items-center ">
      <NavBarLinks ruta_actual="/register"></NavBarLinks>
      {/* Enlace a la ruta principal */}
      <div className="mt-6 w-5/6 md:w-2/4 pt-12 md:pt-8 gap-y-6">
        <form
          className="flex flex-col items-center justify-center gap-y-6 min-w-full md:py-16 shadow-lg bg-base-200 rounded-lg  
          [&>div>input]:mb-1 [&>div>input]:rounded-md [&>div>input]:w-full [&>div>input]:p-1.5 py-8 md:p-0
          [&>div>label]:text-lg [&>div]:flex [&>div]:flex-col [&>div]:gap-y-1 [&>div]:w-3/4 sm:[&>div]:w-4/6 xl:[&>div]:w-2/6 "
        >
          <h1 className="text-2xl">Sign up</h1>
          <div>
            <label htmlFor="email">Name</label>
            <input
              onChange={handleChange}
              type="text"
              id="name"
              autoComplete="name"
              value={state.name}
            />
            {errores.name.length > 0 &&
              errores.name.map((error, index) => (
                <p key={index} className="text-red-500">
                  {error}
                </p>
              ))}
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              onChange={handleChange}
              type="email"
              id="email"
              autoComplete="email"
              value={state.email}
            />
            {errores.email.length > 0 &&
              errores.email.map((error, index) => (
                <p key={index} className="text-red-500">
                  {error}
                </p>
              ))}
          </div>
          <div className="[&>div>button]:w-8 [&>div>button]:p-1 [&>div>button>svg]:w-4">
            <label htmlFor="password">Password</label>
            <div className="flex gap-x-3">
              <input
                className="mb-1 rounded-md w-full p-1.5"
                onChange={handleChange}
                type={stateBtnsPassword.password1 ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={state.password}
              />
              <button
                type="button"
                onClick={() => {
                  dispatch2({ type: "TOGGLE_PASSWORD1" });
                }}
                className="btn btn-sm btn-primary"
              >
                {!stateBtnsPassword.password1 ? (
                  <svg
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
                    className="feather feather-eye"
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
            {errores.password.length > 0 &&
              errores.password.map((error, index) => (
                <p key={index} className="text-red-500">
                  {error}
                </p>
              ))}
          </div>
          <div className="[&>div>button]:w-8 [&>div>button]:p-1 [&>div>button>svg]:w-4">
            <label htmlFor="password">Password</label>
            <div className="flex gap-x-3">
              <input
                className="mb-1 rounded-md w-full p-1.5"
                onChange={handleChange}
                type={stateBtnsPassword.password2 ? "text" : "password"}
                id="password2"
                autoComplete="current-password2"
                value={state.password2}
              />
              <button
                type="button"
                onClick={() => {
                  dispatch2({ type: "TOGGLE_PASSWORD2" });
                }}
                className="btn btn-sm btn-primary"
              >
                {!stateBtnsPassword.password2 ? (
                  <svg
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
                    className="feather feather-eye"
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
            {errores.password2.length > 0 &&
              errores.password2.map((error, index) => (
                <p key={index} className="text-red-500">
                  {error}
                </p>
              ))}
          </div>
          <div>
            <label htmlFor="password">Age</label>
            <input
              onChange={handleChange}
              type="number"
              id="age"
              autoComplete="age"
              value={state.age}
            />
            {errores.age.length > 0 &&
              errores.age.map((error, index) => (
                <p key={index} className="text-red-500">
                  {error}
                </p>
              ))}
          </div>
          <div className="text-center">
            <p>{loading && "Cargando..."}</p>
            <p>{msgRespuesta}</p>
          </div>
          <div className="!flex-row justify-center items-center gap-x-8 flex-wrap">
            <button
              onClick={enviarFormulario}
              className="btn btn-primary text-white w-36 mt-4"
            >
              Sign up
            </button>
            <button
              onClick={handleAutocompletar}
              className="btn btn-success text-white w-36 mt-4"
            >
              Autocomplete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;

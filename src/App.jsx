import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Register from "./pages/Register";
import MovieDetail from "./components/MovieDetail"; // también es una page, aunque generada
import NotFound from "./pages/NotFound"; // Asegúrate de tener un componente de error 404

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta por defecto */}
        <Route path="/" element={<Home />} />
        {/* Ruta generada para cada película */}
        <Route path="/movie/:id" element={<MovieDetail />} />
        {/* Usuarios */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
        {/* Ruta para 404: manejar cualquier URL no definida */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;

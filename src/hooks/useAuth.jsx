import { useState, useEffect } from "react";

// Hook customizado para la autenticación
const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthenticated(!!token); // Si hay un token, authenticated será true
  }, []);

  return authenticated;
};

export default useAuth;

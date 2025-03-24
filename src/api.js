import axios from "axios";

const API_URL = import.meta.env.VITE_URL_BASE;
const API_KEY = import.meta.env.VITE_API_KEY;

const params = {
  params: {
    api_key: API_KEY,
  },
};
export const fetchMovies = async () => {
  const response = await axios.get(`${API_URL}/discover/movie`, params);
  return response.data.results;
};

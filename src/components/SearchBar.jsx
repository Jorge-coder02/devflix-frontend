import { useState } from "react";

function SearchBar({ handleChange }) {
  const [filtro, setFiltro] = useState("");
  return (
    <div className="w-4/5 md:w-1/2">
      <input
        onChange={(e) => handleChange(e.target.value)}
        type="text"
        placeholder="Search..."
        className="p-3 w-full border-primary border-2 rounded-lg my-5"
      ></input>
    </div>
  );
}

export default SearchBar;

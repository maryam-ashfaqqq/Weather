import { FaSearch } from "react-icons/fa";


function SearchBar({ city, setCity, getWeather }) {


  const handleSearch = () => {

    if (city.trim() === "") {
      return;
    }

    getWeather(city);

  };


  return (

    <div className="search">


      <input

        type="text"

        value={city}

        onChange={(e) => setCity(e.target.value)}

        onKeyDown={(e) => {

          if (e.key === "Enter") {
            handleSearch();
          }

        }}

        placeholder="Search city..."

      />


      <button 
        type="button"
        onClick={handleSearch}
      >

        <FaSearch />

      </button>


    </div>

  );

}


export default SearchBar;
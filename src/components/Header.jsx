import { FaMoon } from "react-icons/fa";

function Header() {
  return (
    <header className="header">
      <h1>🌦 Weather App</h1>

      <button className="theme-btn">
        <FaMoon />
      </button>
    </header>
  );
}

export default Header;
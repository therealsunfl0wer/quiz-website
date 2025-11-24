import { Link } from "react-router-dom";
import "/src/styles/App.css";

function Topbar() {
  return (
    <>
      <div class="topbar">
        <Link to="/">
          <img src="/src/assets/favicon.png" class="logo" /> TAQW
        </Link>
        <Link to="/create">Create</Link>
        <Link to="/results">Results</Link>
        <Link to="/manage">Manage</Link>
      </div>
    </>
  );
}

export default Topbar;
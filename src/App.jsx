import { BrowserRouter, Routes, Route } from "react-router-dom";
import Topbar from "./components/Topbar";
import Home from "./Home";
import Create from "./Create";
import Results from "./Results";
import Manage from "./Manage";
import Footer from "./components/Footer";
import "/src/styles/App.css";
import Play from "./Play";

function App() {
  return (
    <>
      <BrowserRouter>
        <Topbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/results" element={<Results />} />
          <Route path="/manage" element={<Manage />} />
          <Route path="/play" element={<Play />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;

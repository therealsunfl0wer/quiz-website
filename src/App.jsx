import { Routes, Route } from "react-router-dom";
import Results from "./pages/Results";

function App() {
  return (
    <Routes>
      <Route path="/results" element={<Results />} />
    </Routes>
  );
}

export default App;

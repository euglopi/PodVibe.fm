import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Browse } from "./pages/Browse";
import { Player } from "./pages/Player";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/player/:categoryId" element={<Player />} />
      </Routes>
    </BrowserRouter>
  );
}

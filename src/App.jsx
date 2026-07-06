import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CVYukle from "./pages/CVYukle";
import IsIlani from "./pages/IsIlani";
import UyumAnalizi from "./pages/UyumAnalizi";
import MotivasyonMektubu from "./pages/MotivasyonMektubu";
import Gecmis from "./pages/Gecmis";
import Oneriler from "./pages/Oneriler";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="cv" element={<CVYukle />} />
          <Route path="ilan" element={<IsIlani />} />
          <Route path="uyum" element={<UyumAnalizi />} />
          <Route path="mektup" element={<MotivasyonMektubu />} />
          <Route path="gecmis" element={<Gecmis />} />
          <Route path="oneriler" element={<Oneriler />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
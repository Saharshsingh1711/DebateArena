import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar   from "./components/Navbar";
import Home     from "./pages/Home";
import About    from "./pages/About";
import Contact  from "./pages/Contact";
import JoinBeta from "./pages/JoinBeta";
import Register from "./pages/Register";
import Login    from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/about"     element={<About />} />
        <Route path="/contact"   element={<Contact />} />
        <Route path="/join-beta" element={<JoinBeta />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <ToastContainer/>
    </BrowserRouter>
  );
}

export default App;
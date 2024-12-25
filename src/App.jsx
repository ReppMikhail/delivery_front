import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import ManagerPage from "./pages/ManagerPage";
import CourierPage from "./pages/CourierPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/manager" element={<ManagerPage />} />
        <Route path="/courier" element={<CourierPage />} />
        {/* <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfilePage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;

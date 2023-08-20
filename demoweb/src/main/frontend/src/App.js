// src/main/frontend/src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// before login user page
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage";

// after login userPage
import SeatPage from "./pages/SeatPage/SeatPage";
import UserInfo from "./pages/UserInfo/UserInfo";
import ProductManagement from "./pages/ProductManagement/ProductManagement";
import SeatManagementPage from "./pages/SeatPage/SeatManagementPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/seat" element={<SeatPage />} />
          <Route path="/userInfo" element={<UserInfo />} />
          <Route path="/ProductManagement" element={<ProductManagement />} />
          <Route path="/seatManage" element={<SeatManagementPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

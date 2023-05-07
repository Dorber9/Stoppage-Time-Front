import React, { useState, useEffect } from "react";
import Register from "./components/Register";
import Home from "./components/Home";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import "./App.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "js-cookie";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("username");
    setIsLoggedIn(user !== null);
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path="/"
            element={isLoggedIn ? <Home /> : <Register />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

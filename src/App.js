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
    const user = Cookies.get("username");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  // function getCookie(name) {
  //   const value = `; ${document.cookie}`;
  //   const parts = value.split(`; ${name}=`);
  //   if (parts.length === 2) return parts.pop().split(";").shift();
  // }
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Register />}></Route>
          <Route path="/user" element={<Home />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

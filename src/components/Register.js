import React, { useState, useEffect } from "react";
import BallIcon from "../utils/ball.png";
import { TextField } from "@mui/material";
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody } from "mdb-react-ui-kit";
import Cookies from "js-cookie";

const BASE_URL = "https://stoppage-time-server.vercel.app/";

const Register = () => {
  const [userEmail, setUserEmail] = useState("");
  const [emailValid, setEmailValid] = useState("");
  const [username, setUsername] = useState("");
  const [usernameValid, setUsernameValid] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const [passwordValid, setPasswordValid] = useState("");
  const [clubs, setClubs] = useState({});
  const [selectedClub, setSelectedClub] = useState(null);
  const [spin, setSpin] = useState(false);
  const [page, setPage] = useState("Register");
  const [signError, setSignError] = useState("");

  useEffect(() => {
    fetch(`${BASE_URL}clubs`)
      .then((response) => response.json())
      .then((clubs) => {
        if ("error" in clubs) {
          alert(clubs.message);
          window.location.reload(); // Reload the page
        } else {
          setClubs(clubs);
        }
      })
      .catch((error) => console.error(error));
  }, []);

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function validatePassword(password) {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/;
    return regex.test(password);
  }

  async function checkEmailExists(email) {
    setSpin(true);
    const response = await fetch(`${BASE_URL}check_email?email=${email}`);
    const data = await response.json();
    setSpin(false);
    return data.exists;
  }

  function handleCheckEmail() {
    setEmailValid(validateEmail(userEmail) ? "" : "Invalid email address");
  }

  async function checkUserNameExists(userName) {
    setSpin(true);
    const response = await fetch(
      `${BASE_URL}check_username?username=${userName}`
    );
    const data = await response.json();
    setSpin(false);
    return data.exists;
  }

  async function handleCheckUserName() {
    if (username.length > 2 && username.length < 16) {
    } else {
      setUsernameValid("Username must be 3-15 characters");
    }
  }

  function checkEqual(conf) {
    setPasswordValid(password === conf ? "" : "Password does not match");
  }
  function handlePasswordChange(e) {
    setPassword(e.target.value);
    let valid = validatePassword(e.target.value)
      ? ""
      : "Must contain at least 1 number, 1 uppercase, 1 lower case and a special character";
    setPasswordValid(valid);
  }
  function handlePasswordConfChange(e) {
    setPasswordConf(e.target.value);
    checkEqual(e.target.value);
  }

  async function submitForm(e) {
    e.preventDefault();
    setSpin(true);
    let userExists = await checkUserNameExists(username);
    let emailExists = await checkEmailExists(userEmail);
    setUsernameValid(userExists ? "Username already exists" : "");
    setEmailValid(emailExists ? "There is already a user with this email" : "");
    // userExists = await checkUserNameExists(username);
    // emailExists = await checkEmailExists(userEmail);
    if (usernameValid || emailValid || passwordValid) {
      alert("Error! Check your details");
      return;
    } else if (!selectedClub) {
      alert("Click an icon to pick your favorite club");
      return;
    }

    // Make the POST request to the add_user endpoint
    const formData = {
      username: username,
      email: userEmail,
      password: password,
      club_id: selectedClub,
    };
    fetch(`${BASE_URL}add_user`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData), // Convert the object to a JSON string
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result == "success") {
          window.location.reload();
        } else {
          alert("Error!");
        }
      })
      .catch((error) => {
        console.error(error); // handle request error
      });
    setSpin(false);
  }

  async function signIn(e) {
    e.preventDefault();
    setSpin(true);
    if (username && password) {
      // Make the POST request to the signin endpoint
      const formData = {
        username: username,
        password: password,
      };
      fetch(`${BASE_URL}signin`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Convert the object to a JSON string
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.result == "success") {
            localStorage.setItem("username", data.username);
            window.location.reload();
          } else {
            setSignError(data.result);
          }
        })
        .catch((error) => {
          console.error(error); // handle request error
        });
    } else {
      alert("Please fill all fields");
    }
    setTimeout(() => {
      setSpin(false);
    }, 1500); // Wait for 1.5 seconds before setting the spinner to false
  }

  function changePage() {
    setPage(page === "Register" ? "Signin" : "Register");
    setUsername("");
    setPassword("");
  }

  return (
    <MDBContainer
      fluid
      className="d-flex align-items-center justify-content-center bg-image"
      style={{
        backgroundImage:
          "url(https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp)",
      }}
    >
      <div className="mask gradient-custom-3"></div>
      <MDBCard className="m-5" style={{ maxWidth: "600px" }}>
        <MDBCardBody className="reg-form textfield-container">
          {page == "Register" && clubs ? (
            <>
              <TextField
                id="username"
                label="Username"
                variant="outlined"
                value={username}
                size="small"
                fullWidth
                onChange={(e) => setUsername(e.target.value)}
                onBlur={handleCheckUserName}
                helperText={usernameValid}
                error={usernameValid}
              />

              <TextField
                id="email"
                label="Email"
                variant="outlined"
                size="small"
                fullWidth
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                onBlur={handleCheckEmail}
                helperText={emailValid}
                error={emailValid}
              />
              <TextField
                id="password"
                label="Password"
                variant="outlined"
                type="password"
                size="small"
                fullWidth
                value={password}
                onChange={handlePasswordChange}
                helperText={passwordValid}
                error={passwordValid}
              />

              <TextField
                id="passwordConf"
                label="Password Confirmation"
                variant="outlined"
                type="password"
                size="small"
                fullWidth
                value={passwordConf}
                onChange={handlePasswordConfChange}
                error={passwordValid}
              />
              <div className="select-team">
                <div className="icon-container">
                  {Object.keys(clubs).map((key) => (
                    <img
                      key={key}
                      src={clubs[key]}
                      onClick={() => setSelectedClub(key)}
                      className={`crest-list ${
                        selectedClub === key ? "selected" : ""
                      }`}
                    />
                  ))}
                </div>
              </div>

              <MDBBtn
                className="mb-4 w-100 gradient-custom-4"
                size="lg"
                onClick={submitForm}
              >
                Register
              </MDBBtn>
            </>
          ) : page == "Signin" ? (
            <>
              <TextField
                id="usernameSignin"
                label="Username"
                variant="outlined"
                value={username}
                size="small"
                fullWidth
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                id="passwordSignin"
                label="Password"
                variant="outlined"
                type="password"
                size="small"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <MDBBtn
                className="mb-4 w-100 gradient-custom-4"
                size="lg"
                onClick={signIn}
              >
                Sign in
              </MDBBtn>
              {signError && <h6 className="sign-in-error">{signError}</h6>}
            </>
          ) : (
            ""
          )}
          <h5 className="signin-register" onClick={changePage}>
            {page == "Register" ? "Already registered? Sign in!" : "Register"}
          </h5>
          {spin && (
            <div className="loading-ball">
              <img id="ball-spinner" src={BallIcon} alt="Image description" />
            </div>
          )}
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default Register;

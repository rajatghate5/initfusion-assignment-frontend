import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/authSlice";
import { TextField, Button, Modal, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../App.css";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [openSignUp, setOpenSignUp] = useState(false);
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [formError, setFormError] = useState(""); // To handle form errors
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleLogin = (event) => {
    event.preventDefault(); // Prevent default form submission
    if (!username || !password) {
      setFormError("Please fill in both fields.");
      return;
    }
    if (!emailRegex.test(username)) {
      setFormError("Please enter a valid email.");
      return;
    }
    if (!strongPasswordRegex.test(password)) {
      setFormError("Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character.");
      return;
    }

    setFormError(""); // Clear previous errors
    dispatch(loginUser({ username, password }))
      .unwrap()
      .then((response) => {
        navigate("/main");
      })
      .catch((err) => {
        console.error("Login error:", err);
        setFormError("Login failed. Please check your credentials.");
      });
  };

  const handleSignUp = (event) => {
    event.preventDefault(); // Prevent default form submission
    if (signUpPassword !== retypePassword) {
      alert("Passwords do not match");
      return;
    }
    if (!signUpUsername || !signUpPassword || !retypePassword) {
      alert("Please fill in all fields.");
      return;
    }
    if (!emailRegex.test(signUpUsername)) {
      alert("Please enter a valid email.");
      return;
    }
    if (!strongPasswordRegex.test(signUpPassword)) {
      alert("Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character.");
      return;
    }

    // Mock sign-up logic (replace with actual API call)
    // Here you would dispatch a sign-up action or call an API
    handleCloseSignUp();
  };

  const handleOpenSignUp = () => setOpenSignUp(true);
  const handleCloseSignUp = () => setOpenSignUp(false);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-4 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <form onSubmit={handleLogin}>
          <TextField
            label="Username (Email)"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {formError && <p className="text-red-500 text-center">{formError}</p>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 5 }}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={handleOpenSignUp}
            sx={{ marginTop: 5 }}
          >
            Sign Up
          </Button>
        </form>
      </div>

      <Modal
        open={openSignUp}
        onClose={handleCloseSignUp}
        aria-labelledby="sign-up-modal-title"
        aria-describedby="sign-up-modal-description"
      >
        <Box
          className="bg-white p-8 rounded-lg shadow-lg max-w-sm mx-auto mt-24"
          sx={{
            position: "absolute",
            top: "35%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography
            id="sign-up-modal-title"
            variant="h6"
            component="h2"
            className="mb-4"
          >
            Sign Up
          </Typography>
          <form onSubmit={handleSignUp}>
            <TextField
              label="Username (Email)"
              variant="outlined"
              fullWidth
              margin="normal"
              value={signUpUsername}
              onChange={(e) => setSignUpUsername(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
            />
            <TextField
              label="Retype Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className="mt-4"
            >
              Sign Up
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default LoginPage;

import React, { ChangeEvent, FC } from "react";

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import { BACKEND_URL } from "../../config/config";
import { LoginForm } from "../interfaces/interfaces";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface LoginProps {
  show: boolean;
  onHide: () => void;
}

const Login: FC<LoginProps> = ({ show, onHide }) => {
  const handleClose = () => onHide();

  // State to hold login data
  const [loginData, setLoginData] = React.useState({
    email: "",
    password: "",
  });

  // State to hold login form error
  const [loginErrors, setLoginErrors] = React.useState({
    email: "",
    password: "",
  });

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setLoginData((prevData: LoginForm) => ({
      ...prevData,
      email: value,
    }));
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setLoginData((prevData: LoginForm) => ({
      ...prevData,
      password: value,
    }));
  };

  // Form Login Form validation done here
  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    // Regex to check email
    if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = "Email address is invalid";
      valid = false;
    }

    // Regex to check password
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(loginData.password)) {
      newErrors.password =
        "Password must have one lowercase letter, one uppercase letter, one special character, and one number";
      valid = false;
    }

    setLoginErrors(newErrors);
    return valid;
  };

  // Function to handle when user logs in
  const handleLogin = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (validateForm()) {
      axios
        .post(`${BACKEND_URL}/user/login`, loginData, { withCredentials: true })
        .then(() => {
          onHide();
        })
        .catch((error) => {
          console.error("Error while logging in:", error);
        });
    }
  };

  return (
    <Modal
      open={show}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="inputForm">
          <Typography variant="h6" component="h2">
            Signup or Login here.
          </Typography>
          <TextField
            label="Email"
            variant="outlined"
            name="email"
            value={loginData.email}
            onChange={handleEmailChange}
            error={!!loginErrors.email}
            helperText={loginErrors.email}
          />
          <TextField
            label="Password"
            variant="outlined"
            name="password"
            type="password"
            value={loginData.password}
            onChange={handlePasswordChange}
            error={!!loginErrors.password}
            helperText={loginErrors.password}
          />
          <Button variant="contained" size="large" onClick={handleLogin}>
            Login
          </Button>
          {/* <Button variant="outlined" size="large" onClick={handleClose}>
            Continue without Login
          </Button> */}
        </div>
      </Box>
    </Modal>
  );
};

export default Login;

import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
} from "@mui/material";

import {
  CameraAlt as CameraAltIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import { VisuallyHiddenInput } from "../components/styles/StyledComponents";
import { useInputValidation, useStrongPassword, useFileHandler } from "6pp";
import { usernameValidator } from "../utils/validators";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../constants/config";
import { useDispatch } from "react-redux";
import { userExists } from "../redux/reducers/auth";
import toast from "react-hot-toast";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleLogin = () => setIsLogin((p) => !p);

  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useStrongPassword();
  const avatar = useFileHandler("single");

  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Logging in...");
    setIsLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: username.value,
          password: password.value,
        },
        { withCredentials: true },
      );

      dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Creating account...");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);

    try {
      const { data } = await axios.post(`${server}/api/v1/user/new`, formData, {
        withCredentials: true,
      });

      dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup failed", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "#0f141a",
      }}
    >
      {/* LEFT SIDE */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#0c1117",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          position: "relative",
          overflow: "hidden",
          p: 4,
        }}
      >
        {/* TOP SOFT GLOW */}
        <Box
          sx={{
            position: "absolute",
            top: "-80px",
            left: "-80px",
            width: 220,
            height: 220,
            background:
              "radial-gradient(circle, rgba(0,200,170,0.15), transparent 70%)",
            filter: "blur(10px)",
          }}
        />

        {/* BOTTOM SOFT GLOW */}
        <Box
          sx={{
            position: "absolute",
            bottom: "-80px",
            right: "-80px",
            width: 220,
            height: 220,
            background:
              "radial-gradient(circle, rgba(91,108,255,0.12), transparent 70%)",
            filter: "blur(10px)",
          }}
        />

        {/* CONTENT */}
        <Stack spacing={1.2} alignItems="center" sx={{ zIndex: 2 }}>
          {/* LOGO + NAME */}
          <Stack direction="row" alignItems="center" spacing={-0.9}>
            <Box
              component="img"
              src="/logogo.png"
              alt="logo"
              sx={{ width: 64, height: 60 }}
            />

            <Typography
              sx={{ fontSize: "2.2rem", fontWeight: 700, color: "#00c8aa" }}
            >
              ChatLoop
            </Typography>
          </Stack>

          <Typography sx={{ color: "#8aa1aa", textAlign: "center" }}>
            A clean modern chat experience
          </Typography>

          {/* SMALL IDENTITY CARD */}
          <Box
            sx={{
              mt: 3,
              px: 2,
              py: 1,
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#8aa1aa",
              fontSize: "0.8rem",
              letterSpacing: "1px",
            }}
          >
            FAST • SIMPLE • MODERN CHAT
          </Box>
        </Stack>

        {/* WATERMARK */}
        <Typography
          sx={{
            position: "absolute",
            bottom: 18,
            fontSize: "0.75rem",
            color: "rgba(255,255,255,0.05)",
            letterSpacing: "3px",
          }}
        >
          CHATLOOP
        </Typography>
      </Box>

      {/* RIGHT SIDE */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          p: 6,
          overflow: "hidden",
        }}
      >
        <Stack spacing={2.2} sx={{ width: "100%", maxWidth: 420 }}>
          <Typography
            sx={{ color: "#fff", fontSize: "1.6rem", fontWeight: 600 }}
          >
            {isLogin ? "Welcome Back" : "Create Account"}
          </Typography>

          <Typography sx={{ color: "#8aa1aa", fontSize: "0.9rem" }}>
            {isLogin ? "Login to continue" : "Join ChatLoop today"}
          </Typography>

          {!isLogin && (
            <Stack alignItems="flex-start" spacing={1}>
              <Avatar
                src={avatar.preview}
                sx={{
                  width: 100,
                  height: 100,
                  border: "2px solid rgba(255,255,255,0.1)",
                }}
              />

              <IconButton component="label" sx={{ color: "#00c8aa" }}>
                <CameraAltIcon />
                <VisuallyHiddenInput
                  type="file"
                  onChange={avatar.changeHandler}
                />
              </IconButton>
            </Stack>
          )}

          <form onSubmit={isLogin ? handleLogin : handleSignUp}>
            <Stack spacing={1.5}>
              {!isLogin && (
                <>
                  <TextField
                    label="Name"
                    value={name.value}
                    onChange={name.changeHandler}
                    fullWidth
                    InputLabelProps={{ style: { color: "#8aa1aa" } }}
                    sx={{ input: { color: "#fff" } }}
                  />

                  <TextField
                    label="Bio"
                    value={bio.value}
                    onChange={bio.changeHandler}
                    fullWidth
                    InputLabelProps={{ style: { color: "#8aa1aa" } }}
                    sx={{ input: { color: "#fff" } }}
                  />
                </>
              )}

              <TextField
                label="Username"
                value={username.value}
                onChange={username.changeHandler}
                fullWidth
                InputLabelProps={{ style: { color: "#8aa1aa" } }}
                sx={{ input: { color: "#fff" } }}
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password.value}
                onChange={password.changeHandler}
                fullWidth
                InputLabelProps={{ style: { color: "#8aa1aa" } }}
                sx={{ input: { color: "#fff" } }}
              />

              <Button
                type="submit"
                disabled={isLoading}
                fullWidth
                sx={{
                  bgcolor: "#00c8aa",
                  color: "#000",
                  fontWeight: 600,
                  py: 1.2,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#00b196" },
                }}
              >
                {isLogin ? "Login" : "Sign Up"}
              </Button>

              <Typography sx={{ color: "#8aa1aa", textAlign: "left" }}>
                OR
              </Typography>

              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    const { data } = await axios.post(
                      `${server}/api/v1/user/google`,
                      { token: credentialResponse.credential },
                      { withCredentials: true },
                    );

                    dispatch(userExists(data.user));
                    toast.success("Login successful");

                    window.location.href = !data.user.bio
                      ? "/complete-profile"
                      : "/";
                  } catch {
                    toast.error("Google login failed");
                  }
                }}
                onError={() => toast.error("Google Login Failed")}
              />

              <Button
                onClick={toggleLogin}
                sx={{
                  color: "#8aa1aa",
                  textTransform: "none",
                  fontWeight: 500,
                  justifyContent: "flex-start",
                }}
              >
                {isLogin ? "Create new account" : "Back to login"}
              </Button>
            </Stack>
          </form>
        </Stack>
      </Box>
    </Box>
  );
};

export default Login;

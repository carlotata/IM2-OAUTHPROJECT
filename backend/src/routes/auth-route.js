const express = require("express");
const authRouter = express.Router();
const userRouter = express.Router();
const {
    handleOAuth, onboardUser, authenticateToken, updateProfile, getProfile, changePassword, resetPassword, forgotPassword, logout, login, register
} = require("../controllers/auth-controller");

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/oauth", handleOAuth);
authRouter.post("/logout", logout); 
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/change-password", authenticateToken, changePassword);

userRouter.get("/profile", authenticateToken, getProfile);
userRouter.put("/profile", authenticateToken, updateProfile);
userRouter.put("/onboard", authenticateToken, onboardUser);

module.exports = {authRouter, userRouter};
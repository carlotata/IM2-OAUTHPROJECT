require('dotenv').config();
const crypto = require("crypto"); 
const bcrypt = require("bcryptjs");
const { db } = require("../config/db");
const JWT_SECRET = process.env.JWT_SECRET;
const { findUserByEmail, createUser } = require("../models/auth-model");
const jwt = require("jsonwebtoken");
const generateUUID = require("../utils/generateUUID.js");

const handleOAuth = async (req, res) => {
  const { email, name, provider, providerAccountId } = req.body;

    if (!email || !provider || !providerAccountId) {
        return res.status(400).json({ message: "Email, provider, and provider account ID are required." });
  }

    try {
        // Check if user already exists from this provider
        let user = await db.query('SELECT * FROM users WHERE provider = ? AND provider_account_id = ?', [provider, providerAccountId]);

        if (user.length === 0) {
            // If not, check if the email is already in use by a password-based account
            const existingEmailUser = await findUserByEmail(email);
            if (existingEmailUser && existingEmailUser.password) {
                 return res.status(409).json({ message: "This email is already registered. Please sign in with your password." });
          }

            // Create a new user for the OAuth sign-in
            const id = generateUUID();
            const [firstName, ...lastNameParts] = name ? name.split(' ') : ["", ""];
            const lastName = lastNameParts.join(' ');
            
            await db.query(
                'INSERT INTO users(id, email, first_name, last_name, provider, provider_account_id) VALUES (?, ?, ?, ?, ?, ?)',
                [id, email, firstName, lastName || null, provider, providerAccountId]
            );
            
            // Refetch the user to get all fields
            user = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        }
        
        const finalUser = user[0];

        // Create JWT and send it back
        const payload = { id: finalUser.id, email: finalUser.email };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600000 // 1 hour
        });

        res.status(200).json({
            message: "OAuth login successful.",
            token: token,
            onboarding_complete: finalUser.onboarding_complete
        });

    } catch (error) {
        console.error("OAuth Error:", error);
        res.status(500).json({ message: "Server error during OAuth process." });
    }
};


const register = async (req, res) => {
  const { email, password, first_name, last_name } = req.body;
  let errors = [];
  if (!first_name) errors.push({ field: "first_name", message: "First name is required." });
  if (!last_name) errors.push({ field: "last_name", message: "Last name is required." });
  if (!email) errors.push({ field: "email", message: "Email is required." });
  if (!password)
    errors.push({ field: "password", message: "Password is required." });
  if (errors.length > 0) return res.status(400).json(errors);
  try {
    const emailExists = await findUserByEmail(email);

    if (emailExists)
      return res.status(400).json({ message: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      await createUser(email, hashedPassword, first_name, last_name);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error creating user." });
    }

    res.status(201).json({ message: "User has been created." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during registration." });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Username does not exist!" });
    }

  if (user.provider) {
   return res.status(403).json({
      message: `This account is associated with ${user.provider.toUpperCase()}. Please use OAuth to sign in.`,
   });
  }


    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Password is Incorrect!" });
    }

    const payload = {
      id: user.id,
      email: user.email
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000 // 1 hour
    });

    res.status(200).json({
      message: "Login successful.",
      token: token,
      onboarding_complete: user.onboarding_complete
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during login." });
  }
};

const logout = (req, res) => {
    // Clear the cookie
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0) // Set expiry date to the past
    });
    res.status(200).json({ message: "Logout successful." });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User with that email does not exist." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(resetToken, 10);

    await db.query('DELETE FROM password_resets WHERE email = ?', [email]);

    await db.query(
      'INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)',
      [email, hashedToken, new Date(Date.now() + 3600000)] // Token expires in 1 hour
    );
    
    console.log(`Password reset token for ${email}: ${resetToken}`);
    res.status(200).json({ message: "Password reset token generated.", resetToken: resetToken });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during forgot password process." });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token and new password are required." });
  }

  try {
    const resetRequests = await db.query('SELECT * FROM password_resets WHERE expires_at > ?', [new Date()]);

    let validRequest = null;
    for (const request of resetRequests) {
      const isMatch = await bcrypt.compare(token, request.token);
      if (isMatch) {
        validRequest = request;
        break;
      }
    }

    if (!validRequest) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, validRequest.email]);
    await db.query('DELETE FROM password_resets WHERE email = ?', [validRequest.email]);

    res.status(200).json({ message: "Password has been reset successfully." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during password reset." });
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current and new passwords are required." });
  }

  try {
    const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect current password." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, userId]);

    res.status(200).json({ message: "Password changed successfully." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during password change." });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await db.query('SELECT id, first_name, last_name, age, onboarding_complete ,email FROM users WHERE id = ?', [req.user.id]);
    if (user.length > 0) {
      res.json(user[0]);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching profile." });
  }
};

const updateProfile = async (req, res) => {
  const { first_name, last_name, age } = req.body;
  const userId = req.user.id;

  if (!first_name || !last_name || age === undefined) {
    return res.status(400).json({ message: "First name, last name and age are required." });
  }

  try {
    await db.query('UPDATE users SET first_name = ?, last_name = ?, age = ? WHERE id = ?', [first_name, last_name, age, userId]);
    res.status(200).json({ message: "Profile updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error updating profile." });
  }
};

const authenticateToken = (req, res, next) => {
  // const token = req.cookies.token;
  let token;

  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  if (!token) {
    token = req.cookies.token;
  }
  if (token == null) {
    return res.sendStatus(401); // if there isn't any token
  }
  // if (token == null) return res.sendStatus(401); // if there isn't any token

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      return res.sendStatus(403);
    }
    // if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const onboardUser = async (req, res) => {
  const { first_name, last_name, age } = req.body;
  const userId = req.user.id;

  if (!first_name || !last_name || age === undefined) {
    return res.status(400).json({ message: "First name, last name and age are required for onboarding." });
  }

  if (isNaN(parseInt(age, 10)) || age < 0) {
    return res.status(400).json({ message: "Please provide a valid age." });
  }

  try {
    await db.query(
      'UPDATE users SET first_name = ?, last_name = ?, age = ?, onboarding_complete = TRUE WHERE id = ?',
      [first_name, last_name, age, userId]
    );
    res.status(200).json({ message: "Onboarding completed successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during onboarding." });
  }
};

module.exports = {
   handleOAuth, onboardUser, authenticateToken, updateProfile, getProfile, changePassword, resetPassword, forgotPassword, logout, login, register
};
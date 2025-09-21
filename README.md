# IM2 OAuth Project

This project is a full authentication system built with **Next.js (frontend)**, **Express.js (backend)**, and **MySQL (database)**. It supports **Email/Password login**, **Forgot Password**, **User Onboarding**, and **OAuth (Google & GitHub)**.

---

## 🚀 Project Installation Guide

Follow these steps to set up and run the project on your local machine.

---

## 📌 Prerequisites

Make sure the following are installed before starting:

### 1. Git
Check if Git is installed:
```bash
git --version
```
If not, [download and install Git](https://git-scm.com/downloads).

### 2. XAMPP
Start the following modules in the **XAMPP Control Panel**:
- ✅ Apache  
- ✅ MySQL  

---

## ⚙️ Installation Steps

### Step 1: Create a Project Directory
```bash
mkdir my-project
cd my-project
```

### Step 2: Clone the Repository
```bash
git clone https://github.com/carlotata/IM2-OAUTHPROJECT.git
```

This will create a new folder with `backend/` and `frontend/`.

---

### Step 3: Backend Setup

1. Navigate into the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file inside `backend/`:
   ```env
   JWT_SECRET=your_generated_jwt_secret
   ```
   > To generate a JWT secret, run (Computer Terminal):
   > ```bash
   > node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   > ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   Backend will run on [http://localhost:5000](http://localhost:5000).

---

### Step 4: Frontend Setup

1. Open a new terminal.
2. Navigate into the frontend folder:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env.local` file inside `frontend/`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000

   # GitHub OAuth
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET="your_generated_secret"
   ```
   > To generate a NextAuth secret, run (Computer Terminal):
   > ```bash
   > node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   > ```
5. Start the frontend:
   ```bash
   npm run dev
   ```
   Frontend will run on [http://localhost:3000](http://localhost:3000).

---

## 🖥 Running the Application

- Keep **two terminals open**:  
  - One for the backend (`npm run dev` in `/backend`)  
  - One for the frontend (`npm run dev` in `/frontend`)  

Then visit 👉 [http://localhost:3000](http://localhost:3000)

---

## ✅ Features
- Email & Password Authentication  
- Forgot Password  
- OAuth with GitHub & Google  
- JWT-based API Authentication  
- User Onboarding Flow  

---

## 🛠 Tech Stack
- **Frontend:** Next.js, NextAuth  
- **Backend:** Express.js, JWT  
- **Database:** MySQL (XAMPP)  

---

## 📖 License
This project is for educational purposes only.

# Project Installation Guide

This guide will walk you through the process of setting up and running the project on your local machine.

## Prerequisites

Before you begin, please ensure you have the following software installed and running on your device.

### 1. Git Version Control

You must have Git installed to download the project files. To check if you have it, open your terminal (like Git Bash, PowerShell, or Command Prompt) and enter the following command:

```bash
git --version
```

If Git is installed, it will respond with the version number (e.g., `git version 2.39.2.windows.1`). If the command is not recognized, please [download and install Git](https://git-scm.com/downloads) first.

### 2. XAMPP

The backend requires a MySQL database and an Apache server, which are easily managed with XAMPP.

*   Open your **XAMPP Control Panel**.
*   Start the **Apache** module.
*   Start the **MySQL** module.



## Installation Steps

Follow these steps carefully to set up both the frontend and backend of the application.

### Step 1: Create a Project Directory

First, create a new folder on your computer where you will store the project files.

```bash
mkdir my-project
```

### Step 2: Navigate to Your Project Directory

Open your terminal and use the `cd` command to move into the folder you just created.

```bash
cd my-project
```

### Step 3: Clone the Repositories

Next, download the source code for both the frontend and backend by cloning the Git repositories. Enter the following commands one at a time.

**Clone the Backend:**
```bash
git clone https://github.com/LourdenB15/backend-im-project.git
```

**Clone the Frontend:**
```bash
git clone https://github.com/LourdenB15/frontend-im-project.git
```

After this step, you will have two new folders inside your project directory: `backend-im-project` and `frontend-im-project`.

## Running the Application

You will need two separate terminals running simultaneously—one for the backend and one for the frontend.

### Step 4: Start the Backend Server

1.  In your terminal, navigate into the backend folder.
    ```bash
    cd backend-im-project
    ```
2.  Install the necessary dependencies.
    ```bash
    npm i
    ```
3.  Start the backend server.
    ```bash
    npm run dev
    ```
    > **Note:** The backend server will now be running, typically on a port like `5000`. Leave this terminal window open.

### Step 5: Start the Frontend Application

1.  **Open a new terminal window**.
2.  Navigate to your main project folder and then into the frontend folder.
    ```bash
    cd path/to/my-project/frontend-im-project
    ```
3.  Install the necessary dependencies.
    ```bash
    npm i
    ```
4.  Start the frontend development server.
    ```bash
    npm run dev
    ```
    > **Note:** The frontend application is now running. Leave this second terminal window open.

### Step 6: View the Application

The project is now fully running. Open your web browser and navigate to the following address:

[**http://localhost:3000**](http://localhost:3000)

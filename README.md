# ChefAI Frontend

A modern, responsive frontend for the ChefAI application, built with React and Vite. This application allows users to generate AI-powered recipes, manage their accounts, and view their recipe history.

## 🚀 Features

- **User Authentication**: Secure Sign In and Sign Up functionality.
- **Recipe Generation**: Interactive main interface for generating new recipes using AI.
- **Recipe History**: View previously generated recipes.
- **Welcome Experience**: A welcoming landing page for new users.

## 🛠️ Tech Stack

- **Framework**: [React]
- **Build Tool**: [Vite]
- **Routing**: [React Router DOM]
- **HTTP Client**: [Axios]
- **Styling**: CSS

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js]
- [npm]

## ⚙️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd chefAI-frontend
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```
    The application will typically start at `http://localhost:5173`.

4.  **Build for production**
    ```bash
    npm run build
    ```

## 📂 Project Structure

```
src/
├── assets/         # Static assets like images
├── components/     # Reusable UI components
├── pages/          # Application pages/views
│   ├── historyPage # Recipe history view
│   ├── mainPage    # Core recipe generation interface
│   ├── signIn      # Login page
│   ├── signUp      # Registration page
│   └── welcome     # Landing page
├── api.js          # API configuration and endpoints
├── App.jsx         # Main application component with routing
└── main.jsx        # Entry point
```


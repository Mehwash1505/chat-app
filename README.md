# Realtime Chat App

A modern, responsive real-time chat application built with **React**, **Vite**, **Tailwind CSS**, and **Firebase**. Users can sign up, log in, and exchange messages instantly with others.

## Features

* **User Authentication:** Secure Sign Up and Login using Firebase Authentication (Email/Password).
* **Real-time Messaging:** Instant message updates using Firebase Realtime Database.
* **Responsive UI:** Clean and mobile-friendly interface styled with Tailwind CSS.
* **State Management:** React Context API for handling user authentication states.
* **Fast Development:** Powered by Vite for lightning-fast HMR and build performance.

## Tech Stack

* **Frontend:** [React](https://react.dev/) (v19), [Vite](https://vitejs.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Backend / Database:** [Firebase Authentication](https://firebase.google.com/docs/auth), [Firebase Realtime Database](https://firebase.google.com/docs/database)
* **Language:** JavaScript (ES6+)

## Project Structure

```text
src/
├── assets/          # Static assets (images, icons)
├── components/      # Reusable UI components
│   ├── Auth/        # Login and Signup forms
│   ├── Chat/        # Chat window, messages, and input
│   └── Sidebar/     # User list/Sidebar components
├── context/         # React Context (AuthContext)
├── firebase/        # Firebase configuration and initialization
├── pages/           # Main application pages (LoginPage, ChatPage, etc.)
├── App.jsx          # Main application component
└── main.jsx         # Entry point
Installation & Setup
Follow these steps to run the project locally.

1. Clone the repository
Bash

git clone [https://github.com/mehwash1505/chat-app.git](https://github.com/mehwash1505/chat-app.git)
cd chat-app
2. Install dependencies
Bash

npm install
3. Firebase Configuration
Important: For security, it is best practice to store API keys in environment variables rather than hardcoding them.

Create a .env file in the root directory.

Add your Firebase configuration keys (you can find these in your Firebase Console > Project Settings):

Code snippet

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
Optional: Update src/firebase/firebase.js to use these variables:

JavaScript

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ... etc
};
4. Run the development server
Bash

npm run dev
The app should now be running at http://localhost:5173.

Scripts
npm run dev: Starts the development server.

npm run build: Builds the app for production.

npm run preview: Previews the production build locally.

npm run lint: Runs ESLint to check for code quality issues.

Security Note
This project currently uses client-side Firebase configuration. Ensure you have set up Firebase Security Rules in your Firebase Console to prevent unauthorized access.

Example basic rules for Realtime Database:

JSON

{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
License
This project is open-source and available for educational purposes.
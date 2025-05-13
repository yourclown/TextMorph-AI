import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import React from 'react';
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from '../config.js';

const GOOGLE_ID = GOOGLE_CLIENT_ID;

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={GOOGLE_ID}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>
);

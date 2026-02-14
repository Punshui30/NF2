import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

console.log("NorthForm initializing...");

const root = document.getElementById("root");

import { AppProvider } from "./contexts/AppContext";

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <AppProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppProvider>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}

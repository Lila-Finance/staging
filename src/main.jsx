import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Market from "./pages/Market.jsx";
import Docs from "./pages/Docs.jsx";
import Portfolio from "./pages/Portfolio.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/market",
    element: <Market />,
  },
  {
    path: "/portfolio",
    element: <Portfolio />,
  },
  {
    path: "/docs",
    element: <Docs />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

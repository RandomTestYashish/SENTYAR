import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/chrome.css";
import "./styles/pages.css";
import "./styles/lab.css";
import "./styles/prefer.css";
import "./styles/royal.css";
import "./styles/hero.css";
import "./styles/p2.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./firebaseConfig";
import App from "./components/App";
import { AuthProvider } from "./contexts/AuthContext";
import { TrProvider } from "./contexts/TrContext";
import "./styles/general.css";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <TrProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </TrProvider>
  </StrictMode>
);

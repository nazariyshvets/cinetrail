import "css/general.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { positions, transitions, Provider as AlertProvider } from "react-alert";
import App from "./components/App";
import AlertTemplate from "components/AlertTemplate";
import "./firebaseConfig";
import { AuthProvider } from "./contexts/AuthContext";
import { TrProvider } from "./contexts/TrContext";

const alertOptions = {
  offset: "10px",
  position: positions.TOP_CENTER,
  timeout: 5000,
  transition: transitions.SCALE,
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <AlertProvider template={AlertTemplate} {...alertOptions}>
      <TrProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </TrProvider>
    </AlertProvider>
  </StrictMode>
);

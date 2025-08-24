import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider
    clientId={
      "426076119373-raho351u4nqpdsfea7660ij835103v7g.apps.googleusercontent.com"
    }
  >
    <StrictMode>
      <App />
      <Toaster expand={false} position="top-center" closeButton richColors />
    </StrictMode>
  </GoogleOAuthProvider>
);

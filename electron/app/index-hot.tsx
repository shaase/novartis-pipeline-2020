import { hot } from "react-hot-loader/root";
import React from "react";
import { AppProvider } from "./state";
import App from "./components/App";

const Provider: React.FC = () => (
  <AppProvider>
    <App />
  </AppProvider>
);

export default hot(Provider);

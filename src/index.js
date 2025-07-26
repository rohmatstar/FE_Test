import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import orcheteraTheme from "./theme";
import App from "./App";
import "./styles/global.css";
import "animate.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={orcheteraTheme}>
    <App />
  </ThemeProvider>
);

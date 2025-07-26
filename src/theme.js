import { createTheme } from "@mui/material/styles";

const orcheteraTheme = createTheme({
  palette: {
    primary: {
      main: "#9c27b0",
      light: "#ba68c8",
      dark: "#7b1fa2",
      contrastText: "#fff",
    },
    secondary: {
      main: "#ff9800",
    },
  },
  components: {
    // Customize TextField globally
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily: "'Roboto Flex', sans-serif",
          "& .MuiInput-underline": {
            padding: 10,
            paddingLeft: 0,
            paddingRight: 0,
          },
          "& .MuiInput-underline:before": { borderBottomColor: "#757575" }, // Inactive
          "& .MuiInput-underline:after": { borderBottomColor: "#7b1fa2" }, // Focused
          "& .MuiOutlinedInput-root": {
            // For outlined variant
            "& fieldset": { borderColor: "#9c27b0" },
            "&:hover fieldset": { borderColor: "#ba68c8" },
            "&.Mui-focused fieldset": { borderColor: "#7b1fa2" },
          },
        },
      },
    },
    // Customize buttons
    MuiButton: {
      variants: [
        {
          props: { os: "custom" }, // Triggered by the prop
          style: {
            fontFamily: "'Roboto Flex', sans-serif",
            textTransform: "none",
            background: `linear-gradient(90deg, #FFD400 0%,#01409d 100%)`,
            borderRadius: 25,
            boxShadow: "none",
            height: "auto",
            padding: "10px 16px",
            color: "white",
            "&:hover": {
              background: `linear-gradient(90deg, #FFD400 0%, #01409D 100%)`,
            },
          },
        },
      ],
    },
  },
  typography: {
    fontFamily: "'Roboto Flex', sans-serif",
  },
});

export default orcheteraTheme;

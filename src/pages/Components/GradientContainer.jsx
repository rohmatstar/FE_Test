import { Box, styled, useTheme } from "@mui/material";

const GradientElement = styled(Box)(({ theme }) => ({
  height: "100vh",
  background: `linear-gradient(60deg, #01409D 10%, #FFD400 50%)`,
  color: theme.palette.primary.contrastText,
  textAlign: "center",
  overflow: "hidden",
}));

const GradientContainer = ({ children, ...props }) => {
  const theme = useTheme();
  return <GradientElement {...props}>{children}</GradientElement>;
};

export default GradientContainer;

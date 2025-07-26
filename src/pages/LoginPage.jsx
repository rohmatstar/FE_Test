import { useState } from "react";
import Swal from "sweetalert2";
import {
  TextField,
  Button,
  Typography,
  Box,
  CssBaseline,
  Card,
  Paper,
  InputAdornment,
  Grid,
} from "@mui/material";
import GradientContainer from "./Components/GradientContainer";
import { LockOutline, Person2Outlined } from "@mui/icons-material";
import OverlayShade from "./Artefacts/OverlayShade";
import { useNavigate } from "react-router-dom";
import Loader from "./Components/Loader";
import axios from "axios";
import { isEmpty } from "lodash";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const handleLoading = (value = true) => {
    setLoading(value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    handleLoading(true);
    try {
      // Simulate backend process
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // login process
      const payload = {
        username,
        password,
      };

      if (!username || !password || isEmpty(username) || isEmpty(password)) {
        Swal.fire(
          "Warning",
          "Kindly provide your username and password to continue",
          "warning"
        );
        setLoading(false);
        return;
      }

      const response = await axios.post(`${baseUrl}/auth/login`, payload);

      if (response.data?.token) {
        sessionStorage.setItem("token", response.data.token);
      } else {
        Swal.fire(
          "Login failed",
          "Please check your credentials and try again",
          "error"
        );
        setLoading(false);
        return;
      }

      Swal.fire({
        title: "Logged in",
        text: "You have successfully logged in. Redirecting to your dashboard...",
        icon: "success",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: true,
      }).then(() => {
        navigate("/dashboard");
      });
    } catch (error) {
      if (error.status === 401) {
        Swal.fire(
          "Unauthorized",
          "Login failed. Please check your credentials",
          "error"
        );
      } else {
        Swal.fire(
          error.status.toString(),
          error.message || "Something went wrong.",
          "error"
        );
      }
      handleLoading(false);
    }
  };

  return (
    <>
      <CssBaseline />
      {loading && <Loader />}

      <GradientContainer>
        <OverlayShade
          borderRadius={8}
          rotation={60}
          opacity={0.2}
          top={-40}
          left={-135}
          width={400}
          height={400}
          transformOrigin="center"
        />
        <OverlayShade
          borderRadius={8}
          rotation={60}
          opacity={0.2}
          bottom={-40}
          right={-135}
          width={400}
          height={400}
          transformOrigin="right"
        />

        <Grid container sx={{ height: "100vh" }}>
          <Grid item size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "100%",
              }}
            >
              <Box>
                <Card
                  component={Paper}
                  variant="outlined"
                  elevation={20}
                  sx={{
                    p: 5,
                    m: 5,
                    maxWidth: 500,
                    border: 0,
                    textAlign: "center",
                  }}
                  mt={10}
                  display="flex"
                  flexDirection="column"
                  gap={2}
                >
                  <img
                    src="/images/MINT-Logo-Complete.png"
                    alt="MINT by JASAMARGA"
                    width={300}
                  />

                  <Box
                    component="form"
                    onSubmit={handleLogin}
                    sx={{ width: "100%" }}
                  >
                    <TextField
                      label="Username"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      type="text"
                      variant="standard"
                      sx={{
                        mb: 3,
                      }}
                      onChange={(e) => setUsername(e.target.value)}
                      fullWidth
                      placeholder="Type your username"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person2Outlined color="action" />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                    <TextField
                      label="Password"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      type="password"
                      variant="standard"
                      sx={{
                        mb: 3,
                      }}
                      onChange={(e) => setPassword(e.target.value)}
                      fullWidth
                      placeholder="Type your password"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockOutline color="action" />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                    <Button
                      type="submit"
                      os="custom"
                      variant="contained"
                      onClick={handleLogin}
                      fullWidth
                    >
                      Login
                    </Button>
                  </Box>

                  <Typography
                    sx={{
                      mt: 5,
                      color: "grey",
                      fontSize: 14,
                    }}
                  >
                    Please contact the system administrator
                    <br />
                    if you do not have an existing account to log in
                  </Typography>
                </Card>

                <Typography
                  variant="body2"
                  align="center"
                  sx={{
                    fontFamily: "'Roboto Flex', sans-serif",
                    mb: 4,
                    mt: 4,
                    color: "#c4c4c4",
                  }}
                >
                  <strong>
                    &copy; 2025 PT Jasa Marga (Persero) Tbk. All rights
                    reserved.
                  </strong>
                  <br />
                  <br />
                  Unauthorized use, duplication, or distribution is strictly
                  prohibited.
                  <br />
                  For inquiries, please contact our legal department.
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item size={{ xs: 12, md: 7 }}>
            <Box
              sx={{
                height: "100%",
                width: "100%",
                p: 2,
                pl: 0,
              }}
            >
              <Paper
                sx={{
                  height: "100%",
                  width: "100%",
                  background:
                    "url(/images/Jasamarga-Background-Illustration.png) center bottom no-repeat",
                  backgroundSize: "cover",
                  color: "white",
                  display: "flex",
                  alignItems: "end",
                  borderRadius: 5,
                  p: 5,
                  boxShadow: "0px 4px 10px rgba(155, 155, 155, 0.3)",
                }}
                elevation={5}
              >
                <Box
                  sx={{
                    textAlign: "left",
                    mb: 15,
                  }}
                >
                  <Typography
                    variant="h2"
                    component="div"
                    display="block"
                    sx={{}}
                  >
                    Real-Time Insights,
                  </Typography>
                  <Typography
                    variant="h2"
                    component="div"
                    display="block"
                    sx={{
                      fontWeight: 600,
                      mb: 5,
                    }}
                  >
                    Smarter Toll Management
                  </Typography>
                  <Typography variant="body1" component="div" display="block">
                    Stay ahead with an integrated system that continuously
                    tracks toll income and traffic flow across all gates. Gain
                    instant access to revenue analytics, vehicle density trends,
                    and operational alerts — all in one dashboard. Empower us to
                    make smarter, faster decisions that improve service quality,
                    reduce congestion, and maximize profitability.
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </GradientContainer>
    </>
  );
};

export default LoginPage;

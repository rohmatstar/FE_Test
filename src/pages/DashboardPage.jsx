import Drawer from "./Components/Drawer";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

const DashboardPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);

      // Token expiration checking
      const now = Date.now() / 1000;
      if (decoded.exp && decoded.exp < now) {
        sessionStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      console.error("Invalid token:", error);
      sessionStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  return <Drawer title="Monitoring Income and Traffic Dashbord" />;
};

export default DashboardPage;

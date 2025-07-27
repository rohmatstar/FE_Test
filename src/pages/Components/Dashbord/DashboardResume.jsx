import axios from "axios";
import { Alert, Box, Button, Grid, Snackbar, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import "dayjs/locale/id";

dayjs.locale("id");
const baseUrl = process.env.REACT_APP_BASE_URL;

import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import Loader from "../Loader";
import { isEmpty } from "lodash";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const DashboardResume = () => {
  const [loading, setLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState(dayjs()); // Default is current date
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [paymentTransactionCounterData, setPaymentTransactionCounterData] =
    useState([]);
  const [gateTransactionCounterLabel, setGateTransactionCounterLabel] =
    useState([]);
  const [gateTransactionCounterData, setGateTransactionCounterData] = useState(
    []
  );
  const [
    trafficPercentageTransactionCounterLabel,
    setTrafficTransactionPercentageCounterLabel,
  ] = useState([]);
  const [
    trafficPercentageTransactionCounterData,
    setTrafficTransactionPercentageCounterData,
  ] = useState([]);
  const [
    branchPercentageTransactionCounterLabel,
    setBranchTransactionPercentageCounterLabel,
  ] = useState([]);
  const [
    branchPercentageTransactionCounterData,
    setBranchTransactionPercentageCounterData,
  ] = useState([]);

  const paymentTransactionCounter = {
    labels: [
      "Tunai",
      "BCA",
      "BNI",
      "BRI",
      "DKI",
      "Flo",
      "Mandiri",
      "Mega",
      "Nobu",
    ],
    datasets: [
      {
        label: "Jumlah Transaksi",
        data: paymentTransactionCounterData,
        backgroundColor: "#42a5f5",
      },
    ],
  };

  const gateTransactionCounter = {
    labels: gateTransactionCounterLabel,
    datasets: [
      {
        label: "Jumlah Transaksi",
        data: gateTransactionCounterData,
        backgroundColor: "#42a5f5",
      },
    ],
  };

  const trafficPercentageTransactionCounter = {
    labels: trafficPercentageTransactionCounterLabel,
    datasets: [
      {
        label: "Persentase Transaksi",
        data: trafficPercentageTransactionCounterData,
        backgroundColor: ["#66bb6a", "#ffa726", "#ef5350"],
      },
    ],
  };

  const branchPercentageTransactionCounter = {
    labels: branchPercentageTransactionCounterLabel,
    datasets: [
      {
        label: "Persentase Transaksi",
        data: branchPercentageTransactionCounterData,
        backgroundColor: ["#66bb6a", "#ffa726", "#ef5350"],
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 50,
        },
      },
    },
  };

  const pieOptions = {
    plugins: {
      legend: {
        position: "bottom",
        align: "center",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
        },
      },
    },
  };

  const fetchData = async (date) => {
    try {
      const formattedDate = dayjs(date).format("YYYY-MM-DD");
      const response = await axios.get(
        `${baseUrl}/lalins?tanggal=${formattedDate}&limit=1000`
      );
      // need get all data endpoint without limit param

      const data = response?.data?.data?.rows?.rows;
      if (!data || isEmpty(data)) {
        setErrorMessage("No data found. Please choose another date!");
        setOpenSnackbar(true);
      } else {
        setErrorMessage("");
        setOpenSnackbar(false);
      }
      const excludedKeys = [
        "Tanggal",
        "Golongan",
        "IdAsalGerbang",
        "IdCabang",
        "IdGardu",
        "IdGerbang",
        "Shift",
      ];
      // need api to exclude keys above

      const countPerCategory = {};
      const totalPerKey = {};

      // need api to get sum of data and sum of each categories
      data.forEach((item) => {
        // Counter all (sum)
        const totalPerRow = Object.entries(item)
          .filter(([key]) => !excludedKeys.includes(key))
          .reduce((sum, [_, value]) => sum + value, 0);

        // Counter by category
        excludedKeys.forEach((key) => {
          if (item[key] !== undefined) {
            const val = item[key];
            if (!countPerCategory[key]) countPerCategory[key] = {};
            if (!countPerCategory[key][val]) countPerCategory[key][val] = 0;
            countPerCategory[key][val] += totalPerRow;
          }
        });

        // Count each key exclude excluding key
        Object.entries(item).forEach(([key, value]) => {
          if (!excludedKeys.includes(key)) {
            if (!totalPerKey[key]) totalPerKey[key] = 0;
            totalPerKey[key] += value;
          }
        });
      });

      // Format category counter for each id
      const formattedCategoryCounts = {};
      Object.entries(countPerCategory).forEach(([key, valObj]) => {
        formattedCategoryCounts[key] = Object.entries(valObj).map(
          ([id, count]) => ({
            id: Number(id),
            count,
          })
        );
      });

      // Payment Transaction Counter Summary
      const ptcs = Object.fromEntries(
        Object.entries(totalPerKey).filter(
          ([key]) =>
            !["id", "DinasOpr", "DinasMitra", "DinasKary"].includes(key)
        )
      );
      setPaymentTransactionCounterData([
        ptcs.Tunai,
        ptcs.eBca,
        ptcs.eBni,
        ptcs.eBri,
        ptcs.eDki,
        ptcs.eFlo,
        ptcs.eMandiri,
        ptcs.eMega,
        ptcs.eNobu,
      ]);

      // Gate Transaction Counter Label/Data Summary
      const gtcl = [];
      const gtcd = [];
      for (let i = 0; i < formattedCategoryCounts?.IdGerbang?.length; i++) {
        gtcl.push("Gerbang " + formattedCategoryCounts.IdGerbang[i]?.id);
        gtcd.push(formattedCategoryCounts.IdGerbang[i]?.count);
      }
      setGateTransactionCounterLabel(gtcl);
      setGateTransactionCounterData(gtcd);

      // Traffic Transaction Percetage Counter Summary
      const ttpcl = [];
      const ttpcd = [];
      let ttpct = 0;
      for (let i = 0; i < formattedCategoryCounts?.Shift?.length; i++) {
        ttpct += formattedCategoryCounts.Shift[i]?.count;
      }
      for (let i = 0; i < formattedCategoryCounts?.Shift?.length; i++) {
        let val = (
          (formattedCategoryCounts.Shift[i]?.count / ttpct) *
          100
        ).toFixed(2);
        ttpcl.push(
          "Shift " + formattedCategoryCounts.Shift[i]?.id + ` (${val}%)`
        );
        ttpcd.push(val);
      }
      setTrafficTransactionPercentageCounterLabel(ttpcl);
      setTrafficTransactionPercentageCounterData(ttpcd);

      // Branch Transaction Percentage Counter Summary
      const btpcl = [];
      const btpcd = [];
      let btpct = 0;
      for (let i = 0; i < formattedCategoryCounts?.IdCabang?.length; i++) {
        btpct += formattedCategoryCounts.IdCabang[i]?.count;
      }
      for (let i = 0; i < formattedCategoryCounts?.IdCabang?.length; i++) {
        let val = (
          (formattedCategoryCounts.IdCabang[i]?.count / btpct) *
          100
        ).toFixed(2);
        btpcl.push(
          "Ruas " + formattedCategoryCounts.IdCabang[i]?.id + ` (${val}%)`
        );
        btpcd.push(val);
      }
      setBranchTransactionPercentageCounterLabel(btpcl);
      setBranchTransactionPercentageCounterData(btpcd);
    } catch (error) {
      console.error("Fetch error:", error);
      setErrorMessage(error.message || "Something went wrong!");
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    fetchData(selectedDate);
  }, []);

  const handleLoading = (value = true) => {
    setLoading(value);
  };

  const fetchDashboardData = async () => {
    handleLoading(true);
    // Simulate backend process
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await fetchData(selectedDate);
    handleLoading(false);
  };

  return (
    <div>
      {loading && <Loader />}

      <h2>Dashboard</h2>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="error"
          onClose={() => setOpenSnackbar(false)}
          variant="filled"
        >
          {errorMessage}
        </Alert>
      </Snackbar>
      {/* End of snackbar */}

      <Grid container spacing={0} mb={3}>
        <Grid item size="grow">
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
            <DatePicker
              label="Choose Date"
              value={selectedDate}
              onChange={(value) => setSelectedDate(value)}
              format="DD MMMM YYYY"
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>

          <Button
            type="submit"
            variant="contained"
            onClick={fetchDashboardData}
            sx={{
              ml: 2,
              px: 5,
              py: 2,
              boxShadow: "none",
              border: "none",
              textTransform: "capitalize",
              backgroundColor: "#01409D",
            }}
          >
            Filter
          </Button>
        </Grid>
      </Grid>

      {errorMessage ? (
        <Alert severity="warning">No data to Display</Alert>
      ) : (
        <Grid container spacing={2} sx={{ minHeight: 100 }}>
          <Grid
            item
            size={{ xs: 12, md: 6 }}
            sx={{ height: "25vh", minHeight: 230, maxHeight: 250 }}
          >
            <Bar data={paymentTransactionCounter} options={barOptions} />
          </Grid>
          <Grid
            item
            size={{ xs: 12, md: 6 }}
            sx={{ height: "25vh", minHeight: 230, maxHeight: 250 }}
          >
            <Pie
              data={trafficPercentageTransactionCounter}
              options={pieOptions}
            />
          </Grid>
          <Grid
            item
            size={{ xs: 12, md: 6 }}
            sx={{ height: "25vh", minHeight: 230, maxHeight: 250 }}
          >
            <Bar data={gateTransactionCounter} options={barOptions} />
          </Grid>
          <Grid
            item
            size={{ xs: 12, md: 6 }}
            sx={{ height: "25vh", minHeight: 230, maxHeight: 250 }}
          >
            <Pie
              data={branchPercentageTransactionCounter}
              options={pieOptions}
            />
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default DashboardResume;

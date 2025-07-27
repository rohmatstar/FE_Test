import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Grid,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Add, SaveAlt, SearchOutlined } from "@mui/icons-material";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/id";

dayjs.locale("id");

// Using dummy data cause the data format needed doesnt covered by endpoint in existing backend service
const generateDummyData = (jumlah) => {
  const metodePembayaran = [
    "Tunai",
    "E-Toll",
    "Flo",
    "KTP",
    "Keseluruhan",
    "E-Toll+Tunai+Flo",
  ];
  const hariIndo = [
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
    "Minggu",
  ];

  const pad = (n) => (n < 10 ? "0" + n : n);

  const getRandomDate = () => {
    const start = new Date(2024, 0, 1);
    const end = new Date(2025, 11, 31);
    const date = new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
    return {
      hari: hariIndo[date.getDay() === 0 ? 6 : date.getDay() - 1], // 0 = Sunday
      tanggal: `${pad(date.getDate())}-${pad(
        date.getMonth() + 1
      )}-${date.getFullYear()}`,
    };
  };

  const result = [];
  for (let i = 1; i <= jumlah; i++) {
    const { hari, tanggal } = getRandomDate();
    const golI = Math.floor(Math.random() * 1001);
    const golII = Math.floor(Math.random() * 1001);
    const golIII = Math.floor(Math.random() * 1001);
    const golIV = Math.floor(Math.random() * 1001);
    const golV = Math.floor(Math.random() * 1001);
    const totalLalin = golI + golII + golIII + golIV + golV;

    result.push({
      id: i,
      number: i,
      ruas: "Ruas " + Math.floor(Math.random() * 10) + 1,
      gerbang: "Gerbang " + Math.floor(Math.random() * 10) + 1,
      gardu: String(Math.floor(Math.random() * 10) + 1).padStart(2, "0"),
      hari,
      tanggal,
      metode:
        metodePembayaran[Math.floor(Math.random() * metodePembayaran.length)],
      golI,
      golII,
      golIII,
      golIV,
      golV,
      totalLalin,
    });
  }

  return result;
};
const data = generateDummyData(100);

const columns = [
  {
    field: "number",
    headerName: "No.",
    width: 70,
    sortable: false,
    renderCell: (params) => {
      const sortedRowIds = params.api.getSortedRowIds();
      const rowIndex = sortedRowIds.indexOf(params.id);
      const page = params.api.state.pagination.paginationModel.page;
      const pageSize = params.api.state.pagination.paginationModel.pageSize;
      return page * pageSize + rowIndex + 1;
    },
  },
  {
    field: "ruas",
    headerName: "Ruas",
    flex: 1,
    sortable: true,
  },
  {
    field: "gerbang",
    headerName: "Gerbang",
    flex: 1,
    sortable: true,
  },
  {
    field: "gardu",
    headerName: "Gardu",
    flex: 1,
    sortable: true,
  },
  { field: "hari", headerName: "Hari", flex: 1, sortable: true },
  { field: "tanggal", headerName: "Tanggal", flex: 1, sortable: true },
  {
    field: "metode",
    headerName: "Metode Pembayaran",
    flex: 1,
    sortable: true,
    width: 200,
  },
  {
    field: "golI",
    headerName: "Gol I",
    flex: 1,
    sortable: true,
    renderCell: (params) => new Intl.NumberFormat("id-ID").format(params.value),
  },
  {
    field: "golII",
    headerName: "Gol II",
    flex: 1,
    sortable: true,
    renderCell: (params) => new Intl.NumberFormat("id-ID").format(params.value),
  },
  {
    field: "golIII",
    headerName: "Gol III",
    flex: 1,
    sortable: true,
    renderCell: (params) => new Intl.NumberFormat("id-ID").format(params.value),
  },
  {
    field: "golIV",
    headerName: "Gol IV",
    flex: 1,
    sortable: true,
    renderCell: (params) => new Intl.NumberFormat("id-ID").format(params.value),
  },
  {
    field: "golV",
    headerName: "Gol V",
    flex: 1,
    sortable: true,
    renderCell: (params) => new Intl.NumberFormat("id-ID").format(params.value),
  },
  {
    field: "totalLalin",
    headerName: "Total Lalin",
    flex: 1,
    sortable: true,
    renderCell: (params) => new Intl.NumberFormat("id-ID").format(params.value),
  },
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const DailyTraffic = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [appliedDate, setAppliedDate] = useState("");

  const [tabValue, setTabValue] = useState(0);
  const tabLabels = [
    "Tunai",
    "E-Toll",
    "Flo",
    "KTP",
    "Keseluruhan",
    "E-Toll+Tunai+Flo",
  ];

  const filteredData = useMemo(() => {
    const label = tabLabels[tabValue];

    let filtered = data;

    if (label === "E-Toll+Tunai+Flo") {
      filtered = data.filter((row) =>
        ["E-Toll", "Tunai", "Flo"].includes(row.metode)
      );
    } else if (label !== "Keseluruhan") {
      filtered = data.filter((row) => row.metode === label);
    }

    if (appliedDate) {
      filtered = filtered.filter((row) => row.tanggal === appliedDate);
    }

    filtered = filtered.filter((row) =>
      [
        "ruas",
        "gerbang",
        "gardu",
        "hari",
        "tanggal",
        "golI",
        "golII",
        "golIII",
        "golIV",
        "golV",
      ].some((key) => String(row[key]).includes(searchQuery))
    );

    return filtered;
  }, [data, tabValue, appliedDate, searchQuery]);

  const summaryByRuas = {};
  const totalKeseluruhan = {
    golI: 0,
    golII: 0,
    golIII: 0,
    golIV: 0,
    golV: 0,
    totalLalin: 0,
  };

  filteredData.forEach((item) => {
    const { ruas, golI, golII, golIII, golIV, golV, totalLalin } = item;

    if (!summaryByRuas[ruas]) {
      summaryByRuas[ruas] = {
        golI: 0,
        golII: 0,
        golIII: 0,
        golIV: 0,
        golV: 0,
        totalLalin: 0,
      };
    }

    summaryByRuas[ruas].golI += golI;
    summaryByRuas[ruas].golII += golII;
    summaryByRuas[ruas].golIII += golIII;
    summaryByRuas[ruas].golIV += golIV;
    summaryByRuas[ruas].golV += golV;
    summaryByRuas[ruas].totalLalin += totalLalin;

    totalKeseluruhan.golI += golI;
    totalKeseluruhan.golII += golII;
    totalKeseluruhan.golIII += golIII;
    totalKeseluruhan.golIV += golIV;
    totalKeseluruhan.golV += golV;
    totalKeseluruhan.totalLalin += totalLalin;
  });

  const sortedSummaryByRuas = Object.fromEntries(
    Object.entries(summaryByRuas).sort(([ruasA], [ruasB]) =>
      ruasA.localeCompare(ruasB)
    )
  );

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Laporan Lalu Lintas Per Hari"
    );
    XLSX.writeFile(workbook, "[MINT] Laporan Lalu Lintas Per Hari.xlsx");
    setAnchorEl(null);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Lalu Lintas Per Hari", 14, 10);
    autoTable(doc, {
      startY: 20,
      head: [columns.map((col) => col.headerName)],
      body: data.map((row) => columns.map((col) => row[col.field])),
    });
    doc.save("[MINT] Laporan Lalu Lintas Per Hari.pdf");
    setAnchorEl(null);
  };

  const totalPage = 100;
  const [currentPage, setCurrentPage] = useState(1);

  const handleClick = (page) => {
    setCurrentPage(page);
    console.log("Clicked page:", page);
  };

  const handleApplyFilter = () => {
    const formattedDate = selectedDate
      ? dayjs(selectedDate).format("DD-MM-YYYY")
      : null;
    console.log(formattedDate);
    // increment key datagrid
    setAppliedDate(formattedDate);
  };

  const handleResetFilter = () => {
    setSelectedDate(null);
    setAppliedDate(null);
    setSearchQuery("");
  };

  return (
    <div>
      <h2>Laporan Lalin Per Hari</h2>

      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 3,
        }}
      >
        <Grid container spacing={0} mb={0}>
          <Grid item size="grow">
            <TextField
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              variant="outlined"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlined />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                mr: 1,
              }}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
              <DatePicker
                label="Choose Date"
                value={selectedDate ? dayjs(selectedDate) : null}
                onChange={(value) => setSelectedDate(value)}
                format="DD MMMM YYYY"
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>

            <Button
              onClick={handleApplyFilter}
              variant="contained"
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

            <Button
              onClick={handleResetFilter}
              variant="outlined"
              sx={{
                ml: 2,
                px: 5,
                py: 2,
                boxShadow: "none",
                textTransform: "capitalize",
                borderColor: "#01409D",
                color: "#01409D",
                backgroundColor: "white",
              }}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ width: "100%" }}>
        <Grid
          container
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Grid item>
            <Tabs
              indicatorColor="none"
              textColor="inherit"
              value={tabValue}
              onChange={handleChange}
              aria-label="Total Tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              {tabLabels.map((label, index) => (
                <Tab
                  key={index}
                  label={`Total ${label}`}
                  sx={{
                    backgroundColor: tabValue === index ? "#01409D" : "#e0e0e0",
                    color: tabValue === index ? "white" : "black",
                    mx: 0.5,
                    borderRadius: 1,
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                />
              ))}
            </Tabs>
          </Grid>
          <Grid item>
            <Box
              sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}
            >
              <div>
                <Button
                  variant="contained"
                  startIcon={<SaveAlt />}
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  sx={{
                    ml: 2,
                    px: 5,
                    py: 2,
                    boxShadow: "none",
                    border: "none",
                    textTransform: "capitalize",
                    backgroundColor: "#FFD400",
                    color: "#01409D",
                  }}
                >
                  Export
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={() => setAnchorEl(null)}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem onClick={handleExportExcel}>
                    Export to Excel
                  </MenuItem>
                  <MenuItem onClick={handleExportPDF}>Export to PDF</MenuItem>
                </Menu>
              </div>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={filteredData}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 15, 20, 50, 100, 200]}
          disableRowSelectionOnClick
          sx={{
            minHeight: 1000, // Menentukan tinggi minimum
          }}
          slots={{
            footer: () => (
              <TableContainer
                component={Paper}
                sx={{
                  mt: 4,
                  overflow: "visible", // pastikan tidak ada scroll
                  maxHeight: "none", // hilangkan batas tinggi
                  maxWidth: "100%", // pastikan lebar tidak dibatasi
                  boxShadow: "none", // opsional, agar terlihat menyatu
                }}
              >
                <Table size="small">
                  <TableBody>
                    {Object.entries(sortedSummaryByRuas).map(([ruas, data]) => (
                      <TableRow key={ruas}>
                        <TableCell colSpan={7}>
                          <Typography fontWeight="bold">
                            Total {ruas}: Gol I = {data.golI}, Gol II ={" "}
                            {data.golII}, Gol III = {data.golIII}, Gol IV ={" "}
                            {data.golIV}, Gol V = {data.golV}, Total ={" "}
                            {data.totalLalin}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ),
          }}
        />
      </Box>
    </div>
  );
};

export default DailyTraffic;

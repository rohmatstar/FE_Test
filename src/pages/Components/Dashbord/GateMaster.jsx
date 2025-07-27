import {
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  InputAdornment,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Edit,
  Delete,
  Visibility,
  Add,
  SearchOutlined,
  Check,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

import {
  getGerbangs,
  createGerbang,
  updateGerbang,
  deleteGerbang,
} from "../../../services/gateService";
import { DataGrid } from "@mui/x-data-grid";

const GateMaster = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [gateData, setGateData] = useState([]);
  const columns = [
    {
      field: "no",
      headerName: "No.",
      width: 70,
      sortable: false,
      filterable: false,
      renderCell: (params) =>
        params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
    },
    { field: "IdCabang", headerName: "ID Cabang", width: 120 },
    { field: "NamaGerbang", headerName: "Nama Gerbang", flex: 1 },
    { field: "NamaCabang", headerName: "Nama Cabang", flex: 1 },
    {
      field: "aksi",
      headerName: "Aksi",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleEdit(params.row)}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDetail(params.row)}>
            <Visibility />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row)}>
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const fetchData = async () => {
    try {
      const data = await getGerbangs();
      console.log("data?.data?.rows?.rows", data?.data?.rows?.rows);
      setGateData(data?.data?.rows?.rows);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (row) => {
    setSelectedData(row);
    console.log(row);
    setFormData(row);
    setEditOpen(true);
  };

  const handleDetail = (row) => {
    setSelectedData(row);
    setDetailOpen(true);
  };

  const handleDelete = (row) => {
    Swal.fire({
      title: "Continue delete?",
      text: `Gerbang "${row.NamaGerbang}" will be delete!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      confirmButtonColor: "#d33",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteGerbang(row);
          await fetchData();
          Swal.fire("Deleted!", "Successfully deleted", "success");
        } catch (error) {
          console.error("Delete failed:", error);
          Swal.fire(
            "Error",
            error?.response?.data?.message || "Failed to delete data",
            "error"
          );
        }
      }
    });
  };

  const handleClose = () => {
    setEditOpen(false);
    setDetailOpen(false);
    setSelectedData(null);
  };

  const [formData, setFormData] = useState({
    IdCabang: selectedData?.IdCabang || "",
    NamaGerbang: selectedData?.NamaGerbang || "",
    NamaCabang: selectedData?.NamaCabang || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    let temp = {};
    temp.IdCabang =
      formData.IdCabang && parseInt(formData.IdCabang) >= 1
        ? ""
        : "Wajib diisi dan minimal 1";
    temp.NamaGerbang = formData.NamaGerbang ? "" : "Wajib diisi";
    temp.NamaCabang = formData.NamaCabang ? "" : "Wajib diisi";
    setErrors(temp);
    return Object.values(temp).every((x) => x === "");
  };

  const handleSave = async (formData) => {
    try {
      const payload = {
        id: gateData.length + 1,
        IdCabang: parseInt(formData?.IdCabang),
        NamaGerbang: formData?.NamaGerbang,
        NamaCabang: formData?.NamaCabang,
      };

      await createGerbang(payload);

      setSnackbar({
        open: true,
        message: "Berhasil disimpan!",
        severity: "success",
      });
      setAddOpen(false);
      fetchData();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Gagal menyimpan",
        severity: "error",
      });
    }
  };

  const handleSaveEdit = async (formData) => {
    console.log("editing");
    try {
      const payload = {
        id: selectedData?.id || 0,
        IdCabang: parseInt(formData?.IdCabang),
        NamaGerbang: formData?.NamaGerbang,
        NamaCabang: formData?.NamaCabang,
      };

      await updateGerbang(payload);

      setSnackbar({
        open: true,
        message: "Berhasil diubah!",
        severity: "success",
      });
      setEditOpen(false);
      fetchData();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Gagal menyimpan",
        severity: "error",
      });
    }
  };

  const handleSubmit = () => {
    if (validate()) {
      if (selectedData) {
        handleSaveEdit(formData);
      } else {
        handleSave(formData);
      }
      handleClose();
    }
  };

  return (
    <div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <h2>Master Data Gerbang</h2>

      {/* Dialog Add */}
      <Dialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle variant="h5">Add Gate</DialogTitle>
        <DialogContent>
          <TextField
            name="IdCabang"
            label="ID Cabang"
            type="number"
            fullWidth
            required
            margin="normal"
            value={formData.IdCabang}
            onChange={handleChange}
            error={!!errors.IdCabang}
            helperText={errors.IdCabang}
          />
          <TextField
            name="NamaGerbang"
            label="Nama Gerbang"
            fullWidth
            required
            margin="normal"
            value={formData.NamaGerbang}
            onChange={handleChange}
            error={!!errors.NamaGerbang}
            helperText={errors.NamaGerbang}
          />
          <TextField
            name="NamaCabang"
            label="Nama Cabang"
            fullWidth
            required
            margin="normal"
            value={formData.NamaCabang}
            onChange={handleChange}
            error={!!errors.NamaCabang}
            helperText={errors.NamaCabang}
          />
        </DialogContent>
        <DialogActions
          sx={{
            borderTop: "1px solid #e0e0e0",
            p: 3,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button color="error" onClick={() => setAddOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
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
            <Check sx={{ mr: 2 }} />
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Edit */}
      <Dialog open={editOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle variant="h5">Edit Gate</DialogTitle>
        <DialogContent>
          <TextField
            name="id"
            type="hidden"
            value={selectedData?.id}
            sx={{ display: "none" }}
          />
          <TextField
            name="IdCabang"
            label="ID Cabang"
            type="number"
            fullWidth
            required
            margin="normal"
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
            value={formData?.IdCabang}
            onChange={handleChange}
            error={!!errors.IdCabang}
            helperText={errors.IdCabang}
          />
          <TextField
            name="NamaGerbang"
            label="Nama Gerbang"
            fullWidth
            required
            margin="normal"
            value={formData?.NamaGerbang}
            onChange={handleChange}
            error={!!errors.NamaGerbang}
            helperText={errors.NamaGerbang}
          />
          <TextField
            name="NamaCabang"
            label="Nama Cabang"
            fullWidth
            required
            margin="normal"
            value={formData?.NamaCabang}
            onChange={handleChange}
            error={!!errors.NamaCabang}
            helperText={errors.NamaCabang}
          />
        </DialogContent>
        <DialogActions
          sx={{
            borderTop: "1px solid #e0e0e0",
            p: 3,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button color="error" onClick={() => setEditOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
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
            <Check sx={{ mr: 2 }} />
            Save Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Detail */}
      <Dialog open={detailOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle variant="h5">Gate Detail</DialogTitle>
        <DialogContent>
          <TextField
            name="id"
            type="hidden"
            value={selectedData?.id}
            sx={{ display: "none" }}
          />
          <TextField
            name="IdCabang"
            label="ID Cabang"
            type="number"
            fullWidth
            required
            margin="normal"
            disabled
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
            value={formData?.IdCabang}
            onChange={handleChange}
            error={!!errors.IdCabang}
            helperText={errors.IdCabang}
          />
          <TextField
            name="NamaGerbang"
            label="Nama Gerbang"
            fullWidth
            required
            margin="normal"
            disabled
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
            value={formData?.NamaGerbang}
            onChange={handleChange}
            error={!!errors.NamaGerbang}
            helperText={errors.NamaGerbang}
          />
          <TextField
            name="NamaCabang"
            label="Nama Cabang"
            fullWidth
            required
            margin="normal"
            disabled
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
            value={formData?.NamaCabang}
            onChange={handleChange}
            error={!!errors.NamaCabang}
            helperText={errors.NamaCabang}
          />
        </DialogContent>
        <DialogActions
          sx={{
            borderTop: "1px solid #e0e0e0",
            p: 3,
            display: "flex",
            justifyContent: "end",
          }}
        >
          <Button color="error" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={0} mb={3}>
        <Grid
          item
          size="grow"
          sx={{ display: "flex" }}
          justifyContent={"space-between"}
        >
          <TextField
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
          />

          <Button
            type="submit"
            variant="contained"
            onClick={() => setAddOpen(true)}
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
            <Add />
            Add New Gate
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ minHeight: 400, width: "100%" }}>
        <DataGrid
          rows={gateData}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20, 50, 100, 500]}
          pagination
          disableRowSelectionOnClick
        />
      </Box>
    </div>
  );
};

export default GateMaster;

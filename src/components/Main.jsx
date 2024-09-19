import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSchedules,
  addSchedule,
  updateSchedule,
  deleteSchedule,
  downloadSchedulePDF,
} from "../redux/scheduleSlice";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download,
} from "@mui/icons-material";
import Pagination from "@mui/material/Pagination";
import AddModal from "./AddModal"; // Import AddModal
import UpdateModal from "./Modal"; // Import UpdateModal
import ConfirmModal from "./ConfirmModal";

const MainPage = () => {
  const dispatch = useDispatch();
  const schedules = useSelector((state) => state.schedules.schedules) || [];

  const [open, setOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [isAdding, setIsAdding] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Adjust this for number of rows per page

  useEffect(() => {
    dispatch(fetchSchedules());
  }, [dispatch, page, rowsPerPage]);

  const handleOpen = (schedule = null) => {
    setCurrentSchedule(schedule);
    setIsAdding(!schedule);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setConfirmOpen(false);
  };

  const handleAdd = (data) => {
    dispatch(addSchedule(data));
    handleClose();
  };

  const handleUpdate = (data) => {
    dispatch(updateSchedule({ ...currentSchedule, ...data }));
    handleClose();
  };

  const handleDelete = (id) => {
    setScheduleToDelete(id);
    setConfirmOpen(true);
  };

  const confirmDelete = (id) => {
    dispatch(deleteSchedule(id));
    setScheduleToDelete(null);
  };

  const handleDownloadPDF = (id) => {
    dispatch(downloadSchedulePDF(id));
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Get the total number of schedules from the state
  const totalSchedules = schedules || 0;

  // Calculate paginated schedules
  const paginatedSchedules = Array.isArray(schedules)
    ? schedules.slice((page - 1) * rowsPerPage, page * rowsPerPage)
    : [];

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold uppercase">Schedules</h1>
        <IconButton onClick={() => handleOpen()} color="primary">
          <Tooltip title="Add New Schedule" arrow>
            <AddIcon />
          </Tooltip>
        </IconButton>
      </div>

      <div className="overflow-x-auto border border-gray-500 rounded-lg">
        {totalSchedules === 0 ? (
          <div className="flex justify-center items-center h-48">
            <CircularProgress />
          </div>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      School Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Principal Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Vice Principal Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Standard</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Division</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedSchedules.map((schedule) => (
                    <TableRow key={schedule._id}>
                      <TableCell>{schedule.schoolName}</TableCell>
                      <TableCell>{schedule.principalName}</TableCell>
                      <TableCell>{schedule.vicePrincipalName}</TableCell>
                      <TableCell>{schedule.standard}</TableCell>
                      <TableCell>{schedule.division}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <IconButton
                            onClick={() => handleOpen(schedule)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(schedule._id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            onClick={() => handleDownloadPDF(schedule._id)}
                          >
                            <Download />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <div className="flex justify-end items-end mt-4">
              <Pagination
                count={Math.ceil(totalSchedules / rowsPerPage)} // Use totalSchedules for pagination count
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </div>
          </>
        )}
      </div>

      {open && isAdding ? (
        <AddModal open={open} handleClose={handleClose} handleAdd={handleAdd} />
      ) : (
        open && (
          <UpdateModal
            open={open}
            handleClose={handleClose}
            Id={currentSchedule._id}
            handleUpdate={handleUpdate}
          />
        )
      )}

      <ConfirmModal
        open={confirmOpen}
        handleClose={handleClose}
        handleConfirm={confirmDelete}
        itemId={scheduleToDelete}
      />
    </div>
  );
};

export default MainPage;

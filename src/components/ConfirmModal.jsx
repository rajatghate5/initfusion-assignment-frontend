import React from "react";
import { Modal, Typography, Button, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ConfirmModal = ({ open, handleClose, handleConfirm, itemId }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="confirm-modal-title"
    >
      <Box className="flex items-center justify-center h-full" sx={{ p: 2 }}>
        <Box
          className="relative bg-white p-4 rounded-lg shadow-lg max-w-sm w-full h-fit border"
          sx={{ position: "relative" }}
        >
          <IconButton
            onClick={handleClose}
            edge="end"
            color="inherit"
            aria-label="close"
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" id="confirm-modal-title" className="mb-4">
            Are you sure you want to delete this item?
          </Typography>
          <Box
            display="flex"
            justifyContent="space-between"
            sx={{ marginTop: 3 }}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                handleConfirm(itemId);
                handleClose();
              }}
            >
              Confirm
            </Button>
            <Button variant="outlined" color="error" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmModal;

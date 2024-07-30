import { Box, Modal, Typography } from "@mui/material";

export default function modal({ open, handleClose }) {
  return (
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="Add new pantry item form"
        aria-describedby="Form to add a new item to your pantry"
    >
        <Box>
            <Typography>
                Add a new item
            </Typography>
        </Box>
    </Modal>
  )
}

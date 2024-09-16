import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

interface DialogProps {
  title?: string;
  content?: string;
  confirmText?: string;
  cancelText?: string;
  handleConfirm?: () => void;
  handleCancel?: () => void;
}

const GenericDialog = (props: DialogProps) => {
  const {
    title,
    content,
    confirmText,
    cancelText,
    handleConfirm,
    handleCancel,
  } = props;
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Dialog fullScreen={fullScreen} open={true} onClose={handleCancel}>
        <Box sx={{ padding: "10px" }}>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{content}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="inherit" onClick={handleCancel}>
              {cancelText}
            </Button>
            <Button variant="contained" color="error" onClick={handleConfirm}>
              {confirmText}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default GenericDialog;

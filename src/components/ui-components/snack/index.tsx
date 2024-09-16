import * as React from "react";
import { Snackbar, Alert, AlertTitle } from "@mui/material";
import { useSelector } from "react-redux";
import { AppState } from "@/store/store";
import { hideSnack } from "@/store/snack/snackSlice";
import { useDispatch } from "@/store/hooks";

const Snack = () => {
  const snack = useSelector((state: AppState) => state.snack);
  const dispatch = useDispatch();

  const handleClose = (reason: any) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(hideSnack());
  };

  if (!snack.show) return <></>;

  return (
    <React.Fragment>
      <Snackbar
        open={snack.show}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={snack.type}
          variant="filled"
          sx={{
            width: "100%",
            color: "white",
          }}
        >
          <AlertTitle>{snack?.title}</AlertTitle>
          {snack?.subtitle}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default Snack;

import { Box, Grid, TextField } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import { useState } from "react";
import SnackbarNotification from "./SnackbarNotification";
import { AlertColor } from "@mui/material/Alert";
import ManipulateJwt from "./tools/ManipulateJwt";

import SetJwt from "./tools/SetJwt";
import TestFormatter from "./tools/TestFormatter";

export enum Tools {
  CLIPBOARD = "Clipboard",
  JWT_SET = "Set JWT",
  JWT_MANIPULATE = "Manipulate JWT",
  TEST_FORMATTER = "Test Output Formatter",
}

interface ContentProps {
  selectedTool: Tools | null;
}

const Content: React.FC<ContentProps> = ({ selectedTool }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackBarMessageType, setSnackBarMessageType] =
    useState<AlertColor>("success");

  const showSnackbar = (message: string, type: AlertColor) => {
    setSnackBarMessage(message);
    setSnackBarMessageType(type);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSnackBarMessage("");
  };

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
    >
      <Toolbar />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              mt: 1,
            }}
          >
            {selectedTool === Tools.CLIPBOARD && (
              <TextField
                label="Enter Text"
                fullWidth
                variant="outlined"
                multiline
                sx={{ marginBottom: 2, overflow: "auto" }}
              />
            )}
            {selectedTool === Tools.JWT_SET && (
              <SetJwt onShowSnackbar={showSnackbar} />
            )}
            {selectedTool === Tools.JWT_MANIPULATE && (
              <ManipulateJwt onShowSnackbar={showSnackbar} />
            )}
            {selectedTool === Tools.TEST_FORMATTER && (
              <TestFormatter onShowSnackbar={showSnackbar} />
            )}
          </Box>
        </Grid>
      </Grid>
      <SnackbarNotification
        open={openSnackbar}
        message={snackBarMessage}
        type={snackBarMessageType}
        onClose={handleCloseSnackbar}
      />
    </Box>
  );
};

export default Content;

import { Box, Grid, TextField } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import { useState } from "react";
import SnackbarNotification from "./SnackbarNotification";
import { AlertColor } from "@mui/material/Alert";
import ManipulateJwt from "./tools/ManipulateJwt";

import SetJwt from "./tools/SetJwt";
import TestFormatter from "./tools/TestFormatter";
import Clipboard from "./tools/Clipboard";

export enum Tools {
  Clipboard = "Clipboard",
  JwtSet = "Set JWT",
  JwtManipulate = "Manipulate JWT",
  TestFormatter = "Test Output Formatter",
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
            {selectedTool === Tools.Clipboard && (
              <Clipboard onShowSnackbar={showSnackbar} />
            )}
            {selectedTool === Tools.JwtSet && (
              <SetJwt onShowSnackbar={showSnackbar} />
            )}
            {selectedTool === Tools.JwtManipulate && (
              <ManipulateJwt onShowSnackbar={showSnackbar} />
            )}
            {selectedTool === Tools.TestFormatter && (
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

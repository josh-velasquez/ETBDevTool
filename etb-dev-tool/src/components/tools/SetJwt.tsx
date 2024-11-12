import { Box, Button, TextField, Typography } from "@mui/material";
import ToolInfo from "../ToolInfo";
import { Tools } from "../Content";
import { useState } from "react";
import { extractDataFromJwt, signJwt, verifyJwt } from "../../util/Util";

interface SetJwtProps {
  onShowSnackbar: (message: string, type: "success" | "error") => void;
}

const SetJwt: React.FC<SetJwtProps> = ({ onShowSnackbar }) => {
  const secretKey = process.env.REACT_APP_JWT_SECRET_KEY;
  const [jwt, setJwt] = useState<string>(
    process.env.REACT_APP_SUPER_USER_TOKEN || ""
  );

  const handleSetSuperuserJWT = () => {
    if (jwt) {
      localStorage.setItem("DEV_TOKEN_OVERRIDE", jwt);
      onShowSnackbar("Successfully set JWT in local storage!", "success");
    } else {
      onShowSnackbar("No JWT found to set!", "error");
    }
  };

  const handleVerifyJwt = async () => {
    if (!secretKey) {
      onShowSnackbar(
        "JWT Secret Key is not set in environment variables!",
        "error"
      );
      return;
    }
    try {
      const { header, payload } = extractDataFromJwt(jwt);
      const signedJwt = await signJwt(header, payload, secretKey);
      if (signedJwt) {
        setJwt(signedJwt);
        await verifyJwt(signedJwt, secretKey);
        onShowSnackbar("Successfully decoded and signed JWT", "success");
      }
    } catch (error) {
      onShowSnackbar("Failed to decode and sign JWT", "error");
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <ToolInfo
        title={Tools.JwtSet}
        info={
          "Click the button below to set the superuser JWT for the application. This will override any existing JWT token in local storage."
        }
      />
      <TextField
        label="JWT"
        value={jwt}
        fullWidth
        variant="outlined"
        onChange={(e) => setJwt(e.target.value)}
        multiline
        sx={{ marginBottom: 2, overflow: "auto" }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleVerifyJwt}
        sx={{ marginBottom: 2 }}
      >
        Sign & Verify JWT
      </Button>
      <Typography
        variant="body2"
        sx={{
          fontFamily: "monospace",
          backgroundColor: "#f5f5f5",
          padding: "8px",
          borderRadius: "4px",
          marginBottom: 2,
        }}
      >
        {`localStorage.setItem("DEV_TOKEN_OVERRIDE", jwt);`}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSetSuperuserJWT}
      >
        Set JWT
      </Button>
    </Box>
  );
};

export default SetJwt;

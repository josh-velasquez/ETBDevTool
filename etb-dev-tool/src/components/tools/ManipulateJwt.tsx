import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Grid,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ReactJson from "react-json-view";
import { Tools } from "../Content";
import ToolInfo from "../ToolInfo";
import { extractDataFromJwt, signJwt } from "../../util/Util";

interface Payload {
  [key: string]: any;
}

interface ManipulateJwtProps {
  onShowSnackbar: (message: string, type: "success" | "error") => void;
}

const ManipulateJwt: React.FC<ManipulateJwtProps> = ({ onShowSnackbar }) => {
  const secretKey = process.env.REACT_APP_JWT_SECRET_KEY;
  const [jwt, setJwt] = useState<string>("");
  const [generatedJwt, setGeneratedJwt] = useState<string>("");
  const [header, setHeader] = useState<any>({});
  const [payload, setPayload] = useState<Payload>({});
  const [permissionsList, setPermissionsList] = useState<string[]>([]);
  const [checkedPermissions, setCheckedPermissions] = useState<Set<string>>(
    new Set()
  );

  const handleJwtChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJwt(event.target.value);
  };

  const handleDecodeJwtClick = async () => {
    try {
      const { header, payload } = extractDataFromJwt(jwt);
      setHeader(header);
      setPayload(payload);

      const decodedPermissions = (payload.permissions as string[]) || [];
      setPermissionsList(decodedPermissions);
      setCheckedPermissions(new Set(decodedPermissions));

      onShowSnackbar("Successfully decoded JWT", "success");
    } catch (e) {
      onShowSnackbar("Failed to decode JWT", "error");
      setPayload({});
      setHeader({});
      setPermissionsList([]);
      setCheckedPermissions(new Set());
    }
  };

  const modifyJwt = async (newClaims: Payload) => {
    if (!secretKey) {
      onShowSnackbar(
        "JWT Secret Key is not set in environment variables!",
        "error"
      );
      return;
    }
    try {
      const newJwt = await signJwt(header, newClaims, secretKey);
      setGeneratedJwt(newJwt);
      onShowSnackbar("Successfully created new JWT", "success");
    } catch (e) {
      onShowSnackbar("Failed to create new JWT", "error");
    }
  };

  const handleModifyAndGenerate = () => {
    modifyJwt(payload);
  };

  const handleTogglePermission = (permission: string) => {
    setCheckedPermissions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(permission)) {
        newSet.delete(permission);
      } else {
        newSet.add(permission);
      }
      return newSet;
    });
  };

  useEffect(() => {
    setPayload((prev) => ({
      ...prev,
      permissions: Array.from(checkedPermissions),
    }));
  }, [checkedPermissions]);

  return (
    <Box sx={{ padding: 2 }}>
      <ToolInfo
        title={Tools.JWT_MANIPULATE}
        info={"Allows you to manipulate JWT data and generate new JWTs."}
      />
      <TextField
        label="Enter JWT"
        value={jwt}
        onChange={handleJwtChange}
        fullWidth
        variant="outlined"
        multiline
        sx={{ marginBottom: 2 }}
      />
      <Button variant="contained" onClick={handleDecodeJwtClick}>
        Decode JWT
      </Button>
      {/* We always have permissions */}
      {Object.keys(payload).length > 1 && (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6">Decoded Payload:</Typography>
          <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
            Permissions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <Grid container>
                <Box
                  sx={{
                    overflow: "auto",
                    backgroundColor: "whitesmoke",
                    padding: 2,
                    borderRadius: 1,
                    height: "800px",
                  }}
                >
                  {permissionsList.map((permission) => (
                    <Grid item xs={12} key={permission}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={checkedPermissions.has(permission)}
                            onChange={() => handleTogglePermission(permission)}
                          />
                        }
                        label={permission}
                      />
                    </Grid>
                  ))}
                </Box>
              </Grid>
            </Grid>
            <Grid item xs={12} md={7}>
              <Box
                sx={{
                  overflow: "auto",
                  backgroundColor: "whitesmoke",
                  padding: 2,
                  borderRadius: 1,
                  height: "800px",
                }}
              >
                <ReactJson
                  src={payload}
                  enableClipboard={false}
                  displayDataTypes={false}
                  displayObjectSize={false}
                  onEdit={(edit) => setPayload(edit.updated_src)}
                  onAdd={(add) => setPayload(add.updated_src)}
                  onDelete={(del) => setPayload(del.updated_src)}
                />
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ marginTop: 2 }}>
            <Button
              variant="contained"
              onClick={handleModifyAndGenerate}
              sx={{ marginTop: 2, marginBottom: 2 }}
            >
              Generate New JWT
            </Button>
          </Box>
          {generatedJwt && (
            <TextField
              label="Generated JWT"
              value={generatedJwt}
              fullWidth
              variant="outlined"
              multiline
              sx={{ marginBottom: 2 }}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default ManipulateJwt;

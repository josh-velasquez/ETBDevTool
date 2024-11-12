import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { formatText } from "../../util/Util";
import ToolInfo from "../ToolInfo";
import { Tools } from "../Content";

interface TestFormatterProps {
  onShowSnackbar: (message: string, type: "success" | "error") => void;
}

const TestFormatter: React.FC<TestFormatterProps> = ({ onShowSnackbar }) => {
  const [textToFormat, setTextToFormat] = useState<string>("");
  const [formattedText, setFormattedText] = useState<string>("");
  const handleFormatTextChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTextToFormat(event.target.value);
  };
  const handleFormatTextClick = () => {
    try {
      const formattedText = formatText(textToFormat);
      setFormattedText(formattedText);
      onShowSnackbar("Successfully formatted text", "success");
    } catch (error) {
      onShowSnackbar(`Failed to format text: ${error}`, "error");
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <ToolInfo
        title={Tools.TestFormatter}
        info={"Formats Jest output to be more readable."}
      />
      <TextField
        label="Enter Text"
        value={textToFormat}
        onChange={handleFormatTextChange}
        fullWidth
        variant="outlined"
        multiline
        sx={{ marginBottom: 2, overflow: "auto", maxHeight: "200px" }}
      />
      <Button variant="contained" onClick={handleFormatTextClick}>
        Format Test Output
      </Button>
      {formattedText && (
        <TextField
          label="Formatted Text"
          value={formattedText}
          fullWidth
          variant="outlined"
          multiline
          sx={{ marginTop: 2 }}
        />
      )}
    </Box>
  );
};
export default TestFormatter;

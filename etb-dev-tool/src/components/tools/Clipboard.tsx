import React, { useState, useEffect } from "react";
import { Box, Button, IconButton, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { v4 as uuidv4 } from "uuid";

interface ClipboardProps {
  onShowSnackbar: (message: string, type: "success" | "error") => void;
}

interface ClipboardItem {
  id: string;
  text: string;
}

const Clipboard: React.FC<ClipboardProps> = ({ onShowSnackbar }) => {
  const [items, setItems] = useState<ClipboardItem[]>([]);

  useEffect(() => {
    const storedItems = localStorage.getItem("clipboardItems");
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  const saveToLocalStorage = (newItems: ClipboardItem[]) => {
    localStorage.setItem("clipboardItems", JSON.stringify(newItems));
  };

  const handleAddClipboardItem = () => {
    const newItem: ClipboardItem = { id: uuidv4(), text: "" };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    saveToLocalStorage(updatedItems);
    onShowSnackbar("New item added", "success");
  };

  const handleTextChange = (id: string, text: string) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, text } : item
    );
    setItems(updatedItems);
    saveToLocalStorage(updatedItems);
  };

  const handleDeleteClipboardItem = (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    saveToLocalStorage(updatedItems);
    onShowSnackbar("Item deleted", "success");
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleAddClipboardItem}
        sx={{ marginBottom: 2 }}
      >
        Add Item
      </Button>
      {items.map((item) => (
        <Box
          key={item.id}
          sx={{
            position: "relative",
            marginBottom: 2,
            "&:hover .clear-icon": {
              visibility: "visible",
            },
            maxWidth: 400,
          }}
        >
          <TextField
            label={`Item ${items.indexOf(item) + 1}`}
            value={item.text}
            onChange={(e) => handleTextChange(item.id, e.target.value)}
            fullWidth
            variant="outlined"
            multiline
          />
          <IconButton
            onClick={() => handleDeleteClipboardItem(item.id)}
            className="clear-icon"
            sx={{
              position: "absolute",
              top: -10,
              right: -10,
              color: "white",
              backgroundColor: "grey",
              width: 24,
              height: 24,
              visibility: "hidden",
              "&:hover": {
                backgroundColor: "red",
              },
            }}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
    </>
  );
};

export default Clipboard;

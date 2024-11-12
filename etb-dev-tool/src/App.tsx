import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  createTheme,
  ThemeProvider,
  Divider,
} from "@mui/material";
import Content, { Tools } from "./components/Content";

const theme = createTheme({
  palette: {
    mode: "light",
  },
});

const drawerWidth = 200;

export default function App() {
  const [selectedTool, setSelectedTool] = useState<Tools | null>(
    Tools.Clipboard
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        <AppBar
          position="fixed"
          sx={{
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
          }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              ETB Tools Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar />
          <List>
            {Object.values(Tools).map((tool, index) => (
              <React.Fragment key={tool}>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => setSelectedTool(tool)}>
                    <ListItemText
                      primary={<Typography variant="body2">{tool}</Typography>}
                    />
                  </ListItemButton>
                </ListItem>
                {index < Object.values(Tools).length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Drawer>

        <Content selectedTool={selectedTool} />
      </Box>
    </ThemeProvider>
  );
}

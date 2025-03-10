import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import SelectLanguage from "./SelectLanguage";

const logoStyle = {
  width: "25rem",
  height: "auto",
  cursor: "pointer",
};

function ResponsiveAppBar({ onLanguageSelect }) {
  const handleSelectLanguage = (languageSelect) => {
    onLanguageSelect(languageSelect);
  };

  return (
    <AppBar
      sx={{ backgroundColor: "#38393A", height: "10vh" }}
      position="static"
    >
      <Container maxWidth="false">
        <Toolbar>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              ml: "-18px",
              px: 0,
            }}
          >
            <img src={"\alda_logo.png"} style={{logoStyle, width: '400px', height: 'auto' }} alt="logo of alda" />
            {/* <p>PTIT IEC</p> */}
          </Box>

          <Box>
            <SelectLanguage onLanguageSelect={handleSelectLanguage} />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;

import * as React from "react";
import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { Tooltip } from "@mui/material";

const actions = [
  {
    name: "Obama",
  },
  { name: "BTV", },
  { name: "Alda",  },
  { name: "Lisa",  },
  { name: "Rosé", },
];

export default function SpeedDialTooltipOpen({ onAvatarSelect, onUrlChange }) {
  const [open, setOpen] = React.useState(false);
  const [selectedStream, setSelectedStream] = React.useState("Alda");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChose = (name) => {
    onUrlChange(name);
    setSelectedStream(name);
    onAvatarSelect(name);
    handleClose();
  };

  return (
    <Box
      sx={{
        height: 330,
        transform: "translateZ(0px)",
        flexGrow: 1,
      }}
    >
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        sx={{
          position: "absolute",
          bottom: 15,
          right: -28,
          "& .MuiSpeedDial-fab": {
            // Override button color
            backgroundColor: "#38393A",
            "&:hover": {
              backgroundColor: "#737373", // Change to your desired hover color
            }, // Change to gray color
          },
        }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={
              <img
                src={"Avatar\\" + action.name + ".png"}
                alt={action.name}
                style={{
                  bottom: "0px",
                  width: "100%",
                  borderRadius: "50%",
                  transform:
                    selectedStream === action.name ? "scale(1.2)" : "scale(1)",
                }}
              />
            }
            tooltipTitle={action.name}
            tooltipPlacement="right"
            tooltipOpen
            onClick={() => handleChose(action.name, action.streamFile)}
            sx={{
              transition: "all ease 0.25s",
              ":hover": {
                transform: "scale(1.2)",
              },
            }}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}

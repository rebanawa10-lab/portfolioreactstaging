// file:    src/components/customTooltipWrapper.tsx


import React from "react";
import Tooltip from "@mui/material/Tooltip";

interface TooltipWrapperProps {
  title: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: number;
}

const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
  title,
  children,
  maxWidth = 470, // Default max width
}) => {

  // Ensure title is a valid ReactElement
  const validTitle = title ? (
    <div style={{ paddingLeft: "12px", lineHeight: "1.6", fontSize: "12px" }}>
      {title}
    </div>
  ) : (
    <div>No information available</div> // Fallback content if title is undefined
  );

  // Wrap children in a React element if it's not already one
  const validChildren = React.isValidElement(children) ? children : <>{children}</>;


  return (
    <Tooltip
      arrow     
      title={validTitle}
      slotProps={{
        tooltip: {
          sx: {
            maxWidth: maxWidth,
            backgroundColor: "#a1c1ec", // tooltip background color
            color: "black",
            boxShadow: 5,
            borderRadius: "6px",
            marginLeft: "50px",
            paddingTop: "8px",
            paddingRight: "20px",
            paddingBottom: "8px",
            paddingLeft: "10px",
          },
        },
        popper: {
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [20, 0],
              },
            },
          ],
        },
      }}
    >
       {validChildren}
    </Tooltip>
  );
};

export default TooltipWrapper;
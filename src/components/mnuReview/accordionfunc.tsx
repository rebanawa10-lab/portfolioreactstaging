// file:    src/components/mnunReview/accordionfunc.tsx


import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface AccordionGenProps {
  title: string;
  children: React.ReactNode; // content of the accordion
}

const AccordionGen: React.FC<AccordionGenProps> = ({ title, children }) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  {/* Prefix with _, _event This tells TypeScript “I intentionally don’t use this parameter”: */}
  const handleChange = (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

//   DEBUG Set Center <Box  sx={{margin: "0 auto" }} ></Box>  

  return (
    <Box sx={{ width: "100%", maxWidth: 700, mt: 0.5 }}>
      <Accordion expanded={expanded} onChange={handleChange}
       sx={{
          boxShadow: "none",         // remove shadow
          border: "none",             // remove border
          "&:before": { display: "none" }, // remove MUI pseudo-border
          "&.Mui-expanded": { border: "none" }, // no border when expanded
          mb: 0.5, // small spacing between accordions
          transition: "all 0.3s ease",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel-content"
          id="panel-header"
           sx={{
            backgroundColor: "white",
          
            flexDirection: "row-reverse", // puts expand icon on the left

            minHeight: 40,
            "&:hover": {
              border: "none", // remove border on hover
              backgroundColor: "#f0f0f0", // optional: keep header color same
            },
            "&.Mui-expanded": {
              border: "none", // remove border on expand
              backgroundColor: "#f0f0f0",
            },
            "& .MuiAccordionSummary-content": {
              margin: "4px 0",
              gap: 0,           // remove default gap between content and icon
            },
            "& .MuiAccordionSummary-expandIconWrapper": {
              marginRight: 1,   // gap between content and icon
              transition: "transform 0.3s ease",
            },
            paddingLeft: 1.5,
            paddingRight: 1.5,
          }}
        >
        {/* <Typography variant="subtitle1" className="accordion-title" >{title}</Typography> */}

        <Typography variant="subtitle1" 
            sx={{
              fontFamily: "Arial",
              fontSize: "12px",   // change to whatever size you want
              fontWeight: "normal",
            }}
        >{title}</Typography>


        </AccordionSummary>
        <AccordionDetails 
        sx={{
            paddingLeft: 2,
            paddingRight: 2,
            paddingTop: 1,
            paddingBottom: 1,
            transition: "all 0.3s ease", // smooth details expansion
          }}
        
        >{children}</AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default AccordionGen;



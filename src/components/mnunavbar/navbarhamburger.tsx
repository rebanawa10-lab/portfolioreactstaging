// file:    navbarhamburger.tsx  

import React from "react";
import styled, { __PRIVATE__ } from "styled-components";

interface HamburgerProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const ToggleButton = styled.button`
  position: fixed;      /* Fixed on the screen */
  top: 1rem;            /* Distance from top */
  left: 1rem;           /* Distance from left */
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 1000;

  color: blue;

  transition: transform 0.3s ease;

  

  &:focus {
    outline: none;
  }
`;

// &:hover {
//    transform: scale(1.2);
//   }


// onHover, since enlarge 
const Hamburger: React.FC<HamburgerProps> = ({ isOpen, toggleMenu }) => {
  return (
    <ToggleButton onClick={toggleMenu} aria-label="Toggle menu">
        {isOpen ? "✕" : "☰"} &nbsp;Menu
    </ToggleButton>
  );
};

export default Hamburger;

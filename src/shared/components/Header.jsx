import React from "react";
import "./Header.css";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="header-container">
      <div className="title">
        <img
          className="title-logo"
          src="assets/images/bosch-logo-only.png"
          alt="Bosch_Logo"
        />
        <div className="title-text">Team 7 - Trainify</div>
      </div>
      <nav className="nav-buttons">
        <Link to="/">
          <Button variant="contained" className="button-contained">
            Home
          </Button>
        </Link>
        <Link to="/evaluation">
          <Button variant="contained" className="button-contained">
            Evaluation
          </Button>
        </Link>
      </nav>
    </div>
  );
};

export default Header;

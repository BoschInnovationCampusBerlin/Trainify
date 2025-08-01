import React, { useState } from "react";
import "./Header.css";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useMessages } from "../../hooks/useMessages";

const Header = (props) => {
  const { language, onSetLangage } = props;
  const [useCase, setUseCase] = useState("s4");
  const { clearConversationMessages } = useMessages;

  const handleLanguageChange = (event) => {
    onSetLangage(event.target.value);
    // Add i18n or context-based logic here
  };

  const handleUseCaseChange = (event) => {
    setUseCase(event.target.value);
    // Add logic to switch use case views/data
  };

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
        {/* <Button
          variant="contained"
          className="button-contained"
          onClick={clearConversationMessages}
        >
          Start Again
        </Button> */}

        <FormControl
          size="small"
          variant="standard"
          sx={{ ml: 2, minWidth: 80 }}
        >
          {/* <InputLabel>Lang</InputLabel> */}
          <Select value={language} onChange={handleLanguageChange}>
            <MenuItem value="en-US">English</MenuItem>
            <MenuItem value="de-DE">German</MenuItem>
            <MenuItem value="it-IT">Italian</MenuItem>
            <MenuItem value="zh-CN">Chinese</MenuItem>
            <MenuItem value="ko-KR">Korean</MenuItem>
            <MenuItem value="vi-VN">Vietnamese</MenuItem>
            <MenuItem value="es-ES">Spanish</MenuItem>
            <MenuItem value="th-TH">Thai</MenuItem>
            {/* <MenuItem value="fr-FR">French</MenuItem> */}
          </Select>
        </FormControl>

        <FormControl
          size="small"
          variant="standard"
          sx={{ ml: 2, minWidth: 120 }}
        >
          {/* <InputLabel>Use Case</InputLabel> */}
          <Select value={useCase} onChange={handleUseCaseChange}>
            <MenuItem value="s1">Scenario 1 - Light accident</MenuItem>
            <MenuItem value="s2">
              Scenario 2 - Customer reporting objects on the road
            </MenuItem>
            <MenuItem value="s3">
              Scenario 3 - Customer in a need of Roadside Assistance
            </MenuItem>
            <MenuItem value="s4">Scenario 4 - Accident with injury</MenuItem>
          </Select>
        </FormControl>
      </nav>
    </div>
  );
};

export default Header;

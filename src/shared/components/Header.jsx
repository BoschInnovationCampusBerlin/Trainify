import React, { useState } from "react";
import "./Header.css";
import { Button, FormControl, MenuItem, Select } from "@mui/material";
import { Link } from "react-router-dom";
import { useMessages } from "../../hooks/useMessages";
import { useResetConversation } from "../../hooks/openAiHooks";

const Header = (props) => {
  const { language, onSetLangage } = props;
  const [useCase, setUseCase] = useState("s4");
  const { mutateAsync: resetConversation } = useResetConversation();
  const { clearConversationMessages, getMessages } = useMessages();

  const isMessagesEmpty = !getMessages.data;

  const handleLanguageChange = (event) => {
    onSetLangage(event.target.value);
    // Add i18n or context-based logic here
  };

  const handleUseCaseChange = (event) => {
    setUseCase(event.target.value);
    // Add logic to switch use case views/data
  };

  const removeMessages = () => {
    clearConversationMessages();
  };

  const handleResetConversation = async () => {
    try {
      removeMessages();
      const result = await resetConversation();
      if (result.success) {
        clearConversationMessages();
      } else {
        console.error("Failed to reset conversation:", result);
      }
    } catch (error) {
      console.error("Error resetting conversation:", error);
    }
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
          <Button variant="contained" className="button-contained page-button">
            Home
          </Button>
        </Link>
        <Link to="/evaluation">
          <Button variant="contained" className="button-contained page-button">
            Evaluation
          </Button>
        </Link>
        <Button
          variant="contained"
          className={`button-contained page-button page-button${
            isMessagesEmpty && "-disabled"
          }`}
          onClick={handleResetConversation}
          disabled={isMessagesEmpty}
        >
          Reset
        </Button>

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

import React from 'react';
import './PromptContainer.css'
import {IconButton} from "@mui/material";
// import {ReactComponent as SendIcon} from '../../src/assets/icons/send_white.svg';
import {ReactComponent as RecordIcon} from '../../src/assets/icons/microphone-classic.svg';

const PromptContainer = ({ userInput, setUserInput, handleKeyDown, sendMessage, isLoading }) => {
  return (
    <div className='prompt-container'>
      <input
        className='text-input'
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Message me"
      />
      <IconButton
        className='send-message-button'
        onClick={sendMessage}
      >
        <RecordIcon style={{width: 28, height: 28}} />
      </IconButton>
    </div>
  );
};

export default PromptContainer;
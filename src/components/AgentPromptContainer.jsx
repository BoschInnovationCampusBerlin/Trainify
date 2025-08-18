import React from 'react'
import './AgentPromptContainer.css'

const AgentPromptContainer = ({ userInput, sendMessage }) => {
  return (
    <div className='agent-prompt-container'>
      <input
        className='text-input'
        value={userInput}
        placeholder="Message me"
      />
    </div>
  );
};

export default AgentPromptContainer
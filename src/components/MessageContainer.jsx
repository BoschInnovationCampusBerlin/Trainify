import React, {useEffect, useRef} from 'react';
import Message from './Message';
import './MessageContainer.css';

const MessageContainer = (props) => {
  const { messages, isLoading } = props;
  const containerRef = useRef(null);
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
      <div className="message-container" style={{position: "relative"}} ref={containerRef}>
        {messages && messages.map((msg, idx) => (
            <div className="message-content" key={idx}>
              <Message key={idx} role={msg.role} content={msg.content}/>
            </div>
        ))}
        <div ref={endOfMessagesRef}></div>
        {isLoading && messages.length > 0 && <div className="loader">Bot is answering</div>}
      </div>
  );
};

export default MessageContainer;
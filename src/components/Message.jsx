import React, { useState } from 'react';
import './Message.css';
import { IconButton, Tooltip } from "@mui/material";
import { ReactComponent as Speaker } from '../../src/assets/icons/speaker.svg';
import { ReactComponent as Loading } from '../../src/assets/icons/loading.svg';
import { ReactComponent as Stop } from '../../src/assets/icons/stop-frame.svg';
import { useReadAloudText } from "../hooks/openAiHooks";

const Message = ({ role, content }) => {
  const [audioState, setAudioState] = useState('idle'); // 'idle', 'playing'
  const [audio, setAudio] = useState(null);

  const { mutateAsync: readAloudTextAsync, isPending, data } = useReadAloudText();

  const handleReadAloudText = async (text) => {
    const plainText = text.replace(/<\/?[^>]+(>|$)/g, "");
    try {
      const response = await readAloudTextAsync(plainText);
      if (response) {
        const audioUrl = window.URL.createObjectURL(response);
        const newAudio = new Audio(audioUrl);

        // Set audio event listeners
        newAudio.onended = () => setAudioState('idle');
        newAudio.onpause = () => setAudioState('idle');
        setAudio(newAudio);

        setAudioState('playing');
        await newAudio.play();
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      setAudioState('idle');
    }
  };

  const handleStopAudio = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setAudioState('idle');
    }
  };

  // Conditional icon based on loading or playing state
  const renderIcon = () => {
    if (!isPending) {
      if (audioState === 'playing') {
        return <Stop style={{ width: 24, height: 24 }} />;
      } else {
        return <Speaker style={{ width: 24, height: 24 }} />;
      }
    } else {
      return <Loading style={{ width: 24, height: 24 }} />;
    }
  };

  return (
    <div className={`role ${role}`}>
      {role === 'assistant' ? (
        <>
          <div dangerouslySetInnerHTML={{ __html: content }} />
          {content && (
              <>
                {!isPending && (
                  <Tooltip title={audioState === 'playing' ? "Stop" : "Read aloud"} arrow placement="bottom">
                    <IconButton
                      onClick={() => {
                        audioState === 'playing' ? handleStopAudio() : handleReadAloudText(content);
                      }}
                      className={isPending ? "read-aloud-loading" : "read-aloud-button"}
                    >
                      {renderIcon()}
                    </IconButton>
                  </Tooltip>
                )}
                {isPending && (
                  <IconButton
                    onClick={() => {
                      audioState === 'playing' ? handleStopAudio() : handleReadAloudText(content);
                    }}
                    className={isPending ? "read-aloud-loading" : "read-aloud-button"}
                  >
                    {renderIcon()}
                  </IconButton>
                )}
              </>
          )}
        </>
      ) : (
        content
      )}
    </div>
  );
};

export default Message;
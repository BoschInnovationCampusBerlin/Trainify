import React, { useCallback, useEffect, useRef, useState } from "react";
import { formatAssistantMessage } from "../utils/format-messages";
import { useSendRecording } from "../hooks/openAiHooks";
import MessageContainer from "./MessageContainer";
import { IconButton } from "@mui/material";
import { ReactComponent as RecordIcon } from "../../src/assets/icons/microphone-classic.svg";
import { ReactComponent as StopRecordIcon } from "../../src/assets/icons/stop-frame-white.svg";
import { useMessages } from "../hooks/useMessages";
import "./AppMessageContainer.css";

const AppMessageContainer = (props) => {
  const { selectedLanguage } = props;
  const [messages, setMessages] = useState([]);

  const { addConversationMessage, messages: conversaionMessages } =
    useMessages();
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [nextPromptText, setNextPromptText] = useState("");

  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const transcriptRef = useRef("");

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  const { mutateAsync: sendRecordingAsync, isPending: isSendRecordingPending } =
    useSendRecording();

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const currentTranscript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setTranscript(currentTranscript);
    };

    recognition.onend = () => {
      if (isListening) recognition.start();
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
    // eslint-disable-next-line
  }, []);

  const startListening = useCallback(async () => {
    if (isListening) return;

    setIsListening(true);
    setTranscript("");

    if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLanguage;
      recognitionRef.current.start();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new window.MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const currentTranscript = transcriptRef.current;
        sendMessage(audioBlob, currentTranscript, selectedLanguage);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
    }
  }, [isListening, selectedLanguage]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    recognitionRef.current?.stop();
    mediaRecorderRef.current?.stop();
  }, []);

  const sendMessage = async (audioBlob, transcriptText, lang) => {
    if (!transcriptText.trim()) return;

    try {
      setMessages((prev) => [
        ...prev,
        { role: "agent", content: formatTranscript(transcriptText) },
      ]);

      addConversationMessage({
        role: "agent",
        content: formatTranscript(transcriptText),
      });

      const reqBody = {
        audioBlob,
        lang,
      };

      const response = await sendRecordingAsync(reqBody);

      if (response.data) {
        const data = response.data;
        const base64String = data.audioData.split(",")[1] || data.audioData;
        const byteCharacters = atob(base64String);
        const byteArray = new Uint8Array(
          Array.from(byteCharacters, (c) => c.charCodeAt(0))
        );
        const responseAudioBlob = new Blob([byteArray], { type: "audio/mpeg" });
        const url = URL.createObjectURL(responseAudioBlob);
        const audio = new Audio(url);
        audio.play().catch((err) => {
          console.warn("Audio playback failed:", err.message);
        });

        const assistantMessage = formatAssistantMessage(data.audioText);
        setMessages((prev) => [
          ...prev,
          { role: "victim", content: assistantMessage },
        ]);
        addConversationMessage({ role: "victim", content: assistantMessage });

        setNextPromptText(data.promptText);
      }
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const formatTranscript = (text) =>
    typeof text === "string" && text.length > 0
      ? text[0].toUpperCase() + text.slice(1)
      : "";
  return (
    <div className="app-message-container">
      {/* <p>{transcript}</p> */}
      <div className="app-message">
        {conversaionMessages.length === 0 && (
          <div className="new-chat-intro-message">
            <h1>What can I help with?</h1>
          </div>
        )}
        <MessageContainer
          messages={conversaionMessages}
          isLoading={isSendRecordingPending}
        />
      </div>

      <div className="audio-record-container">
        {/* <AgentPromptContainer userInput={nextPromptText} sendMessage={sendMessage}  /> */}
        <IconButton
          className="record-send-message-button"
          onClick={isListening ? stopListening : startListening}
        >
          {!isListening ? (
            <RecordIcon style={{ width: 30, height: 30 }} />
          ) : (
            <StopRecordIcon style={{ width: 30, height: 30 }} />
          )}
        </IconButton>
      </div>
    </div>
  );
};

export default AppMessageContainer;

import React, { useEffect, useRef, useState, useCallback } from "react";
import "./App.css";
import MessageContainer from "./components/MessageContainer";
import Header from "./shared/components/Header";
import { useSendRecording } from "./hooks/openAiHooks";
import { formatAssistantMessage } from "./utils/format-messages";
import { IconButton } from "@mui/material";
import { ReactComponent as RecordIcon } from "../src/assets/icons/microphone-classic.svg";
import { ReactComponent as StopRecordIcon } from "../src/assets/icons/stop-frame-white.svg";

const App = () => {
  // Grouped related state
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);

  // Refs for non-UI state
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);

  const { mutateAsync: sendRecordingAsync, isPending: isSendRecordingPending } =
    useSendRecording();

  // Initialize SpeechRecognition
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
    // Only run on mount/unmount
    // eslint-disable-next-line
  }, []);

  // Start listening & recording
  const startListening = useCallback(async () => {
    if (isListening) return; // Prevent double start

    setIsListening(true);
    setTranscript(""); // Reset transcript

    // Start speech recognition
    recognitionRef.current?.start();

    // Start audio recording
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new window.MediaRecorder(stream, { mimeType: "audio/webm" });
    audioChunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      sendMessage(audioBlob);
      stream.getTracks().forEach((track) => track.stop());
    };

    mediaRecorderRef.current = recorder;
    recorder.start();
  }, [isListening]);

  // Stop listening & recording
  const stopListening = useCallback(() => {
    setIsListening(false);
    recognitionRef.current?.stop();
    mediaRecorderRef.current?.stop();
  }, []);

  // Send message to backend
  const sendMessage = useCallback(
    async (audioBlob) => {
      if (!transcript.trim()) return;

      try {
        setMessages((prev) => [
          ...prev,
          { role: "user", content: formatTranscript(transcript) },
        ]);

        const response = await sendRecordingAsync(audioBlob);

        if (response) {
          const audioBlob = new Blob([response.data], { type: "audio/webm" });
          const audioUrl = URL.createObjectURL(audioBlob);
          console.log(audioUrl)

          if (audioRef.current) {
            console.log(audioUrl.current)
            audioRef.current.src = audioUrl;
            audioRef.current.play();
          }

          // Add assistant message
          const assistantMessage = formatAssistantMessage(
            response.data.assistant_message
          );
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: assistantMessage },
          ]);
        }
      } catch (error) {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
      }
    },
    [sendRecordingAsync, transcript]
  );

  // Format transcript helper
  const formatTranscript = (text) =>
    typeof text === "string" && text.length > 0
      ? text[0].toUpperCase() + text.slice(1)
      : "";

  return (
    <div className="app">
      <Header />
      <div className="app-container">
        <div className="app-message-container">
          <div className="app-message">
            {!conversationId && messages.length === 0 && (
              <div className="new-chat-intro-message">
                <h1>What can I help with?</h1>
              </div>
            )}
            <MessageContainer
              messages={messages}
              isLoading={isSendRecordingPending}
            />
          </div>
          <div className="audio-record-container">
            <IconButton
              className="send-message-button"
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
      </div>
    </div>
  );
};

export default App;

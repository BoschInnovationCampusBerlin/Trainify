import React, { useEffect, useState } from "react";
import "./Message.css";
import { IconButton, Tooltip } from "@mui/material";
import { useReadAloudText } from "../hooks/openAiHooks";
import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

const Message = ({ role, content }) => {
  const [audioState, setAudioState] = useState("idle");
  const [audio, setAudio] = useState(null);
  const actionButtonSize = { width: 24, height: 24 };
  const [copyState, setCopyState] = useState("idle");

  const {
    mutateAsync: readAloudTextAsync,
    isPending,
    data,
  } = useReadAloudText();

  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true,
    highlight: true,
    langPrefix: true,
  });

  useEffect(() => {
    if (copyState === "copied") {
      const timer = setTimeout(() => setCopyState("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [copyState]);

  const handleReadAloudText = async (text) => {
    const plainText = text;
    try {
      const response = await readAloudTextAsync(plainText);
      if (response) {
        const audioUrl = window.URL.createObjectURL(response);
        const newAudio = new Audio(audioUrl);

        // Set audio event listeners
        newAudio.onended = () => setAudioState("idle");
        newAudio.onpause = () => setAudioState("idle");
        setAudio(newAudio);

        setAudioState("playing");
        await newAudio.play();
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      setAudioState("idle");
    }
  };

  const renderMarkdown = (text) => {
    const html = md.render(text);
    const sanitizedHtml = DOMPurify.sanitize(html);
    return parse(sanitizedHtml);
  };

  const handleCopyText = async (text) => {
    const plainText = text.replace(/[*_#`\[!\]]/g, "");
    try {
      await navigator.clipboard.writeText(plainText);
      setCopyState("copied");
    } catch (error) {
      console.error("Error copying text:", error);
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = plainText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopyState("copied");
    }
  };

  return (
    <div className={`role ${role}`}>
      {role === "victim" ? (
        <>
          <div>{renderMarkdown(content)}</div>
        </>
      ) : (
        <div className="user-content-container">
          <div className="user-content">{renderMarkdown(content)}</div>
        </div>
      )}
    </div>
  );
};

export default Message;
import React, { useEffect, useRef, useState } from "react";
import MicIcon from "@mui/icons-material/Mic";

const SpeechRecognitionComponent = ({
  recognitionLang,
  onRecognitionResult,
}) => {
  console.log(recognitionLang);
  const [isRecording, setIsRecording] = useState(false);
  const recognition = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechGrammarList =
      window.SpeechGrammarList || window.webkitSpeechGrammarList;
    const grammar = "#JSGF V1.0;";
    const speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);

    recognition.current = new SpeechRecognition();
    recognition.current.grammars = speechRecognitionList;
    recognition.current.continuous = false;
    recognition.current.lang = recognitionLang;
    recognition.current.interimResults = false;

    recognition.current.onresult = function (event) {
      console.log("Recording result");
      const lastResult = event.results.length - 1;
      const content = event.results[lastResult][0].transcript;
      onRecognitionResult(content);
      console.log(content);
    };

    recognition.current.onspeechend = function () {
      console.log("Recording ended");
      recognition.current.stop();
      setIsRecording(false);
    };

    recognition.current.onerror = function (event) {
      console.error("Speech recognition error", event.results);
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
    };

    return () => {
      recognition.current.stop();
      console.log("Cleaned up recognition");
    };
  }, [recognitionLang, onRecognitionResult]);

  const handleRecording = () => {
    if (isRecording) {
      recognition.current.stop();
      setIsRecording(false);
    } else {
      console.log("Start recording");
      recognition.current.start();
      setIsRecording(true);
    }
  };

  return (
    <button
      type="button"
      className={`btn btn-primary record-button ${
        isRecording ? "recording" : ""
      }`}
      aria-label="mic"
      size="large"
      onClick={handleRecording}
      style={{
        borderRadius: "50%",
        width: "55px",
        height: "55px",
        zIndex: 2,
        backgroundColor: `${isRecording ? "#737373" : "#38393A"}`,
        border: "none",
      }}
    >
      <MicIcon fontSize="inherit" style={{ fontSize: "25px" }} />
    </button>
  );
};

export default SpeechRecognitionComponent;

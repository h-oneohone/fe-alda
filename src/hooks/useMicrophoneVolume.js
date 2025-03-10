import { useState, useEffect, useRef } from "react";

const useMicrophoneVolume = () => {
  const [volume, setVolume] = useState(0);
  const audioContextRef = useRef(null);

  useEffect(() => {
    const setupAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        source.connect(analyser);

        const getVolume = () => {
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const average = sum / bufferLength;
          setVolume(average);
          requestAnimationFrame(getVolume);
        };

        getVolume();
        audioContextRef.current = audioContext;
      } catch (error) {
        console.error("Error accessing the microphone", error);
      }
    };

    setupAudio();

    return () => {
      audioContextRef.current && audioContextRef.current.close();
    };
  }, []);

  return volume;
};

export default useMicrophoneVolume;

import React, { useEffect, useRef, useState } from 'react';
import SpeedDialTooltipOpen from './SpeedDialAlda';
import SpeechRecognitionComponent from './SpeechRecognation';
import mpegts from 'mpegts.js';
import SrsRtcWhipWhepAsync from '../AldaService/srs.sdk';
import establishWebSocketConnection, {
  getAldaTextResponse,
} from '../AldaService/interactWithAlda';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';

import './Video.css';
import GradiantCircleProgress from './gradiantCircleProgress';

const Video = ({
  languageSelect,
  chatDataSend,
  onAudioData,
  onAudioDataResponse,
  onAvatarSelect,
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const mediaRecorderRef = useRef(null);
  const wsRef = useRef(null);
  const [volume, setVolume] = useState(100);
  const [loading, setLoading] = useState(true);
  const [streamUrl, setStreamUrl] = useState('Obama');

  const handleRecognationResult = (recognationText) => {
    onAudioData(recognationText);
    interactWithAlda(recognationText, 0);
  };

  useEffect(() => {
    if (chatDataSend) {
      interactWithAlda(chatDataSend, 0);
      // Gửi dữ liệu đến backend hoặc xử lý thêm tại đây nếu cần
      console.log('New chat data received in Video:', chatDataSend);
    }
  }, [chatDataSend]);

  useEffect(() => {
    const handleSuccess = (stream) => {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const center_x = canvas.width / 2;
      const center_y = canvas.height / 2;
      const minRadius = 220;
      const maxRadius = 500;

      const draw = () => {
        animationFrameId.current = requestAnimationFrame(draw);
        let dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);

        let sum = dataArray.reduce((a, b) => a + b, 0);
        let average = sum / dataArray.length;
        let normalizedRadius =
          (average / 128) * (maxRadius - minRadius) + minRadius;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(center_x, center_y, normalizedRadius, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgb(150, 59, 47)';
        ctx.fill();
      };
      draw();
    };

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(handleSuccess)
      .catch((err) => console.error('Error accessing media devices.', err));

    handleConnection();

    return () => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== 'inactive'
      ) {
        mediaRecorderRef.current.stop();
      }
      cancelAnimationFrame(animationFrameId.current);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleLoadingChange = (isLoading) => {
    setLoading(isLoading);
  };

  const loadVideoFlv = (flvPlayer) => {
    flvPlayer.attachMediaElement(videoRef.current);
    flvPlayer.load();
  };

  // const handleConnection = () => {
  //   setLoading(true);
  //   const host = window.location.hostname;
  //   wsRef.current = new WebSocket(`ws://10.170.100.152:8000/humanecho`);
  //   wsRef.current.onopen = function () {
  //     const flvPlayer = mpegts.createPlayer({
  //       type: "flv",
  //       url: `http://10.170.100.152:8080/live/livestream.flv`,
  //       isLive: true,
  //       enableStashBuffer: false,
  //     });
  //     console.log("WebSocket Connected");

  //     flvPlayer.on("error", (err) => {
  //       console.error("FLV Player Error:", err);
  //       flvPlayer.unload();
  //       setLoading(true); // Cập nhật trạng thái loading khi gặp lỗi
  //       setTimeout(() => {loadVideoFlv(flvPlayer);
  //       }, 20000)

  //       setTimeout(() => {
  //         setLoading(false);
  //       }, 20000);
  //       // setTimeout(setLoading(false), 20000)
  //     });

  //       console.log("FLV Player Ready");
  //       // Ẩn chỉ báo tải khi video sẵn sàng hoặc gặp lỗi
  //       loadVideoFlv(flvPlayer);
  //       setLoading(false)

  //     flvPlayer.on("destroy", () => {
  //       console.log("FLV Player Destroyed");
  //       // Do something when player is destroyed (optional)
  //       setLoading(true);
  //     });
  //   };

  // };

  const handleConnection = () => {
    setLoading(true);

    // Create an instance of SrsRtcWhipWhepAsync
    const sdk = new SrsRtcWhipWhepAsync();
    // wsRef.current = new WebSocket(`ws://10.170.100.152:8000/human`);
    // Define your stream URL
    const streamUrl =
      'http://10.170.100.152:1985/rtc/v1/whep/?app=live&stream=livestream';

    // Start playing the WebRTC stream using the sdk
    sdk
      .play(streamUrl)
      .then((session) => {
        console.log('WebRTC Stream Ready');

        // Attach the stream to the video element
        if (videoRef.current) {
          videoRef.current.srcObject = sdk.stream; // Assign the WebRTC media stream to the video element
        }

        setLoading(false); // Set loading to false when video is ready
      })
      .catch((reason) => {
        console.error('Error playing WebRTC stream:', reason);
        setLoading(true); // Show loading state on error

        setTimeout(() => {
          handleConnection(); // Retry the connection after a delay
        }, 5000); // Retry after 5 seconds
      });

    // Clean up the connection when the component unmounts or reloads
    return () => {
      sdk.close(); // Close the WebRTC connection
    };
  };

  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
  };
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100; // Convert the volume to a scale of 0 to 1
    }
  }, [volume]);

  const handleUrlChange = (newUrl) => {
    console.log(newUrl);
    if (streamUrl !== newUrl) {
      setLoading(true);
      setStreamUrl(newUrl);
      setTimeout(() => {
        setLoading(false);
      }, 20000);
    }
  };

  const interactWithAlda = async (text, sessionid) => {
    let response = await getAldaTextResponse(languageSelect, text);
    console.log('ALda response: ' + response);
    onAudioDataResponse(response);
  
    try {
      // Sending the POST request to the API with the message and sessionid
      await fetch('http://localhost:8010/human', {
        body: JSON.stringify({
          text: response,
          type: 'echo',
          sessionid: sessionid,  // Add sessionid to the body
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
    // wsRef.current.send(response);
    // wsRef.current.send(response.replace("PTIT", "pi ti ai ti").replace("Alda", "an đa").replace("AI", "ây ai").replace("IEC", "ai y-si").replace("D24", "đê hai tư"));
  };

  return (
    <div className='video-box container-fluid d-flex' style={{ width: '100%' }}>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: '0.2rem',
        }}
      >
        <Stack
          spacing={1}
          direction='column'
          sx={{ mb: 0.2 }}
          alignItems='center'
        >
          <VolumeUp />
          <Slider
            size='small'
            defaultValue={100}
            orientation='vertical'
            value={volume}
            onChange={handleVolumeChange}
            style={{
              height: '110px', // Set a fixed height for the slider
              width: '10%',
              borderRadius: '5px',
              color: '#38393A',
            }}
            sx={{
              '& .MuiSlider-thumb': {
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: 'none', // Remove box shadow on hover and focus
                },
              },
            }}
          />
          <VolumeDown />
        </Stack>
        <SpeedDialTooltipOpen
          onAvatarSelect={onAvatarSelect}
          onUrlChange={handleUrlChange}
        />
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '90px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: '0.5rem',
          }}
        >
          <canvas
            ref={canvasRef}
            className='visualizer'
            style={{
              position: 'absolute',
              width: '100px',
              height: '100px',
              zIndex: 1,
            }}
          />
          <SpeechRecognitionComponent
            recognitionLang={languageSelect}
            onRecognitionResult={handleRecognationResult}
          />
        </div>
      </div>

      <div
        style={{
          flex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end', // Align content to the bottom
          gap: '3rem',
          position: 'relative', // Add position relative to use absolute positioning for loading indicator
        }}
      >
        {loading && (
          <div
            style={{
              position: 'absolute',
              top: '70%',
              left: '58%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <GradiantCircleProgress />
          </div>
        )}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            display: loading ? 'none' : 'block',
            width: '580px',
            marginLeft: '8.5rem',
          }}
        />
      </div>
    </div>
  );
};

export default Video;

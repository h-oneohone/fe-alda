import 'bootstrap/dist/css/bootstrap.min.css';
import MenuIcon from '@mui/icons-material/Menu';
import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Chat from './components/Chat';
import Video from './components/Video';
import ResponsiveAppBar from './components/ReponseiveAppBar';

function App() {
  const [chatDataSend, setChatDataSend] = useState(null);
  const [audioDataResponse, setAudioDataResponse] = useState(null);
  const [audioData, setAudioData] = useState(null);
  const [languageSelect, setLanguageSelect] = useState('en-US');
  const [avatarSelect, setAvatarSelect] = useState('Alda');

  const handleAudioData = (data) => {
    setAudioData(data);
    console.log('Audio Data updated and ready for use:', audioData);
  };

  const handleAvatarSelect = (data) => {
    setAvatarSelect(data);
    console.log('Avatar select updated and ready for use:', avatarSelect);
  };

  const handleAudioDataResponse = (data) => {
    setAudioDataResponse(data);
    console.log('Audio Data Response updated and ready for use:', data);
  };

  const handleChatDataSend = (data) => {
    setChatDataSend(data);
    console.log('Chat Data Send updated and ready for use:', data);
  };

  const handleLanguageSelect = (data) => {
    setLanguageSelect(data);
  };

  useEffect(
    (data) => {
      if (data) {
        setAudioData(data);

        // Gửi audioData đến một API hoặc xử lý nó theo cách nào đó
      }
    },
    [handleAudioData]
  ); // useEffect này chạy mỗi khi audioData thay đổi

  useEffect(
    (data) => {
      if (data) {
        setAudioDataResponse(data);
        // Xử lý chatDataResponse tại đây
      }
    },
    [handleAudioDataResponse]
  );

  useEffect(
    (data) => {
      if (data) {
        setChatDataSend(data);
        // Xử lý chatDataResponse tại đây
      }
    },
    [handleChatDataSend]
  );

  useEffect(
    (data) => {
      if (data) {
        setLanguageSelect(data);
      }
    },
    [handleLanguageSelect]
  );

  return (
    <div className='app-container'>
      <ResponsiveAppBar onLanguageSelect={handleLanguageSelect} />
      <div className='main-app-container px-4 pt-3 row justify-content-between'>
        <div className='col-7 video-container'>
          <Video
            languageSelect={languageSelect}
            chatDataSend={chatDataSend}
            onAudioDataResponse={handleAudioDataResponse}
            onAudioData={handleAudioData}
            onAvatarSelect={handleAvatarSelect}
          />
        </div>
        <div className=' col-5 chat-container'>
          <Chat
            audioData={audioData}
            audioDataResponse={audioDataResponse}
            onChatDataSend={handleChatDataSend}
            avatarSelect={avatarSelect}
            languageSelect={languageSelect}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

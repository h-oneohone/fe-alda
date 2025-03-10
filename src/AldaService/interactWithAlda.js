import axios from 'axios';
import languageCodes from './languageCodea';

let currentSession = Math.floor(Math.random() * 1000000000);
let currentLang = null;

const establishWebSocketConnection = (url) => {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    ws.onopen = () => {
      console.log('WebSocket Connected');
      resolve(ws);
    };
    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      reject(error);
    };
  });
};

export default establishWebSocketConnection;

export async function getAldaTextResponse(langue, messageContent) {
  if (currentLang === null || currentLang != langue) {
    currentLang = langue;
    currentSession = Math.floor(Math.random() * 1000000000);
    console.log('Change language & session');
  }
  try {
    const response = await axios.post(
      `http://10.170.100.152:8010/chat_with_llm`,
      {
        user_id: 0,
        sessionid: currentSession,
        language: languageCodes[currentLang].language,
        user_query: messageContent,
      }
    );
    console.log('response', response.data.response);
    return response.data.response; // Axios automatically handles JSON parsing
  } catch (error) {
    console.error('Faild to get Alda text reponse: ', error);
    // Handle errors, such as by returning an empty array or a specific error message
    // return "Xin chào các tân sinh viên D24, tôi là Alda - Digital Human đến từ Trung tâm đổi mới sáng tạo và khởi nghiệp IEC thuộc PTIT. Tôi có thể trả lời câu hỏi về đa dạng các lĩnh vực, các bạn có thể tới Tech Hub để giao lưu trực tiếp với tôi. Chúc các bạn một ngày tốt lành!";
    return 'Hello, I am Alda - Digital Human from the Innovation and Startup Center IEC of PTIT. I am very pleased to welcome you and hope to have the opportunity to discuss various fields. You can visit the Tech Hub to engage with me directly. Wishing you a wonderful day!';
  }
}

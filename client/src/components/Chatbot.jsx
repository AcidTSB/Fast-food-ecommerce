import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = ({ isDark: isDarkProp }) => {
  const [messages, setMessages] = useState([
    {
      text: 'Xin chào! Tôi là chatbot của FastFood. Tôi có thể giúp bạn trả lời các câu hỏi phổ biến. Hãy thử gõ một câu hỏi hoặc chọn từ gợi ý bên dưới! 😊',
      isUser: false,
      id: 1
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [open, setOpen] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    if (typeof isDarkProp === 'boolean') {
      setIsDark(isDarkProp);
    } else {
      setIsDark(document.body.classList.contains('dark'));
      const observer = new MutationObserver(() => {
        setIsDark(document.body.classList.contains('dark'));
      });
      observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      return () => observer.disconnect();
    }
  }, [isDarkProp]);

  const faqData = {
    'xin chào': 'Chào bạn! Tôi là trợ lý ảo của FastFood – nhà hàng phục vụ nhanh chất lượng từ năm 2010. Bạn cần hỗ trợ gì?',
    'hello': 'Hello! FastFood luôn sẵn sàng phục vụ bạn!',
    'hi': 'Hi! Rất vui khi được gặp bạn!',
    'chào': 'Chào mừng đến với FastFood! 🛎️',

    'bạn là ai': 'Tôi là trợ lý ảo của FastFood – được thiết kế để hỗ trợ khách hàng và giải đáp các câu hỏi phổ biến.',
    'bạn làm gì': 'Tôi hỗ trợ thông tin về thực đơn, dịch vụ, thời gian giao hàng và mọi thứ về FastFood.',
    'tên bạn': 'Tôi là FastBot – trợ lý của FastFood.',

    'giờ làm việc': 'Chúng tôi mở cửa từ 8:00 đến 22:00 mỗi ngày, kể cả cuối tuần và ngày lễ.',
    'thời gian làm việc': 'FastFood hoạt động 8:00 – 22:00, phục vụ xuyên suốt cả tuần.',
    'dịch vụ': 'Chúng tôi cung cấp dịch vụ ăn tại chỗ, mang đi, đặt hàng trực tuyến và giao hàng tận nơi trong 30 phút!',
    'sản phẩm': 'Chúng tôi có burger, pizza, món ăn kèm, nước uống và nhiều món ngon khác. Hãy ghé menu để khám phá thêm!',

    'liên hệ': 'Bạn có thể liên hệ với FastFood qua:\n📧 contact@fastfood.com\n📞 1900-XXXX\n🏪 Hệ thống 50+ cửa hàng trên toàn quốc',
    'số điện thoại': 'Hotline: 1900-XXXX (8:00 - 22:00)',
    'email': 'Email liên hệ: contact@fastfoodexpress.vn',
    'địa chỉ': 'Chúng tôi có mặt tại hơn 50 địa điểm khắp cả nước. Tìm cửa hàng gần bạn tại trang "Liên Hệ".',

    'giúp đỡ': 'Tôi có thể giúp bạn đặt hàng, tra cứu thông tin cửa hàng hoặc tư vấn món ăn. Bạn cần gì?',
    'help': 'Cứ hỏi tôi bất cứ điều gì về FastFood nhé!',
    'hỗ trợ': 'Đừng ngại hỏi! Tôi luôn sẵn sàng hỗ trợ bạn.',

    'cảm ơn': 'Cảm ơn bạn đã ghé thăm FastFood! Nếu cần thêm gì, tôi luôn ở đây.',
    'thank you': 'You\'re welcome! Chúc bạn có trải nghiệm tuyệt vời tại FastFood! 😊',
    'thanks': 'Luôn sẵn sàng hỗ trợ bạn!',

    'tạm biệt': 'Hẹn gặp lại tại FastFood! 👋',
    'bye': 'Bye bye! Chúc bạn ngon miệng!',
    'chào tạm biệt': 'Cảm ơn bạn đã ghé thăm! Chào tạm biệt! 😊',

    'giá': 'Giá cả của chúng tôi được cập nhật tại menu. Bạn có thể đặt hàng trực tuyến để xem giá cụ thể.',
    'bảng giá': 'Bạn có thể xem chi tiết giá sản phẩm tại trang sản phẩm.',
    'chi phí': 'Chi phí tùy vào món ăn bạn chọn. Bạn có muốn tôi gợi ý món phù hợp không?',

    'khuyến mãi': 'Hiện tại có chương trình khuyến mãi hấp dẫn trên các combo burger và pizza! Xem chi tiết trên trang chủ! 🎉',
    'ưu đãi': 'Ưu đãi đặc biệt mỗi tuần dành riêng cho khách hàng online! 🍔',

    'default': 'Tôi chưa hiểu rõ câu hỏi của bạn 😅. Hãy thử hỏi về giờ làm việc, món ăn, hoặc cách liên hệ với cửa hàng nhé!'
  };

  const suggestions = [
    'Giờ làm việc',
    'Dịch vụ',
    'Liên hệ',
    'Khuyến mãi'
  ];

  const findAnswer = (question) => {
    const normalizedQuestion = question.toLowerCase().trim();
    if (faqData[normalizedQuestion]) return faqData[normalizedQuestion];
    for (let key in faqData) {
      if (normalizedQuestion.includes(key) || key.includes(normalizedQuestion)) return faqData[key];
    }
    return faqData['default'];
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (open && !minimized) inputRef.current?.focus();
  }, [open, minimized]);

  const addMessage = (text, isUser = false) => {
    setMessages(prev => [...prev, { text, isUser, id: Date.now() }]);
  };

  const handleSendMessage = () => {
    const userMessage = inputValue.trim();
    if (userMessage === '') return;
    addMessage(userMessage, true);
    setInputValue('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const botResponse = findAnswer(userMessage);
      addMessage(botResponse);
    }, 800 + Math.random() * 1200);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setTimeout(() => {
      addMessage(suggestion, true);
      setInputValue('');
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const botResponse = findAnswer(suggestion);
        addMessage(botResponse);
      }, 800 + Math.random() * 1200);
    }, 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  const SendIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22,2 15,22 11,13 2,9"></polygon>
    </svg>
  );

  const TypingIndicator = () => (
    <div className="message bot-message">
      <div className="typing-indicator">
        <div className="typing-dots">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
        </div>
      </div>
    </div>
  );

  if (!open) {
    return (
      <button className="chatbot-fab" aria-label="Mở chatbot" onClick={() => setOpen(true)} style={{ right: 24, bottom: 24, position: 'fixed', zIndex: 1001 }}>
        💬
      </button>
    );
  }

  return (
    <div className={`chatbot-float-container${isDark ? ' chatbot-dark' : ''}${minimized ? ' chatbot-minimized' : ''}`} style={{ right: 24, bottom: 24, position: 'fixed', zIndex: 1001 }}>
      <div className="chatbot-container">
        <div className="chatbot-header">
          <h1>🤖 FastBot - Hỗ Trợ</h1>
          <p>Hỏi tôi bất cứ điều gì về FastFood!</p>
          <button className="chatbot-close-btn" onClick={() => setOpen(false)} title="Đóng">×</button>
          <button className="chatbot-min-btn" onClick={() => setMinimized(m => !m)} title={minimized ? "Mở rộng" : "Thu nhỏ"}>
            {minimized ? '▢' : '–'}
          </button>
        </div>
        {!minimized && (
          <>
            <div className="suggestions">
              <h3>Câu hỏi gợi ý:</h3>
              <div className="suggestion-buttons">
                {suggestions.map((suggestion, index) => (
                  <button key={index} className="suggestion-btn" onClick={() => handleSuggestionClick(suggestion)}>
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
            <div className="chat-messages">
              {messages.map((message) => (
                <div key={message.id} className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}>
                  <div className="message-bubble">{message.text}</div>
                </div>
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
            <div className="input-container">
              <div className="input-wrapper">
                <input
                  ref={inputRef}
                  type="text"
                  className="chat-input"
                  placeholder="Nhập câu hỏi của bạn..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button className="send-btn" onClick={handleSendMessage}>
                  <SendIcon />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chatbot;

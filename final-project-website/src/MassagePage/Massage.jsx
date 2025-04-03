import { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #eef2f3, #d1d8e0);
  font-family: "Poppins", sans-serif;
  padding: 0;
  overflow: hidden
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #0056b3;
  color: #fff;
  padding: 18px 25px;
  width: 100%;
  font-size: 1.6rem;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border-radius: 0 0 15px 15px;
  position: fixed;
  top: 0;
  z-index: 1000;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  padding: 10px 14px;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;
  font-weight: 500;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const MessagesContainer = styled.div`
  width: 90%;
  max-width: 650px;
  height: calc(100vh - 150px); /* Adjusts based on header & input form */
  overflow-y: auto;
  background: #ffffff;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 80px;
  scroll-behavior: smooth;
  
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #007bff;
    border-radius: 3px;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #777;
  font-style: italic;
  font-size: 1rem;
`;

const Message = styled.div`
  background: ${(props) => (props.sent ? "#007bff" : "#e0e0e0")};
  color: ${(props) => (props.sent ? "#fff" : "#333")};
  align-self: ${(props) => (props.sent ? "flex-end" : "flex-start")};
  padding: 14px 18px;
  border-radius: 20px;
  max-width: 75%;
  font-size: 1rem;
  position: relative;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const MessageInfo = styled.div`
  font-size: 0.75rem;
  color: #555;
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  opacity: 0.8;
`;

const MessageForm = styled.form`
  display: flex;
  width: 90%;
  max-width: 650px;
  gap: 10px;
  position: fixed;
  bottom: 10px;
  background: #fff;
  padding: 10px 15px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 15px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  background: #f5f5f5;
  transition: all 0.3s ease-in-out;

  &:focus {
    outline: none;
    background: #fff;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: #fff;
  border: none;
  padding: 12px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease-in-out;
  font-weight: 500;

  &:hover {
    background: linear-gradient(135deg, #0056b3, #004494);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
  
`;


function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [username] = useState("User");
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: username,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const goBack = () => {
    window.history.back(); // Navigate to the previous page
  };

  return (
    <AppContainer>
      <Header>
        <BackButton onClick={goBack}>← Back</BackButton>
        <span>Message Box</span>
        <div></div> {/* Empty div to balance flexbox alignment */}
      </Header>

      <MessagesContainer>
        {messages.length === 0 ? (
          <EmptyMessage>No messages yet. Start the conversation!</EmptyMessage>
        ) : (
          messages.map((message) => (
            <Message key={message.id} sent={message.sender === username}>
              <MessageInfo>
                <span>{message.sender}</span>
                <span>{message.timestamp}</span>
              </MessageInfo>
              {message.text}
            </Message>
          ))
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <MessageForm onSubmit={handleSendMessage}>
        <Input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button type="submit">Send</Button>
      </MessageForm>
    </AppContainer>
  );
}

export default App;

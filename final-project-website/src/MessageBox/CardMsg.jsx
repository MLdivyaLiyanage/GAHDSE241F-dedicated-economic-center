// FarmerChat.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // For making API requests to the Gemini AI service

// Styled components for chat interface
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-image: url('src/assets/backimg1.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
`;

const ChatHeader = styled.div`
  background: linear-gradient(45deg, rgb(65, 208, 132), rgb(80, 200, 156));
  color: white;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const ProfilePic = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
  border: 2px solid white;
`;

const FarmerInfo = styled.div`
  flex: 1;
`;

const FarmerName = styled.h3`
  margin: 0;
  font-size: 1.2rem;
`;

const FarmerStatus = styled.p`
  margin: 3px 0 0;
  font-size: 0.8rem;
  opacity: 0.8;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  padding: 8px 15px;
  margin-right: 10px;
  border-radius: 4px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 0.8);
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 18px;
  margin-bottom: 10px;
  position: relative;
  word-wrap: break-word;
  
  ${props => props.isFarmer ? `
    background-color: #e5f7eb;
    border: 1px solid #c8e6d2;
    color: #333;
    align-self: flex-start;
    border-bottom-left-radius: 5px;
  ` : `
    background: linear-gradient(45deg, #4158D0, #C850C0);
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 5px;
  `}
`;

const MessageTime = styled.span`
  font-size: 0.7rem;
  opacity: 0.7;
  position: absolute;
  bottom: -18px;
  ${props => props.isFarmer ? 'left: 10px;' : 'right: 10px;'}
`;

const InputContainer = styled.form`
  display: flex;
  padding: 15px;
  background-color: white;
  border-top: 1px solid #eee;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 25px;
  font-size: 0.9rem;
  outline: none;
  
  &:focus {
    border-color: rgb(65, 208, 132);
  }
`;

const SendButton = styled.button`
  background: rgb(65, 208, 132);
  color: white;
  border: none;
  width: 80px;
  border-radius: 25px;
  margin-left: 10px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background: rgb(55, 188, 110);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const TypingIndicator = styled.div`
  align-self: flex-start;
  background-color: #e5f7eb;
  border-radius: 18px;
  padding: 8px 15px;
  font-size: 0.9rem;
  margin-bottom: 10px;
  color: #555;
`;

// Main Chat Component
function FarmerChat() {
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [farmer, setFarmer] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  
  // Parse the farmer data passed via location state
  useEffect(() => {
    if (location.state?.farmer) {
      setFarmer(location.state.farmer);
      
      // Initialize with welcome messages
      const initialMessages = [
        {
          id: 1,
          text: `Welcome to your chat with ${location.state.farmer.username}!`,
          sender: 'system',
          timestamp: new Date().toISOString()
        },
        {
          id: 2,
          text: `Hello! I'm ${location.state.farmer.username}. How can I help you today?`,
          sender: 'farmer',
          timestamp: new Date().toISOString()
        }
      ];
      
      setMessages(initialMessages);
      
      // Initialize chat history array for Gemini context
      setChatHistory([
        {
          role: "user", 
          parts: [{
            text: `You are roleplaying as a farmer named ${location.state.farmer.username} from ${location.state.farmer.location}. 
            Your farm produces the following: ${location.state.farmer.products?.map(p => p.name + ' (' + p.description + ')').join(', ') || 'various farm products'}. 
            You care deeply about sustainable farming and providing quality produce to your customers. 
            Your prices are fair and depend on seasonal availability. 
            You're an expert in farming techniques and can answer questions about your products.
            Your contact email is ${location.state.farmer.email || 'listed in my profile'} and phone is ${location.state.farmer.phone_number || 'listed in my profile'}.
            When customers ask about visiting your farm, you welcome them to ${location.state.farmer.location}.
            Respond as if you are this farmer, being friendly, helpful, and knowledgeable. 
            Keep your responses concise (under 3 sentences when possible).
            Always stay in character as the farmer. Never break character or mention that you are an AI.`
          }]
        },
        {
          role: "model",
          parts: [{
            text: `Hello! I'm ${location.state.farmer.username}. How can I help you today?`
          }]
        }
      ]);
      
    } else {
      // Handle case where no farmer data is passed
      navigate('/'); // Redirect to home if no farmer data
    }
  }, [location.state, navigate]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    // Update UI immediately with user message
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Update chat history for Gemini context
    const updatedHistory = [
      ...chatHistory,
      { 
        role: "user", 
        parts: [{ text: newMessage }]
      }
    ];
    setChatHistory(updatedHistory);
    
    // Clear input field
    setNewMessage('');
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Call Gemini AI for response
      const response = await getGeminiResponse(updatedHistory, farmer);
      
      // Create farmer response from Gemini
      const farmerResponse = {
        id: Date.now() + 1,
        text: response,
        sender: 'farmer',
        timestamp: new Date().toISOString()
      };
      
      // Update messages with Gemini response
      setMessages(prevMessages => [...prevMessages, farmerResponse]);
      
      // Update chat history with Gemini response
      setChatHistory([
        ...updatedHistory,
        { 
          role: "model", 
          parts: [{ text: response }]
        }
      ]);
      
    } catch (error) {
      console.error('Error getting Gemini response:', error);
      
      // Fallback response in case of error
      const errorResponse = {
        id: Date.now() + 1,
        text: "I'm sorry, I seem to be having trouble with my connection right now. Could you try again in a bit?",
        sender: 'farmer',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prevMessages => [...prevMessages, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  // Function to get response from Gemini AI service
  const getGeminiResponse = async (chatHistory, farmer) => {
    // Gemini API endpoint and key
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    const API_KEY = 'AIzaSyArwJnTPgKs-6UHyx-S2FS5Fh7XMGxOcF8'; // Store this securely, ideally in env variables
    
    try {
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${API_KEY}`,
        {
          contents: chatHistory,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 150,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Extract the text response from Gemini's response format
      const responseText = response.data.candidates[0].content.parts[0].text;
      return responseText;
    } catch (error) {
      console.error('Gemini API Error:', error);
      // If the API fails, fall back to the simple response generator
      return generateFallbackResponse(chatHistory[chatHistory.length - 1].parts[0].text, farmer);
    }
  };

  // Fallback response generator in case Gemini API fails
  const generateFallbackResponse = (userMessage, farmer) => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes('product') || lowerCaseMessage.includes('sell') || lowerCaseMessage.includes('grow')) {
      if (farmer.products?.length > 0) {
        return `I currently have ${farmer.products.length} products available. My main products include ${farmer.products.map(p => p.name).join(', ')}. Would you like to know more about any specific one?`;
      }
      return "I'm currently updating my product listings. Feel free to ask me anything else about my farm!";
    }
    
    if (lowerCaseMessage.includes('price') || lowerCaseMessage.includes('cost') || lowerCaseMessage.includes('much')) {
      return "Prices vary depending on the season and quantity. What specific product are you interested in?";
    }
    
    if (lowerCaseMessage.includes('location') || lowerCaseMessage.includes('where') || lowerCaseMessage.includes('visit')) {
      return `My farm is located in ${farmer.location}. You're welcome to visit us anytime!`;
    }
    
    if (lowerCaseMessage.includes('organic') || lowerCaseMessage.includes('pesticide') || lowerCaseMessage.includes('chemical')) {
      return "I follow sustainable farming practices and minimize the use of chemicals. My goal is to provide healthy, environmentally friendly produce.";
    }
    
    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi') || lowerCaseMessage.includes('hey')) {
      return `Hello! Thanks for reaching out. How can I help you today?`;
    }
    
    if (lowerCaseMessage.includes('contact') || lowerCaseMessage.includes('phone') || lowerCaseMessage.includes('email')) {
      return `You can contact me at ${farmer.phone_number || 'my phone number listed in my profile'} or email me at ${farmer.email || 'the email address in my profile'}.`;
    }
    
    if (lowerCaseMessage.includes('season') || lowerCaseMessage.includes('harvest') || lowerCaseMessage.includes('availability')) {
      return "Our harvesting seasons vary by product. Let me know which product you're interested in, and I can tell you when it's typically available.";
    }
    
    if (lowerCaseMessage.includes('delivery') || lowerCaseMessage.includes('shipping') || lowerCaseMessage.includes('pickup')) {
      return "We offer both local delivery and pickup options. For delivery, we typically serve areas within 30 miles of our farm with a small fee.";
    }
    
    // Default response
    return "Thanks for your message! Can you provide more details about what information you're looking for about our farm or products?";
  };

  // Format timestamp for display
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle going back
  const handleBack = () => {
    navigate(-1);
  };

  if (!farmer) {
    return <div>Loading...</div>;
  }

  return (
    <ChatContainer>
      <ChatHeader>
        <BackButton onClick={handleBack}>←</BackButton>
        <ProfilePic 
          src={farmer.profile_image ? 
            `http://localhost:5000${farmer.profile_image}` : 
            "https://via.placeholder.com/100"} 
          alt={farmer.username} 
        />
        <FarmerInfo>
          <FarmerName>{farmer.username}</FarmerName>
          <FarmerStatus>Online • {farmer.location}</FarmerStatus>
        </FarmerInfo>
      </ChatHeader>
      
      <MessagesContainer>
        {messages.map((message) => (
          message.sender !== 'system' && (
            <MessageBubble 
              key={message.id} 
              isFarmer={message.sender === 'farmer'}
            >
              {message.text}
              <MessageTime isFarmer={message.sender === 'farmer'}>
                {formatTime(message.timestamp)}
              </MessageTime>
            </MessageBubble>
          )
        ))}
        {isTyping && (
          <TypingIndicator>
            {farmer.username} is typing...
          </TypingIndicator>
        )}
      </MessagesContainer>
      
      <InputContainer onSubmit={handleSendMessage}>
        <MessageInput 
          type="text" 
          placeholder="Type your message..." 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <SendButton type="submit" disabled={!newMessage.trim()}>
          Send
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
}

export default FarmerChat;
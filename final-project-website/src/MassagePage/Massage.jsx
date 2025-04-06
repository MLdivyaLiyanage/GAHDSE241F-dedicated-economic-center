import { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #e6f7e9, #c8e6c9);
  font-family: "Poppins", sans-serif;
  padding: 0;
  overflow: hidden;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #2e7d32;
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

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FarmerName = styled.span`
  font-size: 1.6rem;
  font-weight: bold;
`;

const FarmerStatus = styled.span`
  font-size: 0.8rem;
  color: #b9f6ca;
  margin-top: 2px;
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
  height: calc(100vh - 150px);
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
    background: #43a047;
    border-radius: 3px;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #555;
  font-style: italic;
  font-size: 1rem;
`;

const Message = styled.div`
  background: ${(props) => (props.isFarmer ? "#43a047" : props.sent ? "#1e88e5" : "#e0e0e0")};
  color: ${(props) => (props.isFarmer || props.sent ? "#fff" : "#333")};
  align-self: ${(props) => (props.isFarmer ? "flex-start" : props.sent ? "flex-end" : "flex-start")};
  padding: 14px 18px;
  border-radius: 20px;
  max-width: 75%;
  font-size: 1rem;
  position: relative;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const MessageInfo = styled.div`
  font-size: 0.75rem;
  color: ${(props) => (props.isFarmer || props.sent ? "rgba(255, 255, 255, 0.8)" : "#555")};
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  opacity: 0.8;
`;

const ProductUpdate = styled.div`
  background: #e8f5e9;
  border: 1px solid #a5d6a7;
  border-radius: 12px;
  padding: 12px 15px;
  margin: 5px 0;
  font-size: 0.9rem;
  color: #2e7d32;
`;

const PriceTag = styled.span`
  background: #2e7d32;
  color: white;
  border-radius: 12px;
  padding: 3px 8px;
  font-weight: bold;
  margin-left: 5px;
`;

const StockInfo = styled.span`
  background: ${props => props.inStock ? "#c8e6c9" : "#ffccbc"};
  color: ${props => props.inStock ? "#2e7d32" : "#d84315"};
  border-radius: 12px;
  padding: 3px 8px;
  font-weight: 500;
  margin-left: 5px;
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
    box-shadow: 0 0 8px rgba(67, 160, 71, 0.5);
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #43a047, #2e7d32);
  color: #fff;
  border: none;
  padding: 12px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease-in-out;
  font-weight: 500;

  &:hover {
    background: linear-gradient(135deg, #388e3c, #1b5e20);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const TypingIndicator = styled.div`
  align-self: flex-start;
  color: #555;
  font-size: 0.9rem;
  font-style: italic;
  margin-top: -5px;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
`;

const TypingDots = styled.div`
  display: inline-block;
  margin-left: 5px;
  
  &::after {
    content: '...';
    animation: typing 1.5s infinite;
    display: inline-block;
  }
  
  @keyframes typing {
    0% { content: '.'; }
    33% { content: '..'; }
    66% { content: '...'; }
    100% { content: '.'; }
  }
`;

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [username] = useState("You");
  const [isFarmerTyping, setIsFarmerTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [isOnline, setIsOnline] = useState(true);

  // Sample product data for the farmer's marketplace
  const productInfo = {
    name: "Lime",
    farmer: "Saman Perera",
    location: "Anuradhapura",
    price: "Rs. 180/kg",
    available: true,
    quantity: "500kg",
    harvestDate: "March 28, 2025"
  };

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isFarmerTyping]);

  useEffect(() => {
    // Initialize chat with a welcome message from the farmer
    if (messages.length === 0) {
      simulateFarmerReply({
        text: `Ayubowan! Welcome to Sri Lanka Dedicated Economic Center. I'm from ${productInfo.farmer} in ${productInfo.location}. I have fresh ${productInfo.name} available. How can I help you today?`,
        immediate: true
      });
      
      // Add product update message
      setTimeout(() => {
        const updateMessage = {
          id: Date.now() + 1,
          isUpdate: true,
          product: productInfo.name,
          price: productInfo.price,
          available: productInfo.available,
          quantity: productInfo.quantity,
          harvestDate: productInfo.harvestDate,
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(messages => [...messages, updateMessage]);
      }, 1000);
    }

    // Randomly toggle farmer online status
    const statusInterval = setInterval(() => {
      setIsOnline(Math.random() > 0.2 ? true : false);
    }, 60000); // Every minute

    return () => clearInterval(statusInterval);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: username,
        timestamp: new Date().toLocaleTimeString(),
        isFarmer: false
      };
      setMessages([...messages, message]);
      setNewMessage("");
      
      // Simulate farmer typing and response
      handleFarmerResponse(newMessage);
    }
  };

  const simulateFarmerReply = ({ text, immediate = false }) => {
    if (!immediate) {
      setIsFarmerTyping(true);
    }
    
    // Random delay to simulate typing
    const typingTime = immediate ? 0 : Math.floor(Math.random() * 2000) + 1000;
    
    setTimeout(() => {
      setIsFarmerTyping(false);
      const reply = {
        id: Date.now(),
        text: text,
        sender: productInfo.farmer,
        timestamp: new Date().toLocaleTimeString(),
        isFarmer: true
      };
      setMessages(messages => [...messages, reply]);
    }, typingTime);
  };

  const handleFarmerResponse = (userMessage) => {
    // Simple keyword-based response system tailored for Sri Lankan farmer context
    const lowerMsg = userMessage.toLowerCase();

    // Set of predefined responses based on keywords
    if (lowerMsg.includes("price") || lowerMsg.includes("cost") || lowerMsg.includes("how much")) {
      simulateFarmerReply({ text: `My ${productInfo.name} is currently priced at ${productInfo.price}. This is direct from my farm - no middleman price markup!` });
      
      // Add product update with price details
      setTimeout(() => {
        const updateMessage = {
          id: Date.now() + 100,
          isUpdate: true,
          product: productInfo.name,
          price: productInfo.price,
          available: productInfo.available,
          quantity: productInfo.quantity,
          harvestDate: productInfo.harvestDate,
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(messages => [...messages, updateMessage]);
      }, 2000);
      
    } else if (lowerMsg.includes("delivery") || lowerMsg.includes("shipping") || lowerMsg.includes("transport")) {
      simulateFarmerReply({ text: "We can arrange transport to Colombo for bulk orders (over 100kg). For smaller amounts, we have a pickup location at the Dedicated Economic Center. We can also connect you with local transport services." });
    } else if (lowerMsg.includes("discount") || lowerMsg.includes("wholesale") || lowerMsg.includes("bulk")) {
      simulateFarmerReply({ text: "Yes, we offer discounts for bulk purchases! For orders over 200kg, we can reduce the price to Rs. 165/kg." });
    } else if (lowerMsg.includes("quality") || lowerMsg.includes("organic") || lowerMsg.includes("chemical")) {
      simulateFarmerReply({ text: "Our rice is fully organic - no chemical fertilizers or pesticides. We use traditional farming methods and natural pest control. We have certification from the Sri Lanka Standards Institution." });
    } else if (lowerMsg.includes("hello") || lowerMsg.includes("hi") || lowerMsg.includes("ayubowan")) {
      simulateFarmerReply({ text: "Ayubowan! How can I help you today? Are you interested in purchasing our organic rice?" });
    } else if (lowerMsg.includes("thank")) {
      simulateFarmerReply({ text: "Istuti (Thank you)! Looking forward to doing business with you. Please let me know if you have any other questions." });
    } else if (lowerMsg.includes("variety") || lowerMsg.includes("type") || lowerMsg.includes("kind")) {
      simulateFarmerReply({ text: "We grow traditional Sri Lankan rice varieties - mainly Suwandel, Kalu Heenati, and Pachchaperumal. These heritage varieties have better taste and nutritional value than commercial types." });
    } else if (lowerMsg.includes("harvest") || lowerMsg.includes("fresh") || lowerMsg.includes("new")) {
      simulateFarmerReply({ text: `This batch was harvested on ${productInfo.harvestDate}. It's from our recent Maha season harvest and has been naturally dried and processed the traditional way.` });
      
      // Update product details
      setTimeout(() => {
        const updateMessage = {
          id: Date.now() + 200,
          isUpdate: true,
          product: productInfo.name,
          price: productInfo.price,
          available: productInfo.available,
          quantity: "450kg", // Reduced quantity to show update
          harvestDate: productInfo.harvestDate,
          timestamp: new Date().toLocaleTimeString(),
          note: "Quantity updated: 50kg sold today"
        };
        setMessages(messages => [...messages, updateMessage]);
      }, 2000);
      
    } else if (lowerMsg.includes("available") || lowerMsg.includes("stock") || lowerMsg.includes("quantity")) {
      simulateFarmerReply({ text: `I currently have ${productInfo.quantity} available. I update my stock daily as sales happen. Would you like to reserve a specific amount?` });
    } else {
      // Default responses for unrecognized queries
      const defaultResponses = [
        `Thank you for your interest in our ${productInfo.name}. Would you like to know more about the quality or pricing?`,
        "As a direct farmer-to-consumer service, we can provide fresher products at better prices. How can I help you today?",
        "Our Economic Center helps connect local farmers directly with buyers. Is there something specific you're looking for?",
        "I'm happy to answer any questions about our farming practices or products. We pride ourselves on sustainable agriculture."
      ];
      
      const randomResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
      simulateFarmerReply({ text: randomResponse });
    }
  };

  const goBack = () => {
    window.history.back(); // Navigate to the previous page
  };

  return (
    <AppContainer>
      <Header>
        <BackButton onClick={goBack}>← Back</BackButton>
        <HeaderInfo>
          <FarmerName>{productInfo.farmer}</FarmerName>
          <FarmerStatus>{isOnline ? "Online" : "In the field"}</FarmerStatus>
        </HeaderInfo>
        <div></div> {/* Empty div to balance flexbox alignment */}
      </Header>

      <MessagesContainer>
        {messages.length === 0 ? (
          <EmptyMessage>Connecting with farmer...</EmptyMessage>
        ) : (
          <>
            {messages.map((message) => (
              message.isUpdate ? (
                <ProductUpdate key={message.id}>
                  <strong>🌾 Product Update</strong><br />
                  <span>{message.product}</span> <PriceTag>{message.price}</PriceTag>
                  <StockInfo inStock={message.available}>
                    {message.available ? "In Stock" : "Out of Stock"}
                  </StockInfo><br />
                  <span>Quantity: {message.quantity} • Harvested: {message.harvestDate}</span>
                  {message.note && <div style={{ marginTop: '5px', fontStyle: 'italic' }}>{message.note}</div>}
                  <div style={{ fontSize: '0.75rem', textAlign: 'right', marginTop: '5px', opacity: 0.7 }}>
                    Updated at {message.timestamp}
                  </div>
                </ProductUpdate>
              ) : (
                <Message 
                  key={message.id} 
                  sent={message.sender === username}
                  isFarmer={message.isFarmer}
                >
                  <MessageInfo sent={message.sender === username} isFarmer={message.isFarmer}>
                    <span>{message.sender}</span>
                    <span>{message.timestamp}</span>
                  </MessageInfo>
                  {message.text}
                </Message>
              )
            ))}
            {isFarmerTyping && (
              <TypingIndicator>
                {productInfo.farmer} is typing<TypingDots />
              </TypingIndicator>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <MessageForm onSubmit={handleSendMessage}>
        <Input
          type="text"
          placeholder="Type your message to farmer..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button type="submit">Send</Button>
      </MessageForm>
    </AppContainer>
  );
}

export default App;
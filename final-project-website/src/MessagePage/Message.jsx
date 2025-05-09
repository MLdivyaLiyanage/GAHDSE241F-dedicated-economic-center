import { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { FiArrowLeft, FiSend, FiCheck, FiClock, FiInfo } from "react-icons/fi";
import { BsFlower1, BsTruck } from "react-icons/bs";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #f5f7fa, #e4f5e8);
  font-family: "Inter", sans-serif;
  padding: 0;
  overflow: hidden;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #2e7d32, #43a047);
  color: #fff;
  padding: 16px 24px;
  width: 100%;
  font-size: 1.4rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  margin-right: 12px;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateX(-2px);
  }

  &:active {
    transform: scale(0.9);
  }
`;

const FarmerInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const FarmerName = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
`;

const FarmerStatus = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: #e0f7fa;
  margin-top: 2px;
`;

const StatusIndicator = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.online ? "#76ff03" : "#ff9100"};
  margin-right: 6px;
  box-shadow: 0 0 8px ${props => props.online ? "rgba(118, 255, 3, 0.5)" : "rgba(255, 145, 0, 0.5)"};
`;

const FarmerAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a5d6a7, #43a047);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  margin-left: 12px;
  border: 2px solid white;
`;

const MessagesContainer = styled.div`
  width: 100%;
  max-width: 800px;
  height: calc(100vh - 160px);
  overflow-y: auto;
  padding: 80px 20px 90px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  scroll-behavior: smooth;
  
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(67, 160, 71, 0.5);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(67, 160, 71, 0.1);
  }
`;

const EmptyMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #78909c;
  font-size: 1rem;
  text-align: center;
  padding: 20px;
`;

const WelcomeMessage = styled.div`
  background: #e8f5e9;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  animation: ${fadeIn} 0.5s ease-out;
  border: 1px solid #c8e6c9;
`;

const WelcomeHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: #2e7d32;
  font-weight: 600;
`;

const Message = styled.div`
  background: ${(props) => 
    props.isFarmer ? "#43a047" : 
    props.sent ? "#1e88e5" : "#f5f5f5"};
  color: ${(props) => (props.isFarmer || props.sent ? "#fff" : "#333")};
  align-self: ${(props) => 
    props.isFarmer ? "flex-start" : 
    props.sent ? "flex-end" : "flex-start"};
  padding: 12px 16px;
  border-radius: 18px;
  max-width: 80%;
  font-size: 0.95rem;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  animation: ${fadeIn} 0.3s ease-out;
  line-height: 1.4;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    ${props => props.isFarmer ? "left: -8px;" : "right: -8px;"}
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-${props => props.isFarmer ? "right" : "left"}-color: ${props => 
      props.isFarmer ? "#43a047" : 
      props.sent ? "#1e88e5" : "#f5f5f5"};
    border-${props => props.isFarmer ? "left" : "right"}: 0;
    border-bottom: 0;
    margin-${props => props.isFarmer ? "left" : "right"}: -10px;
    margin-bottom: 8px;
  }
`;

const MessageInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: ${(props) => (props.isFarmer || props.sent ? "rgba(255, 255, 255, 0.8)" : "#78909c")};
  margin-bottom: 6px;
`;

const MessageStatus = styled.span`
  display: flex;
  align-items: center;
  margin-left: 4px;
`;

const ProductUpdate = styled.div`
  background: #e8f5e9;
  border: 1px solid #a5d6a7;
  border-radius: 16px;
  padding: 16px;
  margin: 8px 0;
  font-size: 0.9rem;
  color: #2e7d32;
  animation: ${fadeIn} 0.5s ease-out;
  position: relative;
  overflow: hidden;
`;

const ProductHeader = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1b5e20;
`;

const ProductDetail = styled.div`
  display: flex;
  align-items: center;
  margin: 6px 0;
`;

const DetailIcon = styled.span`
  margin-right: 8px;
  color: #2e7d32;
`;

// eslint-disable-next-line no-unused-vars
const PriceTag = styled.span`
  background: #2e7d32;
  color: white;
  border-radius: 12px;
  padding: 4px 10px;
  font-weight: 500;
  margin-left: 8px;
  font-size: 0.8rem;
`;

const StockInfo = styled.span`
  background: ${props => props.inStock ? "#c8e6c9" : "#ffccbc"};
  color: ${props => props.inStock ? "#2e7d32" : "#d84315"};
  border-radius: 12px;
  padding: 4px 10px;
  font-weight: 500;
  margin-left: 8px;
  font-size: 0.8rem;
`;

const NoteBadge = styled.div`
  background: #bbdefb;
  color: #0d47a1;
  border-radius: 12px;
  padding: 4px 10px;
  font-size: 0.75rem;
  margin-top: 8px;
  display: inline-flex;
  align-items: center;
`;

const TypingIndicator = styled.div`
  align-self: flex-start;
  background: #f5f5f5;
  color: #78909c;
  font-size: 0.85rem;
  padding: 10px 16px;
  border-radius: 18px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  animation: ${fadeIn} 0.3s ease-out;
`;

const TypingDots = styled.div`
  display: flex;
  margin-left: 8px;
  
  span {
    width: 6px;
    height: 6px;
    background: #78909c;
    border-radius: 50%;
    display: inline-block;
    margin: 0 2px;
    animation: ${pulse} 1.5s infinite ease-in-out;
    
    &:nth-child(1) { animation-delay: 0s; }
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
`;

const MessageForm = styled.form`
  display: flex;
  width: 100%;
  max-width: 800px;
  gap: 12px;
  position: fixed;
  bottom: 0;
  background: #fff;
  padding: 16px 20px;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);
  z-index: 100;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 24px;
  font-size: 0.95rem;
  background: #fafafa;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #43a047;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(67, 160, 71, 0.2);
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #43a047, #2e7d32);
  color: #fff;
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background: linear-gradient(135deg, #388e3c, #1b5e20);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    background: #bdbdbd;
    cursor: not-allowed;
    transform: none;
  }
`;

const QuickActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
`;

const QuickActionButton = styled.button`
  background: rgba(67, 160, 71, 0.1);
  color: #2e7d32;
  border: 1px solid rgba(67, 160, 71, 0.3);
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(67, 160, 71, 0.2);
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.98);
  }
`;

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [username] = useState("You");
  const [isFarmerTyping, setIsFarmerTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef(null);

  // Sample product data for the farmer's marketplace
  const productInfo = {
    name: "Organic Red Rice",
    farmer: "Saman Perera",
    location: "Anuradhapura",
    price: "Rs. 180/kg",
    available: true,
    quantity: "500kg",
    harvestDate: "March 28, 2025",
    certification: "SLS Organic Certified",
    delivery: "Available for bulk orders (100kg+)"
  };

  // Quick action suggestions
  const quickActions = [
    "What's the price?",
    "Is delivery available?",
    "Do you offer discounts?",
    "Tell me about quality",
    "What's available now?"
  ];

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
        text: `Ayubowan! Welcome to Sri Lanka Dedicated Economic Center. I'm ${productInfo.farmer} from ${productInfo.location}. I specialize in traditional organic rice varieties. How can I assist you today?`,
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
          certification: productInfo.certification,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(messages => [...messages, updateMessage]);
      }, 1000);
    }

    // Randomly toggle farmer online status
    const statusInterval = setInterval(() => {
      setIsOnline(Math.random() > 0.2);
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
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFarmer: false,
        status: 'sent'
      };
      setMessages([...messages, message]);
      setNewMessage("");
      
      // Simulate farmer typing and response
      handleFarmerResponse(newMessage);
    }
  };

  const handleQuickAction = (action) => {
    setNewMessage(action);
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
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
      simulateFarmerReply({ text: `Our premium ${productInfo.name} is priced at ${productInfo.price}. This includes:\n\n• Direct from farm pricing\n• Traditional processing\n• Organic certification\n\nBulk discounts available for orders over 100kg.` });
      
      setTimeout(() => {
        const updateMessage = {
          id: Date.now() + 100,
          isUpdate: true,
          product: productInfo.name,
          price: productInfo.price,
          available: productInfo.available,
          quantity: productInfo.quantity,
          harvestDate: productInfo.harvestDate,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: "Bulk discount: Rs. 165/kg for 200kg+"
        };
        setMessages(messages => [...messages, updateMessage]);
      }, 2000);
      
    } else if (lowerMsg.includes("delivery") || lowerMsg.includes("shipping") || lowerMsg.includes("transport")) {
      simulateFarmerReply({ text: `🚚 Delivery Options:\n\n• Pickup at farm (Anuradhapura)\n• Economic Center collection point\n• Bulk delivery to Colombo (100kg+)\n\nWe work with trusted transport partners to ensure your rice arrives fresh.` });
      
      setTimeout(() => {
        const updateMessage = {
          id: Date.now() + 101,
          isUpdate: true,
          product: productInfo.name,
          delivery: productInfo.delivery,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: "Delivery charges apply based on quantity and location"
        };
        setMessages(messages => [...messages, updateMessage]);
      }, 1500);
      
    } else if (lowerMsg.includes("discount") || lowerMsg.includes("wholesale") || lowerMsg.includes("bulk")) {
      simulateFarmerReply({ text: "Yes! We offer special pricing for bulk purchases:\n\n• 100-199kg: Rs. 170/kg\n• 200-499kg: Rs. 165/kg\n• 500kg+: Rs. 160/kg\n\nThese prices include delivery to Colombo for orders over 100kg." });
    } else if (lowerMsg.includes("quality") || lowerMsg.includes("organic") || lowerMsg.includes("chemical")) {
      simulateFarmerReply({ text: `Our quality assurance:\n\n✅ ${productInfo.certification}\n✅ No chemical fertilizers/pesticides\n✅ Traditional sun-drying\n✅ Heritage seed varieties\n✅ Hand-processed\n\nWe maintain strict quality controls from seed to harvest.` });
    } else if (lowerMsg.includes("hello") || lowerMsg.includes("hi") || lowerMsg.includes("ayubowan")) {
      simulateFarmerReply({ text: "Ayubowan! Thank you for connecting through our Dedicated Economic Center. I'm happy to share information about our organic farming practices and products." });
    } else if (lowerMsg.includes("thank")) {
      simulateFarmerReply({ text: "Istuti (Thank you)! It's my pleasure to serve you. Please don't hesitate to ask if you need any more information about our products." });
    } else if (lowerMsg.includes("variety") || lowerMsg.includes("type") || lowerMsg.includes("kind")) {
      simulateFarmerReply({ text: "We grow these traditional Sri Lankan rice varieties:\n\n• Suwandel - Fragrant white rice\n• Kalu Heenati - High-nutrient red rice\n• Pachchaperumal - Drought-resistant\n\nEach has unique health benefits and flavors passed down for generations." });
    } else if (lowerMsg.includes("harvest") || lowerMsg.includes("fresh") || lowerMsg.includes("new")) {
      simulateFarmerReply({ text: `This batch was harvested on ${productInfo.harvestDate} during the Maha season. We follow these traditional practices:\n\n• Natural sun-drying\n• Traditional storage methods\n• Minimal processing\n\nThis preserves the natural nutrients and flavor.` });
      
      setTimeout(() => {
        const updateMessage = {
          id: Date.now() + 200,
          isUpdate: true,
          product: productInfo.name,
          quantity: "450kg",
          harvestDate: productInfo.harvestDate,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: "Recent sales: 50kg sold to Colombo buyer"
        };
        setMessages(messages => [...messages, updateMessage]);
      }, 2000);
      
    } else if (lowerMsg.includes("available") || lowerMsg.includes("stock") || lowerMsg.includes("quantity")) {
      simulateFarmerReply({ text: `Current availability:\n\n• ${productInfo.name}: ${productInfo.quantity}\n• New harvest expected in 3 weeks\n\nI can reserve stock for you if needed. Would you like to place a pre-order?` });
    } else {
      // Default responses for unrecognized queries
      const defaultResponses = [
        `Thank you for your interest in our ${productInfo.name}. Would you like details about pricing or availability?`,
        "As a direct farmer-to-buyer platform, we offer fresher products at fair prices. How may I assist you?",
        "Our Economic Center connects farmers directly with buyers. What information would help you?",
        "I'm happy to share more about our sustainable farming practices. What would you like to know?"
      ];
      
      const randomResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
      simulateFarmerReply({ text: randomResponse });
    }
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <AppContainer>
      <Header>
        <HeaderContent>
          <BackButton onClick={goBack} aria-label="Go back">
            <FiArrowLeft size={20} />
          </BackButton>
          
          <FarmerInfo>
            <FarmerName>{productInfo.farmer}</FarmerName>
            <FarmerStatus>
              <StatusIndicator online={isOnline} />
              {isOnline ? "Online" : "Offline - Will reply later"}
            </FarmerStatus>
          </FarmerInfo>
          
          <FarmerAvatar>
            {productInfo.farmer.charAt(0)}
          </FarmerAvatar>
        </HeaderContent>
      </Header>

      <MessagesContainer>
        {messages.length === 0 ? (
          <EmptyMessage>
            <div>Connecting you with {productInfo.farmer}...</div>
          </EmptyMessage>
        ) : (
          <>
            <WelcomeMessage>
              <WelcomeHeader>
                <FiInfo size={18} style={{ marginRight: '8px' }} />
                About This Connection
              </WelcomeHeader>
              <div>You&apos;re chatting directly with {productInfo.farmer}, a certified organic farmer from {productInfo.location} through Sri Lanka&apos;s Dedicated Economic Center platform.</div>
            </WelcomeMessage>
            
            {messages.map((message) => (
              message.isUpdate ? (
                <ProductUpdate key={message.id}>
                  <ProductHeader>
                    <BsFlower1 size={16} style={{ marginRight: '8px' }} />
                    Product Update: {message.product}
                  </ProductHeader>
                  
                  <ProductDetail>
                    <DetailIcon>💰</DetailIcon>
                    <span>Price: {message.price}</span>
                    <StockInfo inStock={message.available}>
                      {message.available ? "In Stock" : "Out of Stock"}
                    </StockInfo>
                  </ProductDetail>
                  
                  <ProductDetail>
                    <DetailIcon>📦</DetailIcon>
                    <span>Available Quantity: {message.quantity}</span>
                  </ProductDetail>
                  
                  <ProductDetail>
                    <DetailIcon>📅</DetailIcon>
                    <span>Harvest Date: {message.harvestDate}</span>
                  </ProductDetail>
                  
                  {message.certification && (
                    <ProductDetail>
                      <DetailIcon>✅</DetailIcon>
                      <span>Certification: {message.certification}</span>
                    </ProductDetail>
                  )}
                  
                  {message.delivery && (
                    <ProductDetail>
                      <DetailIcon><BsTruck size={14} /></DetailIcon>
                      <span>Delivery: {message.delivery}</span>
                    </ProductDetail>
                  )}
                  
                  {message.note && (
                    <NoteBadge>
                      <FiInfo size={14} style={{ marginRight: '4px' }} />
                      {message.note}
                    </NoteBadge>
                  )}
                  
                  <div style={{ fontSize: '0.7rem', textAlign: 'right', marginTop: '8px', color: '#78909c' }}>
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
                    <span>
                      {message.timestamp}
                      {message.sender === username && (
                        <MessageStatus>
                          {message.status === 'sent' ? <FiClock size={12} /> : <FiCheck size={12} />}
                        </MessageStatus>
                      )}
                    </span>
                  </MessageInfo>
                  {message.text}
                </Message>
              )
            ))}
            
            {isFarmerTyping && (
              <TypingIndicator>
                {productInfo.farmer} is typing
                <TypingDots>
                  <span></span>
                  <span></span>
                  <span></span>
                </TypingDots>
              </TypingIndicator>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </MessagesContainer>

      <MessageForm onSubmit={handleSendMessage}>
        <Input
          type="text"
          placeholder={`Message ${productInfo.farmer}...`}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          aria-label="Type your message"
        />
        <SendButton type="submit" disabled={!newMessage.trim()}>
          <FiSend size={20} />
        </SendButton>
      </MessageForm>
      
      {!newMessage && (
        <QuickActions>
          {quickActions.map((action, index) => (
            <QuickActionButton 
              key={index} 
              onClick={() => handleQuickAction(action)}
              type="button"
            >
              {action}
            </QuickActionButton>
          ))}
        </QuickActions>
      )}
    </AppContainer>
  );
}

export default App;
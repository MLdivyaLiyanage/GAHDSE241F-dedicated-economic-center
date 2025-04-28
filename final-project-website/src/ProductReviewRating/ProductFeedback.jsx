import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { 
  FaStar, FaRegStar, FaUser, FaCalendarAlt, 
  FaSpinner, FaCheckCircle, FaExclamationTriangle,
  FaThumbsUp, FaQuoteLeft, FaTimes, FaArrowLeft
} from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Color Theme
const colors = {
  primary: '#4361ee',
  secondary: '#3f37c9',
  accent: '#4cc9f0',
  success: '#4ade80',
  warning: '#fbbf24',
  danger: '#f87171',
  light: '#f8f9fa',
  dark: '#212529',
  gray: '#6c757d',
  lightGray: '#e9ecef'
};

// Animations
const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

const gradientBg = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #f5f7fa, #e4e8eb);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${colors.primary};
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${colors.secondary};
    transform: translateY(-2px);
  }
`;

const FeedbackContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 3rem;
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  flex-grow: 1;
  display: flex;
  flex-direction: column;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: linear-gradient(90deg, ${colors.primary}, ${colors.accent});
    animation: ${gradientBg} 8s ease infinite;
    background-size: 200% 200%;
  }
`;

const FeedbackTitle = styled.h2`
  font-size: 2.8rem;
  color: ${colors.dark};
  margin-bottom: 3rem;
  text-align: center;
  font-weight: 800;
  position: relative;
  padding-bottom: 1.5rem;
  line-height: 1.2;
  
  &::after {
    content: '';
    display: block;
    width: 120px;
    height: 5px;
    background: linear-gradient(90deg, ${colors.primary}, ${colors.accent});
    margin: 1.5rem auto 0;
    border-radius: 3px;
    animation: ${gradientBg} 8s ease infinite;
    background-size: 200% 200%;
  }

  span {
    background: linear-gradient(90deg, ${colors.primary}, ${colors.accent});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
  }
`;

const ProductTitle = styled.h3`
  font-size: 2rem;
  color: ${colors.dark};
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const ProductDescription = styled.p`
  color: ${colors.gray};
  text-align: center;
  max-width: 800px;
  margin: 0 auto 3rem;
  line-height: 1.6;
  font-size: 1.1rem;
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 350px;
`;

const Notification = styled(motion.div)`
  padding: 1.2rem 1.8rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: 500;
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.96);
  border-left: 5px solid;
  position: relative;
  
  &.success {
    color: ${colors.dark};
    border-left-color: ${colors.success};
    
    svg {
      color: ${colors.success};
    }
  }
  
  &.error {
    color: ${colors.dark};
    border-left-color: ${colors.danger};
    
    svg {
      color: ${colors.danger};
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: ${colors.gray};
  cursor: pointer;
  font-size: 0.9rem;
  opacity: 0.7;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
  }
`;

const ErrorMessage = styled(motion.div)`
  padding: 1.4rem;
  background-color: rgba(248, 113, 113, 0.1);
  color: ${colors.dark};
  border-radius: 12px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-left: 4px solid ${colors.danger};
  
  svg {
    color: ${colors.danger};
    flex-shrink: 0;
  }
`;

const FeedbackForm = styled(motion.form)`
  background: white;
  padding: 3rem;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  margin-bottom: 4rem;
  position: relative;
  overflow: hidden;
  border: 1px solid ${colors.lightGray};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 6px;
    height: 100%;
    background: linear-gradient(to bottom, ${colors.primary}, ${colors.accent});
    animation: ${gradientBg} 8s ease infinite;
    background-size: 200% 200%;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 2.5rem;
  position: relative;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 1rem;
  font-weight: 600;
  color: ${colors.dark};
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  
  svg {
    color: ${colors.primary};
  }
`;

const FormInput = styled.input`
  width: 100%;
  padding: 1.2rem 1.5rem;
  border: 2px solid ${colors.lightGray};
  border-radius: 12px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  font-family: inherit;
  background-color: rgba(233, 236, 239, 0.3);
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 4px rgba(67, 97, 238, 0.2);
  }
  
  &:disabled {
    background-color: ${colors.lightGray};
    opacity: 0.7;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 1.2rem 1.5rem;
  border: 2px solid ${colors.lightGray};
  border-radius: 12px;
  font-size: 1.1rem;
  min-height: 160px;
  transition: all 0.3s ease;
  resize: vertical;
  line-height: 1.7;
  font-family: inherit;
  background-color: rgba(233, 236, 239, 0.3);
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 4px rgba(67, 97, 238, 0.2);
  }
  
  &:disabled {
    background-color: ${colors.lightGray};
    opacity: 0.7;
  }
`;

const StarRating = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 3rem;
  color: ${props => props.filled ? colors.warning : colors.lightGray};
  transition: all 0.2s ease;
  padding: 0.5rem;
  position: relative;
  animation: ${props => props.shouldAnimate ? css`${float} 1.5s infinite` : 'none'};
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  
  &:hover {
    transform: scale(1.3);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  
  &::after {
    content: '${props => props.starValue}';
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1rem;
    color: ${colors.gray};
    opacity: 0;
    transition: opacity 0.2s ease;
    font-weight: bold;
    background: white;
    padding: 0.2rem 0.6rem;
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:hover::after {
    opacity: 1;
  }
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
  color: white;
  border: none;
  padding: 1.5rem 2.5rem;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  width: 100%;
  justify-content: center;
  margin-top: 1.5rem;
  position: relative;
  overflow: hidden;
  font-family: inherit;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 5px 15px rgba(67, 97, 238, 0.3);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(67, 97, 238, 0.4);
  }
  
  &:disabled {
    background: ${colors.gray};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to bottom right,
      rgba(255, 255, 255, 0.3),
      rgba(255, 255, 255, 0)
    );
    transform: rotate(30deg);
    transition: all 0.5s ease;
  }

  &:hover::after {
    left: 100%;
  }
`;

const FeedbackSubtitle = styled.h3`
  font-size: 2.2rem;
  color: ${colors.dark};
  margin-bottom: 2.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  padding-bottom: 1.5rem;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(to right, ${colors.primary}, transparent);
  }
  
  svg {
    color: ${colors.primary};
  }
`;

const FeedbackEmpty = styled(motion.div)`
  text-align: center;
  color: ${colors.gray};
  padding: 4rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  font-size: 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 3rem;
  border: 1px dashed ${colors.lightGray};
  
  svg {
    color: ${colors.lightGray};
    font-size: 3rem;
  }
`;

const FeedbackList = styled.div`
  display: grid;
  gap: 2.5rem;
  margin-bottom: 3rem;
`;

const FeedbackItem = styled(motion.div)`
  background: white;
  padding: 2.5rem;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid ${colors.lightGray};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 6px;
    height: 100%;
    background: linear-gradient(to bottom, ${colors.primary}, ${colors.accent});
    animation: ${gradientBg} 8s ease infinite;
    background-size: 200% 200%;
  }
`;

const FeedbackHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

const FeedbackAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: 700;
  color: ${colors.dark};
  font-size: 1.3rem;
  
  svg {
    color: ${colors.primary};
  }
`;

const FeedbackDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1rem;
  color: ${colors.gray};
  
  svg {
    color: ${colors.gray};
  }
`;

const StarsDisplay = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-bottom: 2rem;
`;

const Star = styled.span`
  color: ${props => props.filled ? colors.warning : colors.lightGray};
  font-size: 1.8rem;
  transition: transform 0.2s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  
  &:hover {
    transform: scale(1.3);
  }
`;

const FeedbackComment = styled.p`
  color: ${colors.dark};
  line-height: 1.8;
  font-size: 1.15rem;
  position: relative;
  padding-left: 3rem;
  margin-top: 1.5rem;

  &::before {
    content: '“';
    position: absolute;
    left: 0;
    top: -1.5rem;
    font-size: 4rem;
    color: ${colors.lightGray};
    font-family: serif;
    line-height: 1;
    opacity: 0.7;
  }
`;

const Spinner = styled(FaSpinner)`
  animation: ${css`${pulse}`} 1.5s infinite ease-in-out;
  color: ${colors.primary};
`;

const CharacterCount = styled.div`
  text-align: right;
  font-size: 0.95rem;
  color: ${props => 
    props.count > props.max ? colors.danger : 
    props.count > props.max * 0.8 ? colors.warning : colors.gray};
  margin-top: 0.8rem;
  font-weight: ${props => props.count > props.max * 0.8 ? '600' : 'normal'};
`;

const RatingText = styled.div`
  text-align: center;
  font-size: 1.3rem;
  color: ${colors.dark};
  margin-top: 1.5rem;
  font-weight: 600;
  
  span {
    color: ${colors.primary};
  }
`;

const ProductFeedback = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  // State for user input
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [animateStars, setAnimateStars] = useState(false);
  
  // State for storing feedback entries and product details
  const [feedbackList, setFeedbackList] = useState([]);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ref, inView] = useInView({ triggerOnce: true });
  
  const commentMaxLength = 500;
  const formRef = useRef(null);
  
  // API URL - Change this to match your server URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5200/api';
  
  // Add notification
  const addNotification = (message, type) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  };
  
  // Remove notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  // Fetch product details and feedback when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch product details
        const productResponse = await fetch(`${API_URL}/products/${productId}`);
        if (!productResponse.ok) {
          throw new Error('Failed to fetch product');
        }
        const productData = await productResponse.json();
        setProduct(productData);
        
        // Fetch feedback for this product
        const feedbackResponse = await fetch(`${API_URL}/feedback?productId=${productId}`);
        if (!feedbackResponse.ok) {
          throw new Error('Failed to fetch feedback');
        }
        const feedbackData = await feedbackResponse.json();
        setFeedbackList(feedbackData);
      } catch (err) {
        setError('Error loading data: ' + err.message);
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [productId]);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (rating === 0) {
      setError('Please select a rating');
      setAnimateStars(true);
      setTimeout(() => setAnimateStars(false), 1000);
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    if (!name.trim()) {
      setError('Please enter your name');
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    if (!comment.trim()) {
      setError('Please enter your feedback');
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    if (comment.length > commentMaxLength) {
      setError(`Feedback exceeds maximum length of ${commentMaxLength} characters`);
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    // Create new feedback entry
    const newFeedback = {
      productId: parseInt(productId),
      name,
      rating,
      comment
    };
    
    // Submit to API
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFeedback),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }
      
      // Reset form
      setRating(0);
      setHoverRating(0);
      setComment('');
      setName('');
      
      // Show success notification
      addNotification('Feedback submitted successfully!', 'success');
      
      // Refresh feedback list
      const feedbackResponse = await fetch(`${API_URL}/feedback?productId=${productId}`);
      const feedbackData = await feedbackResponse.json();
      setFeedbackList(feedbackData);
      
    } catch (err) {
      setError('Error submitting feedback: ' + err.message);
      addNotification('Failed to submit feedback', 'error');
      console.error('Submit error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get rating text based on selected stars
  const getRatingText = () => {
    if (rating === 0 && hoverRating === 0) return 'Select your rating';
    const currentRating = hoverRating || rating;
    
    const ratingTexts = {
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };
    
    return ratingTexts[currentRating] || '';
  };

  if (isLoading && !product) {
    return (
      <PageContainer>
        <FeedbackContainer>
          <Spinner size={32} />
        </FeedbackContainer>
      </PageContainer>
    );
  }

  if (!product) {
    return (
      <PageContainer>
        <BackButton onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back to Products
        </BackButton>
        <FeedbackContainer>
          <ErrorMessage>
            <FaExclamationTriangle size={20} />
            Product not found
          </ErrorMessage>
        </FeedbackContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <NotificationContainer>
        <AnimatePresence>
          {notifications.map(notification => (
            <Notification
              key={notification.id}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={notification.type}
            >
              {notification.type === 'success' ? (
                <FaCheckCircle size={24} />
              ) : (
                <FaExclamationTriangle size={24} />
              )}
              {notification.message}
              <CloseButton onClick={() => removeNotification(notification.id)}>
                <FaTimes />
              </CloseButton>
            </Notification>
          ))}
        </AnimatePresence>
      </NotificationContainer>
      
      <BackButton onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back to Product
      </BackButton>
      
      <FeedbackContainer ref={ref}>
        <FeedbackTitle>
          Rate and Review: <span>{product.product_name}</span>
        </FeedbackTitle>
        
        {/* <ProductTitle>{product.product_name}</ProductTitle>
        {product.description && (
          <ProductDescription>{product.description}</ProductDescription>
        )} */}
        
        {/* Display error message if any */}
        <AnimatePresence>
          {error && (
            <ErrorMessage
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FaExclamationTriangle size={20} />
              {error}
            </ErrorMessage>
          )}
        </AnimatePresence>
        
        {/* Rating and Feedback Form */}
        <FeedbackForm
          onSubmit={handleSubmit}
          ref={formRef}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <FormGroup>
            <FormLabel>
              <FaUser />
              Your Name
            </FormLabel>
            <FormInput
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              disabled={isLoading}
              maxLength={50}
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>
              <FaStar />
              Rating
            </FormLabel>
            <StarRating>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarButton
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  filled={star <= (hoverRating || rating)}
                  disabled={isLoading}
                  starValue={star}
                  aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                  shouldAnimate={animateStars && rating === 0}
                >
                  {star <= (hoverRating || rating) ? <FaStar /> : <FaRegStar />}
                </StarButton>
              ))}
            </StarRating>
            <RatingText>
              {getRatingText()} {rating > 0 && <span>({rating} stars)</span>}
            </RatingText>
          </FormGroup>
          
          <FormGroup>
            <FormLabel>
              <IoMdSend />
              Your Feedback
            </FormLabel>
            <FormTextarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              disabled={isLoading}
              maxLength={commentMaxLength}
            />
            <CharacterCount 
              count={comment.length} 
              max={commentMaxLength}
            >
              {comment.length}/{commentMaxLength} characters
            </CharacterCount>
          </FormGroup>
          
          <SubmitButton
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={isLoading || !name.trim() || !comment.trim() || rating === 0}
          >
            {isLoading ? (
              <>
                <Spinner />
                Submitting...
              </>
            ) : (
              <>
                <IoMdSend />
                Submit Feedback
              </>
            )}
          </SubmitButton>
        </FeedbackForm>
        
        {/* Feedback Display Section */}
        <div>
          <FeedbackSubtitle>
            <FaThumbsUp />
            Recent Feedback
            {isLoading && <Spinner />}
          </FeedbackSubtitle>
          
          {feedbackList.length === 0 && !isLoading ? (
            <FeedbackEmpty
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <FaQuoteLeft size={48} />
              No feedback yet. Be the first to share your thoughts!
            </FeedbackEmpty>
          ) : (
            <FeedbackList>
              <AnimatePresence>
                {feedbackList.map((item, index) => (
                  <FeedbackItem
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <FeedbackHeader>
                      <FeedbackAuthor>
                        <FaUser />
                        {item.name}
                      </FeedbackAuthor>
                      <FeedbackDate>
                        <FaCalendarAlt />
                        {new Date(item.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </FeedbackDate>
                    </FeedbackHeader>
                    <StarsDisplay>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          filled={star <= item.rating}
                          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
                        >
                          {star <= item.rating ? <FaStar /> : <FaRegStar />}
                        </Star>
                      ))}
                    </StarsDisplay>
                    <FeedbackComment>{item.comment}</FeedbackComment>
                  </FeedbackItem>
                ))}
              </AnimatePresence>
            </FeedbackList>
          )}
        </div>
      </FeedbackContainer>
    </PageContainer>
  );
};

export default ProductFeedback;
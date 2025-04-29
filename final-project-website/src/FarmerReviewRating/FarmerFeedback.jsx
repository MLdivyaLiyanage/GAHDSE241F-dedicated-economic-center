import { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { 
  FaStar, FaRegStar, FaUser, FaCalendarAlt, 
  FaSpinner, FaCheckCircle, FaExclamationTriangle,
  FaThumbsUp, FaQuoteLeft, FaTimes
} from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// STYLED COMPONENTS
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const FeedbackContainer = styled(motion.div)`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const FeedbackTitle = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  
  span {
    color: #4a90e2;
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 100%;
      height: 4px;
      background-color: #4a90e2;
      border-radius: 2px;
    }
  }
`;

const FeedbackSubtitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.75rem;
  margin: 2.5rem 0 1.5rem;
  color: #333;
  
  svg {
    color: #4a90e2;
  }
`;

const FeedbackForm = styled(motion.form)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #555;
  
  svg {
    color: #4a90e2;
  }
`;

const FormInput = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const FormTextarea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  min-height: 120px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const CharacterCount = styled.div`
  align-self: flex-end;
  font-size: 0.875rem;
  color: ${props => props.count > props.max * 0.9 ? '#e74c3c' : '#888'};
`;

const StarRating = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const shakeAnimation = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  50% { transform: translateX(10px); }
  75% { transform: translateX(-10px); }
  100% { transform: translateX(0); }
`;

const StarButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 2rem;
  color: ${props => props.filled ? '#ffc107' : '#ccc'};
  transition: transform 0.2s, color 0.2s;
  animation: ${props => props.shouldAnimate ? shakeAnimation : 'none'} 0.5s ease;
  
  &:hover {
    transform: ${props => props.disabled ? 'none' : 'scale(1.2)'};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const Star = styled.span`
  color: ${props => props.filled ? '#ffc107' : '#ccc'};
  font-size: 1.25rem;
`;

const RatingText = styled.div`
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
  
  span {
    font-weight: 600;
  }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Spinner = styled(FaSpinner)`
  animation: ${spin} 1s linear infinite;
`;

const SubmitButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #3a70b2;
  }
  
  &:disabled {
    background-color: #a0c4f2;
    cursor: not-allowed;
  }
`;

const FeedbackList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FeedbackItem = styled(motion.div)`
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
`;

const FeedbackHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const FeedbackAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #333;
  
  svg {
    color: #4a90e2;
  }
`;

const FeedbackDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #666;
  
  svg {
    color: #4a90e2;
  }
`;

const FeedbackComment = styled.div`
  margin-top: 1rem;
  color: #444;
  line-height: 1.6;
`;

const StarsDisplay = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 300px;
`;

const Notification = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  
  &.success {
    border-left: 5px solid #2ecc71;
    svg:first-child {
      color: #2ecc71;
    }
  }
  
  &.error {
    border-left: 5px solid #e74c3c;
    svg:first-child {
      color: #e74c3c;
    }
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #999;
  margin-left: auto;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #333;
  }
`;

const ErrorMessage = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background-color: #fde8e8;
  color: #e53e3e;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const FeedbackEmpty = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
  padding: 3rem;
  color: #888;
  background-color: #f8f9fa;
  border-radius: 8px;
  
  svg {
    opacity: 0.5;
  }
`;

const RatingAndFeedback = () => {
  // State for user input
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [animateStars, setAnimateStars] = useState(false);
  
  // State for storing feedback entries
  const [feedbackList, setFeedbackList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ref, inView] = useInView({ triggerOnce: true });
  
  const commentMaxLength = 500;
  const formRef = useRef(null);
  
  // API URL - Updated to match backend port 5100
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5100/api';
  
  // Add notification
  const addNotification = (message, type) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  };
  
  // Remove notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  // Fetch existing feedback when component mounts
  useEffect(() => {
    fetchFeedback();
  }, []);
  
  // Improved fetchFeedback function
  const fetchFeedback = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/feedback`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const { success, data, message } = await response.json();
      
      if (!success) {
        throw new Error(message || 'Failed to fetch feedback');
      }
      
      setFeedbackList(data);
    } catch (err) {
      setError('Error loading feedback: ' + err.message);
      console.error('Fetch error:', err);
      addNotification('Failed to load feedback. Is the server running?', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Improved handleSubmit function
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
      name,
      rating,
      comment,
      date: new Date().toISOString()
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const { success, data, message } = await response.json();
      
      if (!success) {
        throw new Error(message || 'Failed to submit feedback');
      }
      
      // Reset form
      setRating(0);
      setHoverRating(0);
      setComment('');
      setName('');
      
      // Show success notification
      addNotification('Feedback submitted successfully!', 'success');
      
      // Refresh feedback list
      await fetchFeedback();
      
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
      
      <FeedbackContainer ref={ref}>
        <FeedbackTitle>
          Share Your <span>Experience</span>
        </FeedbackTitle>
        
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
              placeholder="Share your experience in detail..."
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

export default RatingAndFeedback;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FarmerFeedback.css';

const RatingAndFeedback = () => {
  // React Router navigation hook
  const navigate = useNavigate();
  
  // State for user input
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  
  // State for storing feedback entries
  const [feedbackList, setFeedbackList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // API URL - Change this to match your server URL
  const API_URL = 'http://localhost:5000/api';
  
  // Fetch existing feedback when component mounts
  useEffect(() => {
    fetchFeedback();
  }, []);
  
  // Function to fetch all feedback from API
  const fetchFeedback = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/feedback`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch feedback');
      }
      
      const data = await response.json();
      setFeedbackList(data);
    } catch (err) {
      setError('Error loading feedback: ' + err.message);
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (rating === 0 || !comment.trim() || !name.trim()) {
      alert('Please provide a rating, your name, and a comment');
      return;
    }
    
    // Create new feedback entry
    const newFeedback = {
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
      setComment('');
      setName('');
      
      // Refresh feedback list
      fetchFeedback();
      
    } catch (err) {
      setError('Error submitting feedback: ' + err.message);
      console.error('Submit error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle back button click
  const handleBack = () => {
    navigate('/farmer'); // Navigate to the profile page
  };
  
  return (
    <div className="feedback-container">
      {/* Back button */}
      <div className="back-button-container">
        <button 
          className="back-button" 
          onClick={handleBack}
        >
          ← Back to Profile
        </button>
      </div>
      
      <h2 className="feedback-title">Rate and Share Your Feedback</h2>
      
      {/* Display error message if any */}
      {error && <div className="error-message">{error}</div>}
      
      {/* Rating and Feedback Form */}
      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-group">
          <label className="form-label">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            placeholder="Enter your name"
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Rating</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`star-btn ${star <= rating ? 'star-filled' : ''}`}
                disabled={isLoading}
              >
                {star <= rating ? "★" : "☆"}
              </button>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">Your Feedback</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="form-textarea"
            rows="3"
            placeholder="Share your experience..."
            disabled={isLoading}
          ></textarea>
        </div>
        
        <button
          type="submit"
          className="submit-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
      
      {/* Feedback Display Section */}
      <div>
        <h3 className="feedback-subtitle">
          Recent Feedback
          {isLoading && ' (Loading...)'}
        </h3>
        
        {feedbackList.length === 0 ? (
          <p className="feedback-empty">No feedback yet. Be the first to share!</p>
        ) : (
          <div className="feedback-list">
            {feedbackList.map((item) => (
              <div key={item.id} className="feedback-item">
                <div className="feedback-header">
                  <span className="feedback-author">{item.name}</span>
                  <span className="feedback-date">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="stars-display">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={`star ${star <= item.rating ? 'star-filled' : ''}`}>
                      {star <= item.rating ? "★" : "☆"}
                    </span>
                  ))}
                </div>
                <p className="feedback-comment">{item.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingAndFeedback;
import  { useState } from 'react';
import './Feedback.css'; // Import the CSS file

const RatingAndFeedback = () => {
  // State for user input
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  
  // State for storing feedback entries
  const [feedbackList, setFeedbackList] = useState([]);
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate input
    if (rating === 0 || !comment.trim() || !name.trim()) {
      alert('Please provide a rating, your name, and a comment');
      return;
    }
    
    // Create new feedback entry
    const newFeedback = {
      id: Date.now(),
      name,
      rating,
      comment,
      date: new Date().toLocaleDateString()
    };
    
    // Add to feedback list
    setFeedbackList([newFeedback, ...feedbackList]);
    
    // Reset form
    setRating(0);
    setComment('');
    setName('');
  };
  
  return (
    <div className="feedback-container">
      <h2 className="feedback-title">Rate and Share Your Feedback</h2>
      
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
          ></textarea>
        </div>
        
        <button
          type="submit"
          className="submit-btn"
        >
          Submit Feedback
        </button>
      </form>
      
      {/* Feedback Display Section */}
      <div>
        <h3 className="feedback-subtitle">Recent Feedback</h3>
        
        {feedbackList.length === 0 ? (
          <p className="feedback-empty">No feedback yet. Be the first to share!</p>
        ) : (
          <div className="feedback-list">
            {feedbackList.map((item) => (
              <div key={item.id} className="feedback-item">
                <div className="feedback-header">
                  <span className="feedback-author">{item.name}</span>
                  <span className="feedback-date">{item.date}</span>
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
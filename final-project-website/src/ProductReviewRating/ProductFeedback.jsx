import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductFeedback.css';

const ProductFeedback = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [feedbackList, setFeedbackList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  
  const API_URL = 'http://localhost:5000/api';
  
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
        setError(err.message);
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [productId]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0 || !comment.trim() || !name.trim()) {
      alert('Please provide a rating, your name, and a comment');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: parseInt(productId),
          name,
          rating,
          comment
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }
      
      // Refresh feedback list
      const feedbackResponse = await fetch(`${API_URL}/feedback?productId=${productId}`);
      const feedbackData = await feedbackResponse.json();
      setFeedbackList(feedbackData);
      
      // Reset form
      setRating(0);
      setComment('');
      setName('');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading && !product) {
    return <div className="feedback-container">Loading product details...</div>;
  }
  
  if (!product) {
    return (
      <div className="feedback-container">
        <button onClick={() => navigate(-1)} className="back-button">
          &larr; Back to Product
        </button>
        <div className="error-message">Product not found</div>
      </div>
    );
  }
  
  return (
    <div className="feedback-container">
      <button onClick={() => navigate(-1)} className="back-button">
        &larr; Back to Product
      </button>
      
      <h2 className="feedback-title">Rate and Review: {product.product_name}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
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

// Changed from RatingAndFeedback to ProductFeedback
export default ProductFeedback;
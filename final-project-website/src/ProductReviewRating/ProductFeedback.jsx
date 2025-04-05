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
        {/* Form fields remain the same */}
      </form>
      
      {/* Feedback display section remains the same */}
    </div>
  );
};

export default ProductFeedback;
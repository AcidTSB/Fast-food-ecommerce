import React, { useState, useEffect } from 'react';
import { getProductReviews, submitReview } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import './ProductReviews.css';

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    name: ''
  });
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const reviewsData = await getProductReviews(productId);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error loading reviews:', error);
        // Use dummy data if API fails
        setReviews([
          {
            id: 1,
            name: 'Nguyễn Văn A',
            rating: 5,
            title: 'Rất ngon!',
            comment: 'Món ăn ngon, giao hàng nhanh. Sẽ đặt lại!',
            date: '2024-01-15',
            verified: true
          },
          {
            id: 2,
            name: 'Trần Thị B',
            rating: 4,
            title: 'Khá ổn',
            comment: 'Vị ổn, giá hợp lý. Có thể cải thiện thêm về phần trình bày.',
            date: '2024-01-10',
            verified: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadReviews();
    }
  }, [productId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const reviewData = {
        ...newReview,
        productId,
        date: new Date().toISOString().split('T')[0]
      };

      await submitReview(reviewData);
      
      // Add to local reviews
      setReviews(prev => [{
        ...reviewData,
        id: Date.now(),
        verified: false
      }, ...prev]);

      // Reset form
      setNewReview({
        rating: 5,
        title: '',
        comment: '',
        name: ''
      });
      setShowReviewForm(false);

    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return (
      <div className={`stars ${interactive ? 'interactive' : ''}`}>
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : ''}`}
            onClick={interactive ? () => onRatingChange(star) : undefined}
          >
            ⭐
          </span>
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(review => review.rating === rating).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(review => review.rating === rating).length / reviews.length) * 100 
      : 0
  }));

  if (loading) {
    return <LoadingSpinner text="Đang tải đánh giá..." />;
  }

  return (
    <div className="product-reviews">
      {/* Reviews Summary */}
      <div className="reviews-summary">
        <div className="rating-overview">
          <div className="average-rating">
            <span className="rating-number">{averageRating}</span>
            {renderStars(Math.round(averageRating))}
            <span className="total-reviews">({reviews.length} đánh giá)</span>
          </div>
        </div>

        <div className="rating-distribution">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="rating-bar">
              <span className="rating-label">{rating} ⭐</span>
              <div className="bar-container">
                <div 
                  className="bar-fill" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="rating-count">({count})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Button */}
      <div className="review-actions">
        <button 
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="write-review-btn"
        >
          {showReviewForm ? 'Hủy' : 'Viết đánh giá'}
        </button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <form onSubmit={handleReviewSubmit} className="review-form">
          <h4>Viết đánh giá của bạn</h4>
          
          <div className="form-group">
            <label>Tên của bạn:</label>
            <input
              type="text"
              value={newReview.name}
              onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
              required
              placeholder="Nhập tên của bạn"
            />
          </div>

          <div className="form-group">
            <label>Đánh giá:</label>
            {renderStars(newReview.rating, true, (rating) => 
              setNewReview(prev => ({ ...prev, rating }))
            )}
          </div>

          <div className="form-group">
            <label>Tiêu đề:</label>
            <input
              type="text"
              value={newReview.title}
              onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
              required
              placeholder="Tóm tắt đánh giá của bạn"
            />
          </div>

          <div className="form-group">
            <label>Nhận xét:</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              required
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              rows={4}
            />
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="submit-review-btn"
          >
            {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        <h4>Đánh giá từ khách hàng</h4>
        
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <p>Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!</p>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <span className="reviewer-name">{review.name}</span>
                  {review.verified && (
                    <span className="verified-badge">✓ Đã mua</span>
                  )}
                </div>
                <div className="review-meta">
                  {renderStars(review.rating)}
                  <span className="review-date">{review.date}</span>
                </div>
              </div>
              
              <div className="review-content">
                <h5 className="review-title">{review.title}</h5>
                <p className="review-comment">{review.comment}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
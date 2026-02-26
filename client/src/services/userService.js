/**
 * User Service - Handles user-related API calls
 */

import { getUserOrders as apiGetUserOrders, cancelOrder as apiCancelOrder } from './api';

/**
 * Fetch user statistics (orders, points, ratings)
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} - User stats object
 */
export const fetchUserStats = async (userId) => {
  try {
    // In a real app, you would call an API endpoint
    // For now, we're using the getUserOrders API and calculating stats from there
    const response = await apiGetUserOrders();
    
    if (response.success) {
      const orders = response.data || [];
      
      // Only count orders not in cancelled state
      const orderCount = orders.filter(order => order.status !== 'cancelled').length;
      
      // Calculate points - points based on order value
      let totalPoints = 0;
      orders.forEach(order => {
        if (order.status !== 'cancelled') {
          totalPoints += calculatePointsForOrder(order);
        }
      });
      
      // Calculate average rating if available
      let averageRating = 0;
      let ratingCount = 0;
      
      orders.forEach(order => {
        if (order.rating) {
          averageRating += order.rating;
          ratingCount++;
        }
      });
      
      if (ratingCount > 0) {
        averageRating = averageRating / ratingCount;
      } else {
        averageRating = 5.0; // Default rating for new users
      }
      
      // Determine tier based on points
      let tier = 'bronze';
      if (totalPoints >= 15000) {
        tier = 'gold';
      } else if (totalPoints >= 5000) {
        tier = 'silver';
      }
      
      return {
        success: true,
        data: {
          orderCount,
          totalPoints,
          averageRating,
          tier
        }
      };
    }
    
    return {
      success: false,
      message: 'Failed to fetch user statistics'
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return {
      success: false,
      message: 'Error processing user statistics'
    };
  }
};

/**
 * Calculate points for an order
 * @param {Object} order - The order object
 * @returns {number} - Points earned
 */
const calculatePointsForOrder = (order) => {
  // Base points
  let points = 100;
  
  // Points based on order value (10 points per 10,000 VND)
  const valuePoints = Math.floor((order.final_amount || 0) / 10000) * 10;
  
  return points + valuePoints;
};

/**
 * Redeem points for a coupon or discount
 * @param {string} userId - The user ID
 * @param {number} points - Points to redeem
 * @returns {Promise<Object>} - Result with coupon code
 */
export const redeemPoints = async (userId, points) => {
  try {
    // In a real app, you would call an API endpoint
    // For now, we'll just simulate a successful redemption
    
    // Generate a random coupon code
    const couponCode = `FAST${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    // Calculate discount amount (1000 points = 10,000 VND)
    const discountAmount = (points / 1000) * 10000;
    
    // Set expiry date (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    
    return {
      success: true,
      data: {
        couponCode,
        discountAmount,
        expiresAt,
        pointsRedeemed: points
      }
    };
  } catch (error) {
    console.error('Error redeeming points:', error);
    return {
      success: false,
      message: 'Failed to redeem points'
    };
  }
};

/**
 * Get user orders
 * @returns {Promise<Object>} - User orders
 */
export const getUserOrders = async () => {
  try {
    return await apiGetUserOrders();
  } catch (error) {
    console.error('Error getting user orders:', error);
    return {
      success: false,
      message: 'Failed to fetch user orders'
    };
  }
};

/**
 * Cancel an order
 * @param {string} orderId - The order ID to cancel
 * @returns {Promise<Object>} - Result of the cancellation
 */
export const cancelOrder = async (orderId) => {
  try {
    return await apiCancelOrder(orderId);
  } catch (error) {
    console.error('Error cancelling order:', error);
    return {
      success: false,
      message: 'Failed to cancel order'
    };
  }
};
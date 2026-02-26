import { useState, useCallback } from 'react';
import * as orderService from '../services/orderService';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const fetchOrders = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      console.log('📥 Fetching orders with params:', params);
      
      const response = await orderService.getAllOrders(params);
      
      // Kiểm tra phản hồi
      if (response.success === false) {
        throw new Error(response.message || 'Không thể tải danh sách đơn hàng');
      }
      
      console.log('📦 Orders fetched:', response.data?.length || 0);
      
      setOrders(response.data || []);
      return response;
    } catch (err) {
      console.error('❌ Error fetching orders:', err);
      setError(err.message || 'Không thể tải danh sách đơn hàng');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrderById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.getOrderById(id);
      
      if (response.success === false) {
        throw new Error(response.message || 'Không thể tải chi tiết đơn hàng');
      }
      
      return response.data;
    } catch (err) {
      setError(err.message || 'Không thể tải chi tiết đơn hàng');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderStatus = useCallback(async (id, status, notes = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.updateOrderStatus(id, status, notes);
      
      if (response.success === false) {
        throw new Error(response.message || 'Không thể cập nhật trạng thái đơn hàng');
      }
      
      // Update order in state
      setOrders(prev => 
        prev.map(order => 
          order.id === parseInt(id) 
            ? { ...order, status: status, notes: notes }
            : order
        )
      );
      
      return response;
    } catch (err) {
      setError(err.message || 'Không thể cập nhật trạng thái đơn hàng');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.getOrderStats();
      
      if (response.success === false) {
        throw new Error(response.message || 'Không thể tải thống kê đơn hàng');
      }
      
      setStats(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Không thể tải thống kê đơn hàng');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    orders,
    loading,
    error,
    stats,
    fetchOrders,
    getOrderById,
    updateOrderStatus,
    fetchStats
  };
};
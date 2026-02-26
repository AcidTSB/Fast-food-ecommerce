import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { API_URL } from '../config';
import { useAuth } from './AuthContext';

const OrderNotificationContext = createContext();

export const useOrderNotifications = () => useContext(OrderNotificationContext);

export const OrderNotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [newOrders, setNewOrders] = useState([]);
  const [socket, setSocket] = useState(null);

  // Khởi tạo kết nối socket khi admin đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      const newSocket = io(`${API_URL}`, {
        auth: {
          token: localStorage.getItem('adminToken')
        }
      });
      setSocket(newSocket);
      
      // Dọn dẹp khi component unmount
      return () => newSocket.disconnect();
    }
  }, [isAuthenticated]);

  // Lắng nghe sự kiện đơn hàng mới
  useEffect(() => {
    if (!socket) return;

    socket.on('new-order', (order) => {
      // Thêm đơn hàng mới vào danh sách
      setNewOrders(prev => [order, ...prev]);
      
      // Hiển thị thông báo cho admin
      const notification = new Notification('Đơn hàng mới', {
        body: `Từ khách hàng: ${order.customerName}`
      });
      
      // Click vào thông báo sẽ mở trang chi tiết đơn hàng
      notification.onclick = () => {
        window.open(`/orders/${order._id}`);
      };
    });

    return () => {
      socket.off('new-order');
    };
  }, [socket]);

  // Đánh dấu đơn hàng đã xem
  const markOrderAsSeen = (orderId) => {
    setNewOrders(prev => prev.filter(order => order._id !== orderId));
  };

  const value = {
    newOrders,
    markOrderAsSeen,
  };

  return (
    <OrderNotificationContext.Provider value={value}>
      {children}
    </OrderNotificationContext.Provider>
  );
};
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/helpers';
import './RecentOrders.css';

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // For demo purposes, create some dummy data
        const dummyOrders = [
          {
            id: '1001',
            customer: 'John Doe',
            total: 42.99,
            status: 'Completed',
            date: new Date().toISOString(),
          },
          {
            id: '1002',
            customer: 'Jane Smith',
            total: 35.50,
            status: 'Pending',
            date: new Date().toISOString(),
          },
          {
            id: '1003',
            customer: 'Robert Johnson',
            total: 29.99,
            status: 'Processing',
            date: new Date().toISOString(),
          },
          {
            id: '1004',
            customer: 'Emily Davis',
            total: 55.75,
            status: 'Shipped',
            date: new Date().toISOString(),
          },
        ];

        // Wait for a short delay to simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setOrders(dummyOrders);
      } catch (error) {
        console.error('Error fetching recent orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="orders-loading">Loading recent orders...</div>;
  }

  return (
    <div className="recent-orders-container">
      <table className="recent-orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                <Link to={`/orders/${order.id}`}>#{order.id}</Link>
              </td>
              <td>{order.customer}</td>
              <td>${order.total.toFixed(2)}</td>
              <td>
                <span className={`order-status status-${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </td>
              <td>{formatDate(order.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/orders" className="view-all-link">
        View all orders
      </Link>
    </div>
  );
};

export default RecentOrders;
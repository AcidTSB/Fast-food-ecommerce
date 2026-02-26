import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getUserOrders } from '../../services/orderService'; // ĐÚNG nếu dùng backend thật
import LoadingSpinner from '../common/LoadingSpinner';
import './OrderHistory.css';

const OrderHistory = ({ orders: propOrders }) => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState(propOrders || []);
    const [loading, setLoading] = useState(!propOrders);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Only fetch if orders weren't passed as props
        if (propOrders) {
            setOrders(propOrders);
            setLoading(false);
            return;
        }

        const fetchOrderHistory = async () => {
            try {
                setLoading(true);
                if (!user?.id) {
                    setOrders([]);
                    return;
                }
                const response = await getUserOrders();
                setOrders(response.orders || response.data || []);
            } catch (err) {
                setError('Failed to fetch order history');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrderHistory();
        }
    }, [user, propOrders]);

    if (loading) {
        return <LoadingSpinner text="Loading order history..." />;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="order-history">
            <h2>Your Order History</h2>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <ul className="orders-list">
                    {orders.map(order => (
                        <li key={order.id} className="order-item">
                            <div className="order-header">
                                <h3>Order #{order.id}</h3>
                                <span className={`status ${order.status.toLowerCase()}`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="order-details">
                                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                <p>Total: ${order.total}</p>
                                <div className="order-items">
                                    {order.items && order.items.map(item => (
                                        <div key={item.id} className="order-product">
                                            <span>{item.name} x {item.quantity}</span>
                                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// Export both named and default
export { OrderHistory };
export default OrderHistory;
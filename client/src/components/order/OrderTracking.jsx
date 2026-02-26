import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderStatus } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const OrderTracking = () => {
    const { orderId } = useParams();
    const [orderStatus, setOrderStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderStatus = async () => {
            try {
                const status = await getOrderStatus(orderId);
                setOrderStatus(status);
            } catch (err) {
                setError('Failed to fetch order status.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderStatus();
    }, [orderId]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="order-tracking">
            <h2>Order Tracking</h2>
            <p>Order ID: {orderId}</p>
            <p>Status: {orderStatus}</p>
            {/* Additional order details can be displayed here */}
        </div>
    );
};

export default OrderTracking;
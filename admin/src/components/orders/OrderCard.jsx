import React from 'react';
import { formatDate } from '../../utils/helpers';
import StatusBadge from './StatusBadge';
import './OrderCard.css';

const OrderCard = ({ order, onViewDetails }) => {
  return (
    <div className="order-card">
      <div className="order-card-header">
        <h3>Order #{order.id}</h3>
        <StatusBadge status={order.status} />
      </div>
      <div className="order-card-details">
        <p><strong>Date:</strong> {formatDate(order.createdAt)}</p>
        <p><strong>Total:</strong> ${order.totalPrice.toFixed(2)}</p>
        <p><strong>Items:</strong> {order.items.length}</p>
      </div>
      <button className="view-details-btn" onClick={() => onViewDetails(order.id)}>
        View Details
      </button>
    </div>
  );
};

export default OrderCard;
import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ status }) => {
  const getStatusClass = () => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'processing':
        return 'status-processing';
      case 'shipping':
      case 'shipped':
        return 'status-shipping';
      case 'delivered':
      case 'completed':
        return 'status-delivered';
      case 'cancelled':
      case 'canceled':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  };

  return (
    <span className={`status-badge ${getStatusClass()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
export { StatusBadge };
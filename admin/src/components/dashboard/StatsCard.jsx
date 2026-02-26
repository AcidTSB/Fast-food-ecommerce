import React from 'react';
import PropTypes from 'prop-types';

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <div className={`stats-card ${color}`}>
      <div className="stats-card-icon">
        {icon}
      </div>
      <div className="stats-card-content">
        <h3 className="stats-card-title">{title}</h3>
        <p className="stats-card-value">{value}</p>
      </div>
    </div>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.element.isRequired,
  color: PropTypes.string,
};

StatsCard.defaultProps = {
  color: 'default',
};

export default StatsCard;
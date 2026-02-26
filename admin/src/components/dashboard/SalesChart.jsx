import React from 'react';
import './SalesChart.css';

const SalesChart = ({ data = [], loading = false }) => { // Default to empty array
  if (loading) {
    return <div className="chart-loading">Loading chart data...</div>;
  }

  // Ensure data is an array before mapping
  const chartData = Array.isArray(data) ? data : [];

  return (
    <div className="sales-chart">
      {chartData.length === 0 ? (
        <div className="no-data">No sales data available</div>
      ) : (
        <div className="chart-container">
          <div className="chart-bars">
            {chartData.map((item, index) => (
              <div 
                key={index} 
                className="chart-bar"
                style={{ 
                  height: `${(item.amount / Math.max(...chartData.map(d => d.amount || 0))) * 100}%` 
                }}
              >
                <div className="bar-tooltip">${item.amount}</div>
              </div>
            ))}
          </div>
          <div className="chart-labels">
            {chartData.map((item, index) => (
              <div key={index} className="chart-label">
                {item.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesChart;
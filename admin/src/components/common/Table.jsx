import React, { useState } from 'react';
import './Table.css';

const Table = ({
  columns,
  data,
  loading,
  emptyMessage = 'No data available',
  pagination = null,
  onRowClick = null,
  initialSort = null
}) => {
  const [sortConfig, setSortConfig] = useState(initialSort || { key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const sortedData = getSortedData();

  return (
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th 
                key={column.key}
                className={column.sortable ? `sortable ${sortConfig.key === column.key ? `sorted-${sortConfig.direction}` : ''}` : ''}
                onClick={column.sortable ? () => handleSort(column.key) : undefined}
                style={column.width ? { width: column.width } : {}}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="table-loading">
                Loading data...
              </td>
            </tr>
          ) : sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="table-empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row, rowIndex) => (
              <tr 
                key={row.id || rowIndex} 
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                style={onRowClick ? { cursor: 'pointer' } : {}}
              >
                {columns.map(column => (
                  <td key={column.key}>
                    {column.render
                      ? column.render({ value: row[column.accessor || column.key], row })
                      : row[column.accessor || column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      
      {pagination && (
        <div className="table-pagination">
          <div className="pagination-info">
            Showing {pagination.currentPage * pagination.pageSize - pagination.pageSize + 1} to {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} of {pagination.totalItems} entries
          </div>
          <div className="pagination-controls">
            <button 
              className="pagination-btn" 
              disabled={pagination.currentPage === 1}
              onClick={() => pagination.onPageChange(1)}
            >
              &laquo;
            </button>
            <button 
              className="pagination-btn" 
              disabled={pagination.currentPage === 1}
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            >
              &lsaquo;
            </button>
            
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              // Logic to show pages around current page
              let pageToShow = pagination.currentPage;
              if (pagination.currentPage <= 3) {
                pageToShow = i + 1;
              } else if (pagination.currentPage >= pagination.totalPages - 2) {
                pageToShow = pagination.totalPages - 4 + i;
              } else {
                pageToShow = pagination.currentPage - 2 + i;
              }
              
              // Ensure page number is valid
              if (pageToShow > 0 && pageToShow <= pagination.totalPages) {
                return (
                  <button 
                    key={pageToShow}
                    className={`pagination-btn ${pagination.currentPage === pageToShow ? 'active' : ''}`}
                    onClick={() => pagination.onPageChange(pageToShow)}
                  >
                    {pageToShow}
                  </button>
                );
              }
              return null;
            })}
            
            <button 
              className="pagination-btn" 
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            >
              &rsaquo;
            </button>
            <button 
              className="pagination-btn" 
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.totalPages)}
            >
              &raquo;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
export { Table };
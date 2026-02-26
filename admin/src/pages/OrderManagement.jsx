import React, { useEffect, useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import Table from '../components/common/Table';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { StatusBadge } from '../components/orders/StatusBadge';
import OrderDetail from '../components/orders/OrderDetail';
import Layout from '../components/layout/Layout';
import './OrderManagement.css';

const OrderManagement = () => {
  const { orders, loading, error, fetchOrders, updateOrderStatus } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [newStatus, setNewStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders({
      status: statusFilter !== 'all' ? statusFilter : undefined,
      search: searchTerm || undefined
    });
  }, [fetchOrders, statusFilter, searchTerm]);

  const handleStatusChange = async (orderId, newStatus) => {
    const success = await updateOrderStatus(orderId, newStatus);
    if (success) {
      setShowConfirmModal(false);
      setSelectedOrder(null);
      // Refresh orders
      fetchOrders({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchTerm || undefined
      });
    }
  };

  const openConfirmModal = (order, status) => {
    setSelectedOrder(order);
    setNewStatus(status);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setSelectedOrder(null);
  };

  const viewOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const handleRetry = () => {
    console.log('🔄 Retrying to fetch orders...');
    fetchOrders({
      status: statusFilter !== 'all' ? statusFilter : undefined,
      search: searchTerm || undefined
    });
  };

  return (
    <Layout pageTitle="Quản lý Đơn hàng">
      <div className="order-management">
        <div className="order-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm theo mã đơn hàng, tên khách hàng hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="status-filters">
            <button 
              className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`} 
              onClick={() => setStatusFilter('all')}
            >
              Tất cả
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`} 
              onClick={() => setStatusFilter('pending')}
            >
              Chờ xác nhận
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'confirmed' ? 'active' : ''}`} 
              onClick={() => setStatusFilter('confirmed')}
            >
              Đã xác nhận
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'preparing' ? 'active' : ''}`} 
              onClick={() => setStatusFilter('preparing')}
            >
              Đang chuẩn bị
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'delivering' ? 'active' : ''}`} 
              onClick={() => setStatusFilter('delivering')}
            >
              Đang giao
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'delivered' ? 'active' : ''}`} 
              onClick={() => setStatusFilter('delivered')}
            >
              Đã giao
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'cancelled' ? 'active' : ''}`} 
              onClick={() => setStatusFilter('cancelled')}
            >
              Đã hủy
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <LoadingSpinner />
            <p>Đang tải dữ liệu đơn hàng...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-message">
              <p>{error}</p>
              <button className="retry-button" onClick={handleRetry}>Thử lại</button>
            </div>
          </div>
        ) : (
          <>
            {Array.isArray(orders) && orders.length > 0 ? (
              <div className="table-container">
                <Table 
                  data={orders}
                  columns={[
                    { key: 'order_number', header: 'Mã đơn hàng', accessor: 'order_number',
                      render: ({ value, row }) => (
                        <div className="order-id" onClick={() => viewOrderDetail(row)}>
                          <span className="link-like">{value}</span>
                        </div>
                      )
                    },
                    { key: 'customer_name', header: 'Khách hàng', accessor: 'customer_name',
                      render: ({ value }) => <span>{value || 'N/A'}</span>
                    },
                    { key: 'delivery_phone', header: 'SĐT', accessor: 'delivery_phone' },
                    { key: 'created_at', header: 'Ngày đặt', accessor: 'created_at',
                      render: ({ value }) => {
                        const date = new Date(value);
                        return <span>{date.toLocaleDateString('vi-VN')} {date.toLocaleTimeString('vi-VN')}</span>;
                      }
                    },
                    { key: 'total_amount', header: 'Tổng tiền', accessor: 'total_amount',
                      render: ({ value }) => (
                        <span>{parseInt(value).toLocaleString()} VNĐ</span>
                      )
                    },
                    { key: 'status', header: 'Trạng thái', accessor: 'status',
                      render: ({ value }) => <StatusBadge status={value} />
                    },
                    { key: 'actions', header: 'Hành động',
                      render: ({ row }) => (
                        <div className="action-buttons">
                          {row.status === 'pending' && (
                            <>
                              <button
                                className="action-btn confirm-btn"
                                onClick={e => {
                                  e.stopPropagation();
                                  openConfirmModal(row, 'confirmed');
                                }}
                              >
                                Xác nhận
                              </button>
                              <button
                                className="action-btn cancel-btn"
                                onClick={e => {
                                  e.stopPropagation();
                                  openConfirmModal(row, 'cancelled');
                                }}
                              >
                                Hủy
                              </button>
                            </>
                          )}
                          
                          {row.status === 'confirmed' && (
                            <button
                              className="action-btn preparing-btn"
                              onClick={e => {
                                e.stopPropagation();
                                openConfirmModal(row, 'preparing');
                              }}
                            >
                              Chuẩn bị
                            </button>
                          )}
                          
                          {row.status === 'preparing' && (
                            <button
                              className="action-btn delivery-btn"
                              onClick={e => {
                                e.stopPropagation();
                                openConfirmModal(row, 'delivering');
                              }}
                            >
                              Giao hàng
                            </button>
                          )}
                          
                          {row.status === 'delivering' && (
                            <button
                              className="action-btn complete-btn"
                              onClick={e => {
                                e.stopPropagation();
                                openConfirmModal(row, 'delivered');
                              }}
                            >
                              Hoàn thành
                            </button>
                          )}
                          
                          <button
                            className="action-btn detail-btn"
                            onClick={e => {
                              e.stopPropagation();
                              viewOrderDetail(row);
                            }}
                          >
                            Chi tiết
                          </button>
                        </div>
                      )
                    }
                  ]}
                  getRowKey={row => row.id}
                />
              </div>
            ) : (
              <div className="empty-state">
                <p>Không tìm thấy đơn hàng nào</p>
              </div>
            )}
          </>
        )}

        {showConfirmModal && selectedOrder && (
          <ConfirmModal
            title="Xác nhận thay đổi trạng thái"
            message={`Bạn có chắc muốn ${newStatus === 'cancelled' ? 'hủy' : 'chuyển trạng thái'} đơn hàng ${selectedOrder.order_number} ${newStatus !== 'cancelled' ? `sang "${newStatus}"` : ''}?`}
            onConfirm={() => handleStatusChange(selectedOrder.id, newStatus)}
            onCancel={closeConfirmModal}
          />
        )}
        
        {showOrderDetail && selectedOrder && (
          <OrderDetail 
            order={selectedOrder}
            onClose={() => setShowOrderDetail(false)}
            onStatusChange={async (newStatus) => {
              await handleStatusChange(selectedOrder.id, newStatus);
              setShowOrderDetail(false);
            }}
          />
        )}
      </div>
    </Layout>
  );
};

export default OrderManagement;
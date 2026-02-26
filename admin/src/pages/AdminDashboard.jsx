import React from 'react';
import Layout from '../components/layout/Layout';
import StatsCard from '../components/dashboard/StatsCard';
import RecentOrders from '../components/dashboard/RecentOrders';
import SalesChart from '../components/dashboard/SalesChart';
import TopProducts from '../components/dashboard/TopProducts';

const AdminDashboard = () => {
  return (
    <Layout>
      <div className="admin-dashboard">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <div className="dashboard-stats">
          <StatsCard />
          <SalesChart />
        </div>
        <div className="dashboard-recent-orders">
          <h2>Recent Orders</h2>
          <RecentOrders />
        </div>
        <div className="dashboard-top-products">
          <h2>Top Products</h2>
          <TopProducts />
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
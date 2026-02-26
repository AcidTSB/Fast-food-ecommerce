import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from '../../pages/Dashboard';
import ProductManagement from '../../pages/ProductManagement';
import OrderManagement from '../../pages/OrderManagement';
import UserManagement from '../../pages/UserManagement';
import ReportsPage from '../../pages/ReportsPage';
import SettingsPage from '../../pages/SettingsPage';
import ProductDetail from '../../pages/ProductDetail';
import OrderDetail from '../../pages/OrderDetail';
import UserDetail from '../../pages/UserDetail';

const DashboardLayout = () => {
  return (
    <Layout>
      <Switch>
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/products" component={ProductManagement} />
        <Route path="/products/:id" component={ProductDetail} />
        <Route exact path="/orders" component={OrderManagement} />
        <Route path="/orders/:id" component={OrderDetail} />
        <Route exact path="/users" component={UserManagement} />
        <Route path="/users/:id" component={UserDetail} />
        <Route path="/reports" component={ReportsPage} />
        <Route path="/settings" component={SettingsPage} />
      </Switch>
    </Layout>
  );
};

export default DashboardLayout;
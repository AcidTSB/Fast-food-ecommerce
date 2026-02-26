import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import React, { Suspense } from 'react';
import useAuth from './hooks/useAuth'; // Thay đổi từ { useAuth } thành useAuth

import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import PrivateRoute from './components/auth/PrivateRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import LoadingSpinner from './components/common/LoadingSpinner';
import './styles/global.css';
import ProductManagement from './pages/ProductManagement';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import OrderManagement from './pages/OrderManagement';
import UserManagement from './pages/UserManagement';
import NotFound from './pages/NotFound';

const App = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Đang tải...</div>;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Suspense fallback={<div className="loading-container"><LoadingSpinner /></div>}>
            <Switch>
              <Route exact path="/login" render={() => 
                isAuthenticated ? <Redirect to="/dashboard" /> : <AdminLogin />
              } />
              
              <Route exact path="/" render={() => 
                isAuthenticated ? <Redirect to="/dashboard" /> : <Redirect to="/login" />
              } />

              {/* Protected Routes */}
              <Route path="/dashboard">
                <PrivateRoute>
                  <DashboardLayout />
                </PrivateRoute>
              </Route>
              <Route path="/products">
                <PrivateRoute>
                  <ProductManagement />
                </PrivateRoute>
              </Route>
              <Route path="/orders">
                <PrivateRoute>
                  <OrderManagement />
                </PrivateRoute>
              </Route>
              <Route path="/users">
                <PrivateRoute>
                  <UserManagement />
                </PrivateRoute>
              </Route>
              <Route path="/reports">
                <PrivateRoute>
                  <ReportsPage />  {/* Sử dụng ReportsPage thay vì DashboardLayout */}
                </PrivateRoute>
              </Route>
              <Route path="/settings">
                <PrivateRoute>
                  <SettingsPage />  {/* Sử dụng SettingsPage thay vì DashboardLayout */}
                </PrivateRoute>
              </Route>
              
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';

import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import About from './pages/About';
import Contact from './pages/Contact';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Checkout from './pages/Checkout';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy'; 
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Chatbot from './components/Chatbot';
import './styles/globals.css';

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <ThemeProvider>
          <Router>
            <div className="app">
              <Header />
              <main className="main-content">
                <Switch>
                  <Route path="/" exact component={Home} />
                  <Route path="/products" exact component={Products} />
                  <Route path="/products/:id" component={ProductDetail} />
                  <Route path="/cart" component={Cart} />
                  <Route path="/about" component={About} />
                  <Route path="/contact" component={Contact} />
                  <Route path="/login" component={LoginForm} />
                  <Route path="/register" component={RegisterForm} />
                  <Route path="/checkout" component={Checkout} />
                  <Route path="/terms" component={Terms} />
                  <Route path="/privacy" component={Privacy} />
                  <Route path="/orders" component={Orders} />
                  <Route path="/profile" component={Profile} />
                  <Route component={() => <div>Route not found</div>} />
                </Switch>
              </main>
              <Chatbot />
              <Footer />
            </div>
          </Router>
        </ThemeProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
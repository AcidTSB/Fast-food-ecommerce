import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/globals.css';

// Fix cho "process is not defined"
if (typeof window !== 'undefined' && !window.process) {
  window.process = {
    env: {
      NODE_ENV: 'development'
    }
  };
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
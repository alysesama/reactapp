import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import Fundamental from './fundamental/Fundamental';


const root = ReactDOM.createRoot(document.getElementById('root'));
const searchParams = new URLSearchParams(window.location.search);
const page = searchParams.get('page');
const shouldShowFundamental = page === 'fundamental';

root.render(
  <React.StrictMode>
    {shouldShowFundamental ? <Fundamental /> : <App />}
  </React.StrictMode>
);

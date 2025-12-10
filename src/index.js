import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import Fundamental from './fundamental/Fundamental';
import { registerServiceWorker, preloadAssets } from './gachalorant/helpers/cacheService';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        registerServiceWorker().then((registered) => {
            if (registered) {
                setTimeout(() => {
                    preloadAssets();
                }, 3000);
            }
        });
    });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
const searchParams = new URLSearchParams(window.location.search);
const page = searchParams.get('page');
const shouldShowFundamental = page === 'fundamental';

root.render(
  <React.StrictMode>
    {shouldShowFundamental ? <Fundamental /> : <App />}
  </React.StrictMode>
);

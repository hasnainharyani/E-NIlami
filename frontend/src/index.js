import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App.js';
import {UserContextProvider} from './ContextAPI/userContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UserContextProvider>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </UserContextProvider>
);
import React from 'react';
import { createRoot } from 'react-dom/client';
import Firstpage from './FirstPage/Firstpage.jsx';
import SingPage from './LoginPage/SingPage.jsx';


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SingPage/>
  </React.StrictMode>
);

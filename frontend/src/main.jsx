import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Shop from './Pages/Shop.jsx';
import Blogs from './Pages/Blogs.jsx';
import Contact from './Pages/Contact.jsx';
import Home from './Pages/Home.jsx';
import Register from './Pages/Register.jsx';
import Login from './Pages/Login.jsx';
import Admin from './Pages/Admin.jsx';



 // Adjust the path if necessary

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/shop', element: <Shop /> },
      { path: '/blogs', element: <Blogs /> },
      { path: '/contact', element: <Contact /> },
      { path: '/register', element: <Register /> },
      { path: '/login', element: <Login /> },
      { path: '/admin', element: <Admin /> },
   

    ],
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    
      <RouterProvider router={router}>
        
        
      </RouterProvider>
    
  </React.StrictMode>,
);

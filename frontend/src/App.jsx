import './App.css'
import { Outlet,useLocation} from 'react-router-dom';
import React, { useEffect } from 'react';
import Header from './Components/Header';



function App() {

  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case '/':
        document.title = 'DOTS';
        break;
      case '/shop':
        document.title = 'DOTS/Shop';
        break;
      case '/contact':
        document.title = 'DOTS/Contact';
        break;
      default:
        document.title = 'DOTS';
        break;
    }
  }, [location]);

  return (
    <div className='min-h-screen text-white bg-gray-950 '>
      <div className='sticky top-0 z-40 bg-gray-950'><Header></Header></div>
      
      
      <Outlet />
      
    </div>
  )
}

export default App

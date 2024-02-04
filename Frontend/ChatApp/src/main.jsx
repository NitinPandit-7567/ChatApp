import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './routes/home.jsx'
import Register from './routes/Register.jsx'
import Login from './routes/Login.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Messages from './routes/Messages.jsx'
// import App from './App.jsx'
// import './index.css'
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/Register',
    element: <Register />
  },
  {
    path: '/Login',
    element: <Login />
  },
  {
    path: '/Messages',
    element: <Messages />
  }
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

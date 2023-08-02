import React from 'react'
import ReactDOM from 'react-dom/client'

import {createBrowserRouter, RouterProvider} from 'react-router-dom'

import Login from './Componentes/Login';
import Cadastro from './Componentes/Cadastro';
import Home from './Componentes/Home';
import Header from './Componentes/Header';
import CadastroItem from './Componentes/CadastroItem';

import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login/>
  },
  {
    path: '/cadastro',
    element: <Cadastro/>
  },
  {
    path:'/home',
    element: <Header />,
    children: [
      {
        path: '/home',
        element: <Home/>
      },
      {
        path: '/home/cadastro-item',
        element: <CadastroItem />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

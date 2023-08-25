import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import AllProduct from './pages/AllProducts';
import NewProduct from './pages/NewProduct';
import ProductDetail from './pages/ProductDetail';
import MyCart from './pages/MyCart';
import ProtectedRoute from './pages/ProtectedRoute';
import MyProduct from './pages/MyProduct';
import EditMyProduct from './pages/EditMyProduct';
import ProductSearch from './pages/ProductSearch';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <AllProduct />
      },
      {
        path: '/products/new',
        element: (
            <NewProduct />
        )
      },
      {
        path: '/products/:id',
        element: <ProductDetail />
      },
      {
        path: '/carts',
        element: (
          <ProtectedRoute>
            <MyCart />
          </ProtectedRoute>
        )
      },
      {
        path: '/uploaded',
        element: (
            <MyProduct />
        )
      },
      {
        path: '/edit/:id',
        element: (
            <EditMyProduct />
        )
      },
      {
        path: '/search',
        element: (
            <ProductSearch />
        )
      },
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={ router } />
  </React.StrictMode>
);

reportWebVitals();

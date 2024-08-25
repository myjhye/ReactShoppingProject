import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import NotFound from './pages/NotFound';
import AllProduct from './pages/AllProducts';
import NewProduct from './pages/NewProduct';
import ProductDetail from './pages/ProductDetail';
import MyCart from './pages/MyCart';
import ProtectedRoute from './pages/ProtectedRoute';
import ProtectedRouteLoggedIn from './pages/ProtectedRouteLoggedIn'
import ProductSearch from './pages/ProductSearch';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Welcome from './pages/Welcome';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <AllProduct />
          </ProtectedRoute>
        )
      },
      {
        path: '/signup',
        element: (
          <ProtectedRouteLoggedIn>
            <Signup />
          </ProtectedRouteLoggedIn>
        )
      },
      {
        path: '/login',
        element: (
          <ProtectedRouteLoggedIn>
            <Login />
          </ProtectedRouteLoggedIn>
        )
      },
      {
        path: '/products/new',
        element: (
          <ProtectedRoute>
            <NewProduct />
          </ProtectedRoute>
        )
      },
      {
        path: '/products/:id',
        element: (
          <ProtectedRoute>
            <ProductDetail />
          </ProtectedRoute>
        )
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
        path: '/search/:searchTerm',
        element: (
          <ProtectedRoute>
            <ProductSearch />
          </ProtectedRoute>
        )
      },
      {
        path: '/welcome',
        element: (
            <Welcome />
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

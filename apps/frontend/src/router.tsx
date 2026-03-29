import { createBrowserRouter, RouterProvider, redirect } from 'react-router'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { Matakuliah } from './pages/Matakuliah'
import { RootLayout } from './layouts/RootLayout'
import { ProtectedRoute } from './lib/protected-route'
import { api } from './lib/api'

// React Router v7 configuration
// Learn more at https://reactrouter.com/start

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: 'login',
        Component: Login,
        loader: () => {
          // Redirect to dashboard if already logged in
          if (api.isAuthenticated()) {
            return redirect('/dashboard')
          }
          return null
        }
      },
      {
        path: 'register',
        Component: Register,
        loader: () => {
          // Redirect to dashboard if already logged in
          if (api.isAuthenticated()) {
            return redirect('/dashboard')
          }
          return null
        }
      },
      {
        path: 'dashboard',
        loader: () => {
          // Require authentication
          if (!api.isAuthenticated()) {
            return redirect('/login')
          }
          return null
        },
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'matakuliah',
        loader: () => {
          // Require authentication
          if (!api.isAuthenticated()) {
            return redirect('/login')
          }
          return null
        },
        element: (
          <ProtectedRoute>
            <Matakuliah />
          </ProtectedRoute>
        ),
      },
    ],
  },
])
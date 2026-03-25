import { createBrowserRouter, RouterProvider } from 'react-router'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Matakuliah } from './pages/Matakuliah'
import { RootLayout } from './layouts/RootLayout'

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
      },
      {
        path: 'dashboard',
        Component: Dashboard,
      },
      {
        path: 'matakuliah',
        Component: Matakuliah,
      },
    ],
  },
])

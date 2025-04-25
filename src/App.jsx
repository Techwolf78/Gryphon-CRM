import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './Components/Sidebar/Layout';
import Home from './Pages/Home';
import SalesKanban from './Components/Sales/SalesKanban';
import Placement from './Components/Placement/PlacementKanban';
import LearningAndDevelopment from './Pages/LearningAndDevelopment';
import CollegeTracker from './Pages/CollegeTracker';
import LoginPage from './Components/Auth/LoginPage';
import ProtectedRoute from './Components/Auth/ProtectedRoute';
import NotFoundPage from './Pages/NotFoundPage'; // Import 404 Page

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes for Admin (crm, ummi, shashi) */}
        <Route
          path="/"
          element={
            <ProtectedRoute
              allowed={[
                'crm@gmail.com',
                'ummi@gryphonacademy.co.in',
                'shashi@gryphonacademy.co.in',
              ]}
            >
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="tracker" element={<CollegeTracker />} />
        </Route>

        {/* Protected Routes for Sales */}
        <Route
          path="/sales"
          element={
            <ProtectedRoute
              allowed={[
                'crm@gmail.com',
                'sales@gmail.com',
                'ummi@gryphonacademy.co.in',
                'shashi@gryphonacademy.co.in',
              ]}
            >
              <Layout>
                <SalesKanban />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Protected Routes for Placement */}
        <Route
          path="/placement"
          element={
            <ProtectedRoute
              allowed={[
                'crm@gmail.com',
                'placement@gmail.com',
                'ummi@gryphonacademy.co.in',
                'shashi@gryphonacademy.co.in',
              ]}
            >
              <Layout>
                <Placement />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Protected Routes for Learning & Development */}
        <Route
          path="/learning-and-development"
          element={
            <ProtectedRoute
              allowed={[
                'crm@gmail.com',
                'landd@gmail.com',
                'ummi@gryphonacademy.co.in',
                'shashi@gryphonacademy.co.in',
              ]}
            >
              <Layout>
                <LearningAndDevelopment />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* 404 Not Found Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;

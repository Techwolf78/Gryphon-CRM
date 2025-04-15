import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Components/Layout';
import Home from './Pages/Home';
import SalesKanban from './Components/Sales/SalesKanban';
import Placement from './Components/Placement/PlacementKanban';
import LearningAndDevelopment from './Pages/LearningAndDevelopment';
import CollegeTracker from './Components/CollegeTracker';
import LoginPage from './Components/Auth/LoginPage';
import ProtectedRoute from './Components/Auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Route for Admin (crm, ummi, shashi) */}
        <Route path="/" element={<ProtectedRoute allowed={['crm@gmail.com', 'ummi@gryphonacademy.co.in', 'shashi@gryphonacademy.co.in']}><Layout /></ProtectedRoute>}>
          <Route index element={<Home />} />
          <Route path="tracker" element={<CollegeTracker />} />
        </Route>

        {/* Protected Routes for Sales, Placement, L&D */}
        <Route path="/sales" element={<ProtectedRoute allowed={['crm@gmail.com', 'sales@gmail.com', 'ummi@gryphonacademy.co.in', 'shashi@gryphonacademy.co.in']}><Layout><SalesKanban /></Layout></ProtectedRoute>} />
        <Route path="/placement" element={<ProtectedRoute allowed={['crm@gmail.com', 'placement@gmail.com', 'ummi@gryphonacademy.co.in', 'shashi@gryphonacademy.co.in']}><Layout><Placement /></Layout></ProtectedRoute>} />
        <Route path="/learning-and-development" element={<ProtectedRoute allowed={['crm@gmail.com', 'landd@gmail.com', 'ummi@gryphonacademy.co.in', 'shashi@gryphonacademy.co.in']}><Layout><LearningAndDevelopment /></Layout></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;

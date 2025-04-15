// App.js
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
        {/* Public login route */}
        <Route path="/login" element={<LoginPage onLogin={() => window.location.href = '/'} />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Home />} />
          <Route path="sales" element={<SalesKanban />} />
          <Route path="placement" element={<Placement />} />
          <Route path="learning-and-development" element={<LearningAndDevelopment />} />
          <Route path="tracker" element={<CollegeTracker />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

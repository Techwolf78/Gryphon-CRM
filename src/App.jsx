import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home'; // Import Home page
import SalesKanban from './Components/Sales/SalesKanban'; // Import SalesKanban page
import Placement from './Components/Placement/PlacementKanban'; // Import Placement page
import LearningAndDevelopment from './Pages/LearningAndDevelopment'; // Import Learning and Development page
import CollegeTracker from './Components/CollegeTracker'; // Import College Tracker page

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for Home page */}
        <Route path="/" element={<Home />} />
        
        {/* Route for SalesKanban */}
        <Route path="/sales" element={<SalesKanban />} />
        
        {/* Route for Placement */}
        <Route path="/placement" element={<Placement />} />
        
        {/* Route for Learning and Development */}
        <Route path="/learning-and-development" element={<LearningAndDevelopment />} />

        {/* Route for College Tracker */}
        <Route path="/tracker" element={<CollegeTracker />} />
      </Routes>
    </Router>
  );
}

export default App;

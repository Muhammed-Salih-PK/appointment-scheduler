import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CalendarProvider } from './context/CalendarContext';
import Layout from './components/Layout';
import Login from './components/Auth/Login';
import CalendarView from './components/Calendar/CalenderView';


function App() {
  return (
    <Router>
      <AuthProvider>
        <CalendarProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/calendar" element={<Layout><CalendarView /></Layout>} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </CalendarProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

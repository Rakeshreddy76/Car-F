import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './components/context/AuthContext';
import Navbar from './components/Layout/Navbar';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import CarList from './components/Cars/CarList';
import CarForm from './components/Cars/CarForm';
import CarDetail from './components/Cars/CarDetail';
import PrivateRoute from './components/Layout/PrivateRoute';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <div className="container mt-4">
                    <Routes>
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<PrivateRoute><CarList /></PrivateRoute>} />
                        <Route path="/cars/:id" element={<PrivateRoute><CarDetail /></PrivateRoute>} />
                        <Route path="/create" element={<PrivateRoute><CarForm /></PrivateRoute>} />
                        <Route path="/edit/:id" element={<PrivateRoute><CarForm /></PrivateRoute>} />
                        <Route path="*" element={<h2>404 Not Found</h2>} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;

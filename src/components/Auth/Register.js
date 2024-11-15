import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Alert, Card } from 'react-bootstrap';

const Register = () => {
    const { login, authAxios } = useContext(AuthContext);
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        console.log('Form Data:', form);
        try {
            const res = await authAxios.post('/auth/register', form);
            console.log('API Response:', res); 
            if (res?.data?.token) {
                login(res.data.token);
                navigate('/');
            } else {
                throw new Error('Invalid API response');
            }
        } catch (err) {
            console.error('API Error:', err); 
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <Card className="mx-auto" style={{ maxWidth: '500px' }}>
            <Card.Body>
                <h2 className="mb-4">Register</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="username" className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="username" 
                            value={form.username} 
                            onChange={handleChange} 
                            required 
                        />
                    </Form.Group>
                    <Form.Group controlId="email" className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control 
                            type="email" 
                            name="email" 
                            value={form.email} 
                            onChange={handleChange} 
                            required 
                        />
                    </Form.Group>
                    <Form.Group controlId="password" className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            name="password" 
                            value={form.password} 
                            onChange={handleChange} 
                            required 
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100">Register</Button>
                </Form>
                <div className="mt-3 text-center">
                    Already have an account? <Link to="/login">Login here</Link>
                </div>
            </Card.Body>
        </Card>
    );
};

export default Register;


import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Card, Button, Row, Col, Alert } from 'react-bootstrap';

const CarDetail = () => {
    const { id } = useParams();
    const { user, authAxios } = useContext(AuthContext);
    const [car, setCar] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchCar = async () => {
        try {
            const res = await authAxios.get(`/cars/${id}`);
            const fetchedCar = res.data;
            if (fetchedCar.user._id !== user.id) {
                setError('Not authorized to view this car');
                return;
            }
            setCar(fetchedCar);
        } catch (err) {
            setError(err.response.data.message || 'Failed to fetch car');
        }
    };

    useEffect(() => {
        fetchCar();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this car?')) {
            try {
                await authAxios.delete(`/cars/${id}`);
                navigate('/');
            } catch (err) {
                setError(err.response.data.message || 'Failed to delete car');
            }
        }
    };

    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!car) return <div>Loading...</div>;

    return (
        <div>
            <h2>{car.title}</h2>
            <Row className="mb-3">
                {car.images && car.images.map((img, index) => (
                    <Col md={4} key={index} className="mb-3">
                        <Card>
                            <Card.Img 
                                variant="top" 
                                src={`http://localhost:5000/${img}`} 
                                alt={`Car ${index + 1}`} 
                                style={{ height: '300px', objectFit: 'cover' }}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
            <p><strong>Description:</strong> {car.description}</p>
            <p><strong>Car Type:</strong> {car.tags.car_type}</p>
            <p><strong>Company:</strong> {car.tags.company}</p>
            <p><strong>Dealer:</strong> {car.tags.dealer}</p>
            <div className="mt-3">
                <Button as={Link} to={`/edit/${car._id}`} variant="warning" className="me-2">
                    Edit
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Delete
                </Button>
            </div>
        </div>
    );
};

export default CarDetail;

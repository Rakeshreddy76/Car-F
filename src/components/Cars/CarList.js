
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SearchBar from '../Search/SearchBar';
import { Card, Button, Row, Col } from 'react-bootstrap';

const CarList = () => {
    const { authAxios, user } = useContext(AuthContext);
    const [cars, setCars] = useState([]);
    const [search, setSearch] = useState('');

    const fetchCars = async () => {
        try {
            const res = await authAxios.get(`/cars${search ? `?search=${search}` : ''}`);
            const userCars = res.data.filter(car => car.user._id === user.id);
            setCars(userCars);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCars();
    }, [search]);

    return (
        <div>
            <h2>My Cars</h2>
            <SearchBar setSearch={setSearch} />
            <Row>
                {cars.map(car => (
                    <Col md={4} key={car._id} className="mb-4">
                        <Card>
                            {car.images && car.images.length > 0 && (
                                <Card.Img 
                                    variant="top" 
                                    src={`http://localhost:5000/${car.images[0]}`} 
                                    alt={car.title} 
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                            )}
                            <Card.Body>
                                <Card.Title>{car.title}</Card.Title>
                                <Card.Text>
                                    {car.description.substring(0, 100)}...
                                </Card.Text>
                                <Button as={Link} to={`/cars/${car._id}`} variant="primary">
                                    View Details
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default CarList;

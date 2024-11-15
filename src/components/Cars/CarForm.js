
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Alert, Card, Image } from 'react-bootstrap';

const CarForm = () => {
    const { user, authAxios } = useContext(AuthContext);
    const [form, setForm] = useState({
        title: '',
        description: '',
        tags: {
            car_type: '',
            company: '',
            dealer: '',
        },
    });
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    useEffect(() => {
        if (isEdit) {
            const fetchCar = async () => {
                try {
                    const res = await authAxios.get(`/cars/${id}`);
                    const car = res.data;
                    if (car.user._id !== user.id) {
                        setError('Not authorized to edit this car');
                        return;
                    }
                    setForm({
                        title: car.title,
                        description: car.description,
                        tags: car.tags,
                    });
                    setExistingImages(car.images);
                } catch (err) {
                    setError(err.response.data.message || 'Failed to fetch car');
                }
            };
            fetchCar();
        }
    }, [id]);

    const handleChange = e => {
        const { name, value } = e.target;
        if (['car_type', 'company', 'dealer'].includes(name)) {
            setForm({
                ...form,
                tags: {
                    ...form.tags,
                    [name]: value,
                },
            });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleFileChange = e => {
        const files = Array.from(e.target.files);
        if (existingImages.length + images.length + files.length > 10) {
            setError('You can upload a maximum of 10 images.');
            return;
        }
        setImages(prevImages => [...prevImages, ...files]);
    };

    const handleImageRemove = index => {
        setImages(prevImages => prevImages.filter((img, i) => i !== index));
    };

    const handleExistingImageRemove = index => {
        setExistingImages(prevImages => prevImages.filter((img, i) => i !== index));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('description', form.description);
        formData.append('tags', JSON.stringify(form.tags));
        images.forEach(image => {
            formData.append('images', image);
        });

        try {
            if (isEdit) {
                await authAxios.put(`/cars/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                await authAxios.post('/cars', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            navigate('/');
        } catch (err) {
            setError(err.response.data.message || 'Failed to submit');
        }
    };

    return (
        <Card className="mx-auto" style={{ maxWidth: '800px' }}>
            <Card.Body>
                <h2 className="mb-4">{isEdit ? 'Edit Car' : 'Add New Car'}</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="title" className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="title" 
                            value={form.title} 
                            onChange={handleChange} 
                            required 
                        />
                    </Form.Group>
                    <Form.Group controlId="description" className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={3} 
                            name="description" 
                            value={form.description} 
                            onChange={handleChange} 
                        />
                    </Form.Group>
                    <Form.Group controlId="car_type" className="mb-3">
                        <Form.Label>Car Type</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="car_type" 
                            value={form.tags.car_type} 
                            onChange={handleChange} 
                            placeholder="e.g., SUV, Sedan" 
                        />
                    </Form.Group>
                    <Form.Group controlId="company" className="mb-3">
                        <Form.Label>Company</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="company" 
                            value={form.tags.company} 
                            onChange={handleChange} 
                            placeholder="e.g., Toyota, Ford" 
                        />
                    </Form.Group>
                    <Form.Group controlId="dealer" className="mb-3">
                        <Form.Label>Dealer</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="dealer" 
                            value={form.tags.dealer} 
                            onChange={handleChange} 
                            placeholder="Dealer name" 
                        />
                    </Form.Group>
                    <Form.Group controlId="images" className="mb-3">
                        <Form.Label>Images (Max 10)</Form.Label>
                        <Form.Control 
                            type="file" 
                            multiple 
                            onChange={handleFileChange} 
                            accept="image/*" 
                        />
                    </Form.Group>
                    <div className="mb-3">
                        {existingImages.map((img, index) => (
                            <div key={index} className="d-inline-block position-relative me-2 mb-2">
                                <Image 
                                    src={`http://localhost:5000/${img}`} 
                                    alt="Existing Car" 
                                    thumbnail 
                                    width={100} 
                                    height={100} 
                                />
                                <Button 
                                    variant="danger" 
                                    size="sm" 
                                    className="position-absolute top-0 end-0" 
                                    onClick={() => handleExistingImageRemove(index)}
                                >
                                    &times;
                                </Button>
                            </div>
                        ))}
                        {images.map((img, index) => (
                            <div key={index} className="d-inline-block position-relative me-2 mb-2">
                                <Image 
                                    src={URL.createObjectURL(img)} 
                                    alt="Car" 
                                    thumbnail 
                                    width={100} 
                                    height={100} 
                                />
                                <Button 
                                    variant="danger" 
                                    size="sm" 
                                    className="position-absolute top-0 end-0" 
                                    onClick={() => handleImageRemove(index)}
                                >
                                    &times;
                                </Button>
                            </div>
                        ))}
                    </div>
                    <Button variant="primary" type="submit">
                        {isEdit ? 'Update Car' : 'Create Car'}
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default CarForm;

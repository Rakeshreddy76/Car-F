// frontend/src/components/Search/SearchBar.js

import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const SearchBar = ({ setSearch }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = e => {
        e.preventDefault();
        setSearch(query);
    };

    return (
        <Form onSubmit={handleSubmit} className="mb-4">
            <Row>
                <Col md={10}>
                    <Form.Control 
                        type="text" 
                        placeholder="Search by title, description, tags..." 
                        value={query} 
                        onChange={e => setQuery(e.target.value)} 
                    />
                </Col>
                <Col md={2}>
                    <Button type="submit" variant="success" className="w-100">
                        Search
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default SearchBar;

import React, { useEffect, useState } from 'react';
import { Alert, Card, Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { PositionSummary, getPositions } from '../services/positionService';

const statusLabels: Record<string, string> = {
    Open: 'Abierto',
    Filled: 'Contratado',
    Closed: 'Cerrado',
    Draft: 'Borrador'
};

const statusLabel = (status: string): string => statusLabels[status] ?? status;

const Positions: React.FC = () => {
    const [positions, setPositions] = useState<PositionSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;
        getPositions()
            .then(list => {
                if (!cancelled) setPositions(list);
            })
            .catch(() => {
                if (!cancelled) setError('No se pudieron cargar las posiciones.');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Posiciones</h2>
            <Row className="mb-4">
                <Col md={3}>
                    <Form.Control type="text" placeholder="Buscar por título" />
                </Col>
                <Col md={3}>
                    <Form.Control type="date" placeholder="Buscar por fecha" />
                </Col>
                <Col md={3}>
                    <Form.Control as="select">
                        <option value="">Estado</option>
                        <option value="open">Abierto</option>
                        <option value="filled">Contratado</option>
                        <option value="closed">Cerrado</option>
                        <option value="draft">Borrador</option>
                    </Form.Control>
                </Col>
                <Col md={3}>
                    <Form.Control as="select">
                        <option value="">Manager</option>
                        <option value="john_doe">John Doe</option>
                        <option value="jane_smith">Jane Smith</option>
                        <option value="alex_jones">Alex Jones</option>
                    </Form.Control>
                </Col>
            </Row>
            {error && <Alert variant="danger">{error}</Alert>}
            {loading && <Spinner animation="border" role="status" />}
            {!loading && !error && positions.length === 0 && (
                <Alert variant="info">No hay posiciones disponibles.</Alert>
            )}
            <Row>
                {positions.map(position => (
                    <Col md={4} key={position.id} className="mb-4">
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title>{position.title}</Card.Title>
                                <Card.Text>
                                    <strong>Manager:</strong><br />
                                    <strong>Deadline:</strong> {position.applicationDeadline ? position.applicationDeadline.slice(0, 10) : ''}
                                </Card.Text>
                                <span className={`badge ${statusLabel(position.status) === 'Abierto' ? 'bg-warning' : statusLabel(position.status) === 'Contratado' ? 'bg-success' : statusLabel(position.status) === 'Borrador' ? 'bg-secondary' : 'bg-warning'} text-white`}>
                                    {statusLabel(position.status)}
                                </span>
                                <div className="d-flex justify-content-between mt-3">
                                    <Button as={Link as any} to={`/positions/${position.id}`} variant="primary">Ver proceso</Button>
                                    <Button variant="secondary">Editar</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Positions;
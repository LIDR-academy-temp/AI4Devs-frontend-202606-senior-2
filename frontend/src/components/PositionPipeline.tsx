import React, { useEffect, useRef, useState } from 'react';
import { Alert, Col, Container, Row, Spinner } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import { Link, useParams } from 'react-router-dom';
import PipelineColumn from './PipelineColumn';
import {
    InterviewStep,
    PositionCandidate,
    getInterviewFlow,
    getPositionCandidates,
    updateCandidateStage
} from '../services/positionService';

const PositionPipeline: React.FC = () => {
    const { id = '' } = useParams<{ id: string }>();
    const [positionName, setPositionName] = useState('');
    const [steps, setSteps] = useState<InterviewStep[]>([]);
    const [candidates, setCandidates] = useState<PositionCandidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const dragged = useRef<PositionCandidate | null>(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError('');
        Promise.all([getInterviewFlow(id), getPositionCandidates(id)])
            .then(([flow, list]) => {
                if (cancelled) return;
                setPositionName(flow.positionName);
                setSteps(flow.interviewFlow.interviewSteps);
                setCandidates(list);
            })
            .catch(() => {
                if (!cancelled) setError('No se pudo cargar el proceso de la posición.');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [id]);

    const sortedSteps = [...steps].sort((a, b) => a.orderIndex - b.orderIndex || a.id - b.id);
    const stepNames = new Set(sortedSteps.map(step => step.name));
    const orphans = candidates.filter(c => !stepNames.has(c.currentInterviewStep));

    const handleDrop = async (step: InterviewStep) => {
        const candidate = dragged.current;
        dragged.current = null;
        if (!candidate || candidate.currentInterviewStep === step.name) return;

        const previousStep = candidate.currentInterviewStep;
        const moveTo = (stepName: string) =>
            setCandidates(prev =>
                prev.map(c =>
                    c.applicationId === candidate.applicationId ? { ...c, currentInterviewStep: stepName } : c
                )
            );

        setError('');
        moveTo(step.name);
        try {
            await updateCandidateStage(candidate.id, candidate.applicationId, step.id);
        } catch (e) {
            moveTo(previousStep);
            setError('No se pudo actualizar la fase del candidato.');
        }
    };

    return (
        <Container className="mt-5">
            <div className="d-flex align-items-center mb-4">
                <Link to="/positions" className="text-dark me-3" aria-label="Volver a posiciones">
                    <ArrowLeft size={28} />
                </Link>
                <h2 className="mb-0">{positionName}</h2>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}
            {loading && <Spinner animation="border" role="status" />}

            {!loading && !error && sortedSteps.length === 0 && (
                <Alert variant="info">Esta posición no tiene un proceso definido.</Alert>
            )}

            {!loading && (sortedSteps.length > 0 || orphans.length > 0) && (
                <Row className="g-3">
                    {sortedSteps.map(step => (
                        <Col xs={12} md key={step.id}>
                            <PipelineColumn
                                title={step.name}
                                candidates={candidates.filter(c => c.currentInterviewStep === step.name)}
                                acceptsDrop
                                onCandidateDragStart={c => {
                                    dragged.current = c;
                                }}
                                onDropCandidate={() => handleDrop(step)}
                            />
                        </Col>
                    ))}
                    {orphans.length > 0 && (
                        <Col xs={12} md key="sin-fase">
                            <PipelineColumn
                                title="Sin fase"
                                candidates={orphans}
                                acceptsDrop={false}
                                onCandidateDragStart={() => {}}
                                onDropCandidate={() => {}}
                            />
                        </Col>
                    )}
                </Row>
            )}
        </Container>
    );
};

export default PositionPipeline;

import React from 'react';
import { Card } from 'react-bootstrap';
import { PositionCandidate } from '../services/positionService';

type CandidateCardProps = {
    candidate: PositionCandidate;
    draggable: boolean;
    onDragStart: (candidate: PositionCandidate) => void;
};

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, draggable, onDragStart }) => {
    const score = Math.max(0, Math.round(candidate.averageScore));

    return (
        <Card
            className="mb-2 shadow-sm"
            draggable={draggable}
            onDragStart={(e: React.DragEvent) => {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', String(candidate.applicationId));
                onDragStart(candidate);
            }}
            style={{ cursor: draggable ? 'grab' : 'default' }}
        >
            <Card.Body className="py-2 px-3">
                <Card.Title as="h6" className="mb-1">{candidate.fullName}</Card.Title>
                <div aria-label={`Puntuación media: ${score}`}>
                    {Array.from({ length: score }, (_, i) => (
                        <span key={i} className="text-success me-1" aria-hidden="true">&#9679;</span>
                    ))}
                </div>
            </Card.Body>
        </Card>
    );
};

export default CandidateCard;

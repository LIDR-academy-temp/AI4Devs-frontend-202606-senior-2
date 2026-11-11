import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import CandidateCard from './CandidateCard';
import { PositionCandidate } from '../services/positionService';

type PipelineColumnProps = {
    title: string;
    candidates: PositionCandidate[];
    acceptsDrop: boolean;
    onCandidateDragStart: (candidate: PositionCandidate) => void;
    onDropCandidate: () => void;
};

const PipelineColumn: React.FC<PipelineColumnProps> = ({
    title,
    candidates,
    acceptsDrop,
    onCandidateDragStart,
    onDropCandidate
}) => {
    const [isOver, setIsOver] = useState(false);

    return (
        <Card
            className={`h-100 ${isOver ? 'border-primary' : ''}`}
            onDragOver={(e: React.DragEvent) => {
                if (!acceptsDrop) return;
                e.preventDefault();
                setIsOver(true);
            }}
            onDragLeave={() => setIsOver(false)}
            onDrop={(e: React.DragEvent) => {
                if (!acceptsDrop) return;
                e.preventDefault();
                setIsOver(false);
                onDropCandidate();
            }}
        >
            <Card.Body>
                <Card.Title as="h5" className="mb-3">{title}</Card.Title>
                {candidates.map(candidate => (
                    <CandidateCard
                        key={candidate.applicationId}
                        candidate={candidate}
                        draggable={acceptsDrop}
                        onDragStart={onCandidateDragStart}
                    />
                ))}
            </Card.Body>
        </Card>
    );
};

export default PipelineColumn;

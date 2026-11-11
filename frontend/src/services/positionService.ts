const API_URL = 'http://localhost:3010';

export type InterviewStep = {
    id: number;
    interviewFlowId: number;
    interviewTypeId: number;
    name: string;
    orderIndex: number;
};

export type InterviewFlowResponse = {
    positionName: string;
    interviewFlow: {
        id: number;
        description: string;
        interviewSteps: InterviewStep[];
    };
};

export type PositionCandidate = {
    id: number;
    applicationId: number;
    fullName: string;
    currentInterviewStep: string;
    averageScore: number;
};

export type PositionSummary = {
    id: number;
    title: string;
    status: string;
    applicationDeadline: string | null;
};

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
    const response = await fetch(`${API_URL}${path}`, options);
    if (!response.ok) {
        throw new Error(`Error ${response.status}`);
    }
    return response.json();
};

export const getPositions = (): Promise<PositionSummary[]> =>
    request<PositionSummary[]>('/positions');

export const getInterviewFlow = (positionId: string): Promise<InterviewFlowResponse> =>
    request<InterviewFlowResponse>(`/positions/${positionId}/interviewFlow`);

export const getPositionCandidates = (positionId: string): Promise<PositionCandidate[]> =>
    request<PositionCandidate[]>(`/positions/${positionId}/candidates`);

export const updateCandidateStage = (
    candidateId: number,
    applicationId: number,
    stepId: number
): Promise<unknown> =>
    request(`/candidates/${candidateId}/stage`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, currentInterviewStep: stepId })
    });

import { getCandidatesByPosition, getInterviewFlowByPosition, getPositions } from './positionController';
import { Request, Response } from 'express';
import { getCandidatesByPositionService, getInterviewFlowByPositionService, getPositionsService } from '../../application/services/positionService';

jest.mock('../../application/services/positionService');

describe('getCandidatesByPosition', () => {
  it('should return 200 and candidates data', async () => {
    const req = { params: { id: '1' } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    (getCandidatesByPositionService as jest.Mock).mockResolvedValue([
      { fullName: 'John Doe', currentInterviewStep: 'Technical Interview', averageScore: 4 },
    ]);

    await getCandidatesByPosition(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      { fullName: 'John Doe', currentInterviewStep: 'Technical Interview', averageScore: 4 },
    ]);
  });
});

describe('getInterviewFlowByPosition', () => {
  const buildRes = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response);

  it('should return 200 with the flat { positionName, interviewFlow } body', async () => {
    const req = { params: { id: '1' } } as unknown as Request;
    const res = buildRes();
    const flow = {
      positionName: 'Senior backend engineer',
      interviewFlow: {
        id: 1,
        description: 'Standard development interview process',
        interviewSteps: [
          { id: 1, interviewFlowId: 1, interviewTypeId: 1, name: 'Initial Screening', orderIndex: 1 },
        ],
      },
    };
    (getInterviewFlowByPositionService as jest.Mock).mockResolvedValue(flow);

    await getInterviewFlowByPosition(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(flow);
  });

  it('should return 404 when the position does not exist', async () => {
    const req = { params: { id: '999' } } as unknown as Request;
    const res = buildRes();
    (getInterviewFlowByPositionService as jest.Mock).mockRejectedValue(new Error('Position not found'));

    await getInterviewFlowByPosition(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('getPositions', () => {
  const buildRes = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response);

  it('should return 200 with the list of positions', async () => {
    const res = buildRes();
    const positions = [
      { id: 1, title: 'Senior Full-Stack Engineer', status: 'Open', applicationDeadline: new Date('2024-12-31') },
    ];
    (getPositionsService as jest.Mock).mockResolvedValue(positions);

    await getPositions({} as Request, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(positions);
  });

  it('should return 200 with an empty list when there are no positions', async () => {
    const res = buildRes();
    (getPositionsService as jest.Mock).mockResolvedValue([]);

    await getPositions({} as Request, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it('should return 500 when the service fails', async () => {
    const res = buildRes();
    (getPositionsService as jest.Mock).mockRejectedValue(new Error('db down'));

    await getPositions({} as Request, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

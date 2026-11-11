import { getCandidatesByPositionService, getPositionsService } from './positionService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    application: {
      findMany: jest.fn(),
    },
    position: {
      findMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('getCandidatesByPositionService', () => {
  it('should return candidates with their average scores', async () => {
    const mockApplications = [
      {
        id: 1,
        positionId: 1,
        candidateId: 1,
        applicationDate: new Date(),
        currentInterviewStep: 1,
        notes: null,
        candidate: { id: 7, firstName: 'John', lastName: 'Doe' },
        interviewStep: { name: 'Technical Interview' },
        interviews: [{ score: 5 }, { score: 3 }],
      },
    ];

    jest.spyOn(prisma.application, 'findMany').mockResolvedValue(mockApplications);

    const result = await getCandidatesByPositionService(1);
    expect(result).toEqual([
      {
        fullName: 'John Doe',
        currentInterviewStep: 'Technical Interview',
        averageScore: 4,
        id: 7,
        applicationId: 1,
      },
    ]);
  });
});

describe('getPositionsService', () => {
  it('should select only the listing fields and order by id', async () => {
    const rows = [
      { id: 1, title: 'Senior Full-Stack Engineer', status: 'Open', applicationDeadline: new Date('2024-12-31') },
    ];
    const findMany = jest.spyOn(prisma.position, 'findMany').mockResolvedValue(rows as any);

    const result = await getPositionsService();

    expect(result).toEqual(rows);
    expect(findMany).toHaveBeenCalledWith({
      select: { id: true, title: true, status: true, applicationDeadline: true },
      orderBy: { id: 'asc' },
    });
  });

  it('should return an empty list when there are no positions', async () => {
    jest.spyOn(prisma.position, 'findMany').mockResolvedValue([]);

    expect(await getPositionsService()).toEqual([]);
  });
});

import { updateCandidateStage } from './candidateService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    application: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    position: {
      findUnique: jest.fn(),
    },
    interviewStep: {
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('updateCandidateStage', () => {
  it('should update the candidate stage and return the updated application', async () => {
    const mockApplication = {
      id: 1,
      positionId: 1,
      candidateId: 1,
      currentInterviewStep: 1,
      applicationDate: new Date(),
      notes: null,
    };

    jest.spyOn(prisma.application, 'findFirst').mockResolvedValue(mockApplication);
    jest.spyOn(prisma.position, 'findUnique').mockResolvedValue({ id: 1, interviewFlowId: 1 } as any);
    jest.spyOn(prisma.interviewStep, 'findUnique').mockResolvedValue({ id: 2, interviewFlowId: 1 } as any);
    jest.spyOn(prisma.application, 'update').mockResolvedValue({
      ...mockApplication,
      currentInterviewStep: 2,
    });

    const result = await updateCandidateStage(1, 1, 2);
    expect(result).toEqual(expect.objectContaining({
      ...mockApplication,
      currentInterviewStep: 2,
    }));
  });

  describe('step validation', () => {
    const application = {
      id: 1,
      positionId: 1,
      candidateId: 1,
      currentInterviewStep: 1,
      applicationDate: new Date(),
      notes: null,
    };

    beforeEach(() => {
      jest.spyOn(prisma.application, 'findFirst').mockResolvedValue(application);
      jest.spyOn(prisma.position, 'findUnique').mockResolvedValue({ id: 1, interviewFlowId: 1 } as any);
      (prisma.application.update as jest.Mock).mockClear();
    });

    it('should reject a step that belongs to another interview flow', async () => {
      jest.spyOn(prisma.interviewStep, 'findUnique').mockResolvedValue({ id: 9, interviewFlowId: 2 } as any);

      await expect(updateCandidateStage(1, 1, 9)).rejects.toThrow('Invalid currentInterviewStep');
      expect(prisma.application.update).not.toHaveBeenCalled();
    });

    it('should reject a step that does not exist', async () => {
      jest.spyOn(prisma.interviewStep, 'findUnique').mockResolvedValue(null);

      await expect(updateCandidateStage(1, 1, 99)).rejects.toThrow('Invalid currentInterviewStep');
      expect(prisma.application.update).not.toHaveBeenCalled();
    });

    it('should report a missing application before validating the step', async () => {
      jest.spyOn(prisma.application, 'findFirst').mockResolvedValue(null);

      await expect(updateCandidateStage(1, 1, 2)).rejects.toThrow('Application not found');
    });
  });
});

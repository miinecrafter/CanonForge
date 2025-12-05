import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/database';
import { AppError, asyncHandler } from '../middleware/error';

export const canonizeSubmission = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { id } = req.params;
  const { notes } = req.body;

  // Get submission
  const submission = await prisma.submission.findUnique({
    where: { id: Number(id) },
    include: {
      project: {
        include: {
          owners: true,
        },
      },
      canonical: true,
    },
  });

  if (!submission) {
    throw new AppError('Submission not found', 404);
  }

  // Check if user is project owner
  const isOwner = submission.project.owners.some(o => o.userId === req.user!.userId);
  if (!isOwner && req.user.role !== 'ADMIN') {
    throw new AppError('Only project owners can canonize submissions', 403);
  }

  // Check if already canonical
  if (submission.canonical) {
    throw new AppError('Submission is already canonical', 400);
  }

  // Submission must be approved first
  if (submission.status !== 'APPROVED') {
    throw new AppError('Only approved submissions can be canonized', 400);
  }

  // Create canon entry
  const canonEntry = await prisma.canonEntry.create({
    data: {
      projectId: submission.projectId,
      submissionId: submission.id,
      addedById: req.user.userId,
      notes: notes || null,
    },
    include: {
      submission: {
        include: {
          author: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
      addedBy: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  res.status(201).json({ canonEntry });
});
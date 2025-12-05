import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/database';
import { AppError, asyncHandler } from '../middleware/error';

export const createReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { id } = req.params;
  const { feedback, decision } = req.body;

  // Get submission and check permissions
  const submission = await prisma.submission.findUnique({
    where: { id: Number(id) },
    include: {
      project: {
        include: {
          owners: true,
        },
      },
    },
  });

  if (!submission) {
    throw new AppError('Submission not found', 404);
  }

  // Only project owners can review
  const isOwner = submission.project.owners.some(o => o.userId === req.user!.userId);
  if (!isOwner && req.user.role !== 'ADMIN') {
    throw new AppError('Only project owners can review submissions', 403);
  }

  // Create review
  const review = await prisma.review.create({
    data: {
      submissionId: Number(id),
      reviewerId: req.user.userId,
      feedback,
      decision: decision || null,
    },
    include: {
      reviewer: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  // Update submission status based on decision
  if (decision) {
    let newStatus = submission.status;
    
    if (decision === 'APPROVED') {
      newStatus = 'APPROVED';
    } else if (decision === 'DECLINED') {
      newStatus = 'DECLINED';
    } else if (decision === 'CHANGES_REQUESTED') {
      newStatus = 'UNDER_REVIEW';
    }

    await prisma.submission.update({
      where: { id: Number(id) },
      data: { status: newStatus },
    });
  } else {
    // If no decision, mark as under review
    if (submission.status === 'SUBMITTED') {
      await prisma.submission.update({
        where: { id: Number(id) },
        data: { status: 'UNDER_REVIEW' },
      });
    }
  }

  res.status(201).json({ review });
});
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/database';
import { AppError, asyncHandler } from '../middleware/error';

export const createSubmission = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { projectId } = req.params;
  const { title, content, contentDelta } = req.body;

  // Verify project exists
  const project = await prisma.project.findUnique({
    where: { id: Number(projectId) },
  });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  const submission = await prisma.submission.create({
    data: {
      projectId: Number(projectId),
      authorId: req.user.userId,
      title,
      content,
      contentDelta: contentDelta || null,
      status: 'DRAFT',
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
      project: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
  });

  res.status(201).json({ submission });
});

export const updateSubmission = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { id } = req.params;
  const { title, content, contentDelta } = req.body;

  // Get submission
  const existing = await prisma.submission.findUnique({
    where: { id: Number(id) },
    include: {
      project: {
        include: {
          owners: true,
        },
      },
    },
  });

  if (!existing) {
    throw new AppError('Submission not found', 404);
  }

  // Check permissions
  const isAuthor = existing.authorId === req.user.userId;
  const isProjectOwner = existing.project.owners.some(o => o.userId === req.user.userId);

  if (!isAuthor && !isProjectOwner && req.user.role !== 'ADMIN') {
    throw new AppError('Not authorized to update this submission', 403);
  }

  // Don't allow editing approved submissions
  if (existing.status === 'APPROVED' && !isProjectOwner) {
    throw new AppError('Cannot edit approved submissions', 403);
  }

  const submission = await prisma.submission.update({
    where: { id: Number(id) },
    data: {
      ...(title && { title }),
      ...(content && { content }),
      ...(contentDelta && { contentDelta }),
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  res.json({ submission });
});

export const submitForReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { id } = req.params;

  const submission = await prisma.submission.findUnique({
    where: { id: Number(id) },
  });

  if (!submission) {
    throw new AppError('Submission not found', 404);
  }

  if (submission.authorId !== req.user.userId) {
    throw new AppError('Not authorized', 403);
  }

  if (submission.status !== 'DRAFT') {
    throw new AppError('Only draft submissions can be submitted', 400);
  }

  const updated = await prisma.submission.update({
    where: { id: Number(id) },
    data: { status: 'SUBMITTED' },
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
      project: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
  });

  res.json({ submission: updated });
});

export const listSubmissions = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { projectId } = req.params;
  const { status } = req.query;

  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  // Check if user is project owner
  const isOwner = await prisma.projectOwners.findFirst({
    where: {
      projectId: Number(projectId),
      userId: req.user.userId,
    },
  });

  const where: any = {
    projectId: Number(projectId),
  };

  // If not owner, only show user's own submissions
  if (!isOwner && req.user.role !== 'ADMIN') {
    where.authorId = req.user.userId;
  }

  if (status) {
    where.status = status;
  }

  const submissions = await prisma.submission.findMany({
    where,
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
      _count: {
        select: {
          reviews: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  res.json({ submissions });
});

export const getSubmission = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { id } = req.params;

  const submission = await prisma.submission.findUnique({
    where: { id: Number(id) },
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
      project: {
        include: {
          owners: true,
        },
      },
      reviews: {
        include: {
          reviewer: {
            select: {
              id: true,
              username: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!submission) {
    throw new AppError('Submission not found', 404);
  }

  // Check permissions
  const isAuthor = submission.authorId === req.user.userId;
  const isProjectOwner = submission.project.owners.some(o => o.userId === req.user.userId);

  if (!isAuthor && !isProjectOwner && req.user.role !== 'ADMIN') {
    throw new AppError('Not authorized to view this submission', 403);
  }

  res.json({ submission });
});
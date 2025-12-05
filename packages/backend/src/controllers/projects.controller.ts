import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/database';
import { AppError, asyncHandler } from '../middleware/error';

// Helper function to generate unique slug
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    + '-' + Math.random().toString(36).substring(2, 7);
};

export const createProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { title, description, visibility, tags } = req.body;
  const slug = generateSlug(title);

  const project = await prisma.project.create({
    data: {
      title,
      slug,
      description,
      visibility: visibility || 'PUBLIC',
      tags: tags ? JSON.stringify(tags) : null,
      owners: {
        create: {
          userId: req.user.userId,
          role: 'OWNER',
        },
      },
    },
    include: {
      owners: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
    },
  });

  res.status(201).json({ project });
});

export const listProjects = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { q, tag, page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where: any = {
    visibility: 'PUBLIC',
  };

  if (q) {
    where.OR = [
      { title: { contains: q as string } },
      { description: { contains: q as string } },
    ];
  }

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      skip,
      take: Number(limit),
      include: {
        owners: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
        _count: {
          select: {
            submissions: true,
            canonEntries: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.project.count({ where }),
  ]);

  res.json({
    projects,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

export const getProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { slug } = req.params;

  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      owners: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
      canonEntries: {
        include: {
          submission: {
            select: {
              id: true,
              title: true,
              content: true,
              createdAt: true,
              author: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
          },
        },
        orderBy: {
          addedAt: 'desc',
        },
      },
    },
  });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  // Check if user has access to private project
  if (project.visibility === 'PRIVATE') {
    if (!req.user) {
      throw new AppError('Project not found', 404);
    }

    const isOwner = project.owners.some(o => o.userId === req.user!.userId);
    if (!isOwner && req.user.role !== 'ADMIN') {
      throw new AppError('Project not found', 404);
    }
  }

  res.json({ project });
});

export const updateProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { id } = req.params;
  const { title, description, visibility, tags } = req.body;

  // Check if user is owner
  const projectOwner = await prisma.projectOwners.findFirst({
    where: {
      projectId: Number(id),
      userId: req.user.userId,
    },
  });

  if (!projectOwner && req.user.role !== 'ADMIN') {
    throw new AppError('Not authorized to update this project', 403);
  }

  const project = await prisma.project.update({
    where: { id: Number(id) },
    data: {
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(visibility && { visibility }),
      ...(tags && { tags: JSON.stringify(tags) }),
    },
    include: {
      owners: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
    },
  });

  res.json({ project });
});

export const addCollaborator = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { id } = req.params;
  const { userId, role } = req.body;

  // Check if requester is owner
  const isOwner = await prisma.projectOwners.findFirst({
    where: {
      projectId: Number(id),
      userId: req.user.userId,
      role: 'OWNER',
    },
  });

  if (!isOwner && req.user.role !== 'ADMIN') {
    throw new AppError('Only project owners can add collaborators', 403);
  }

  // Add collaborator
  const collaborator = await prisma.projectOwners.create({
    data: {
      projectId: Number(id),
      userId: Number(userId),
      role: role || 'COLLABORATOR',
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });

  res.status(201).json({ collaborator });
});
import { Request, Response } from "express";
import prisma from "../prisma/client";
import { validationResult } from "express-validator";

export const createProject = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { title, description, tags, visibility } = req.body;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const project = await prisma.project.create({
    data: { title, description, slug, tags: tags || [], visibility: visibility || "PUBLIC" }
  });
  // add owner relation
  await prisma.projectOwners.create({ data: { projectId: project.id, userId: (req as any).user.id }});
  res.json({ project });
};

export const listProjects = async (req: Request, res: Response) => {
  const projects = await prisma.project.findMany({ take: 50, orderBy: { createdAt: "desc" }});
  res.json({ projects });
};

export const getProjectBySlug = async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const project = await prisma.project.findUnique({
    where: { slug },
    include: { canonEntries: { include: { submission: true } } }
  });
  if (!project) return res.status(404).json({ error: "Not found" });
  res.json({ project });
};

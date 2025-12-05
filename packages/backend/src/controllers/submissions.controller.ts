import { Request, Response } from "express";
import prisma from "../prisma/client";

export const createSubmission = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const { title, content } = req.body;
  const user = (req as any).user;

  const project = await prisma.project.findUnique({ where: { slug }});
  if (!project) return res.status(404).json({ error: "Project not found" });

  const submission = await prisma.submission.create({
    data: {
      projectId: project.id,
      authorId: user.id,
      title,
      content
    }
  });

  res.json({ submission });
};


export const updateSubmission = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;

  const sub = await prisma.submission.findUnique({
    where: { id: Number(id) }
  });

  if (!sub) return res.status(404).json({ error: "Not found" });
  if (sub.authorId !== user.id && !["WRITER", "ADMIN"].includes(user.role))
    return res.status(403).json({ error: "Forbidden" });

  const updated = await prisma.submission.update({
    where: { id: Number(id) },
    data: req.body
  });

  res.json({ submission: updated });
};


export const submitSubmission = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;

  const sub = await prisma.submission.findUnique({
    where: { id: Number(id) }
  });

  if (!sub) return res.status(404).json({ error: "Not found" });
  if (sub.authorId !== user.id)
    return res.status(403).json({ error: "Forbidden" });

  const updated = await prisma.submission.update({
    where: { id: Number(id) },
    data: { status: "SUBMITTED" }
  });

  res.json({ submission: updated });
};


export const listProjectSubmissions = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const status = req.query.status as string | undefined;

  const project = await prisma.project.findUnique({ where: { slug }});
  if (!project) return res.status(404).json({ error: "Project not found" });

  const where: any = { projectId: project.id };
  if (status) where.status = status;

  const subs = await prisma.submission.findMany({
    where,
    include: { author: true, reviews: true }
  });

  res.json({ submissions: subs });
};


export const getSubmission = async (req: Request, res: Response) => {
  const { id } = req.params;

  const sub = await prisma.submission.findUnique({
    where: { id: Number(id) }
  });

  if (!sub) return res.status(404).json({ error: "Not found" });

  res.json({ submission: sub });
};


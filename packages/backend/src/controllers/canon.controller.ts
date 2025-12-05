import { Request, Response } from "express";
import prisma from "../prisma/client";

export const canonizeSubmission = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  const submission = await prisma.submission.findUnique({ where: { id: Number(id) }});
  if (!submission) return res.status(404).json({ error: "Not found" });

  // only project owners/collaborators or admin
  const ownerRel = await prisma.projectOwners.findFirst({ where: { projectId: submission.projectId, userId: user.id }});
  if (!ownerRel && user.role !== "ADMIN") return res.status(403).json({ error: "Forbidden" });

  // create canonical entry
  const entry = await prisma.canonEntry.create({
    data: { projectId: submission.projectId, submissionId: submission.id, addedById: user.id }
  });

  // set submission status APPROVED
  await prisma.submission.update({ where: { id: submission.id }, data: { status: "APPROVED" }});

  res.json({ canonEntry: entry });
};

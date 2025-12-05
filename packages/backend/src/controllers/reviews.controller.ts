import { Request, Response } from "express";
import prisma from "../prisma/client";

export const createReview = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { feedback, decision } = req.body;
  const user = (req as any).user;

  const submission = await prisma.submission.findUnique({ where: { id: Number(id) }, include: { project: true }});
  if (!submission) return res.status(404).json({ error: "Not found" });

  // basic ownership: must be project owner/collaborator or admin
  const ownerRel = await prisma.projectOwners.findFirst({ where: { projectId: submission.projectId, userId: user.id }});
  if (!ownerRel && user.role !== "ADMIN") return res.status(403).json({ error: "Forbidden" });

  const review = await prisma.review.create({
    data: { submissionId: submission.id, reviewerId: user.id, feedback, decision }
  });

  // update submission status based on decision
  let status = submission.status;
  if (decision === "APPROVED") status = "APPROVED";
  if (decision === "DECLINED") status = "DECLINED";
  if (decision === "CHANGES_REQUESTED") status = "UNDER_REVIEW";

  await prisma.submission.update({ where: { id: submission.id }, data: { status }});

  res.json({ review });
};

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'READER' | 'WRITER' | 'MODERATOR' | 'ADMIN';
  createdAt: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description?: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  createdAt: string;
  owners: ProjectOwner[];
  _count?: {
    submissions: number;
    canonEntries: number;
  };
  canonEntries?: CanonEntry[];
}

export interface ProjectOwner {
  id: number;
  role: 'OWNER' | 'COLLABORATOR';
  user: {
    id: number;
    username: string;
  };
}

export interface Submission {
  id: number;
  projectId: number;
  authorId: number;
  title: string;
  content: string;
  contentDelta?: any;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'DECLINED';
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    username: string;
  };
  project?: {
    id: number;
    title: string;
    slug: string;
  };
  reviews?: Review[];
  _count?: {
    reviews: number;
  };
}

export interface Review {
  id: number;
  submissionId: number;
  reviewerId: number;
  feedback?: string;
  decision?: 'APPROVED' | 'DECLINED' | 'CHANGES_REQUESTED';
  createdAt: string;
  reviewer: {
    id: number;
    username: string;
  };
}

export interface CanonEntry {
  id: number;
  projectId: number;
  submissionId: number;
  addedById: number;
  addedAt: string;
  notes?: string;
  submission: Submission;
  addedBy: {
    id: number;
    username: string;
  };
}
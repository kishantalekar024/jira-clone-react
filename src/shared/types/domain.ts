export type IssueType = 'bug' | 'story' | 'task';
export type IssueStatus = 'backlog' | 'selected' | 'in-progress' | 'done';
export type IssuePriority = 'lowest' | 'low' | 'medium' | 'high' | 'highest';

export type User = {
  id: string;
  name: string;
  avatarUrl: string;
};

export type Comment = {
  id: string;
  userId: string;
  body: string;
  createdAt: string;
};

export type Issue = {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  type: IssueType;
  reporterId: string;
  userIds: string[];
  listPosition: number;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
};

export type Project = {
  id: string;
  name: string;
  category: 'software' | 'business' | 'marketing';
  description: string;
  url: string;
};

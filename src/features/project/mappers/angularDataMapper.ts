import type {
  Issue,
  IssuePriority,
  IssueStatus,
  IssueType,
  Project,
  User,
} from '@/shared/types/domain';

type AngularProjectUser = {
  id: string;
  name: string;
  avatarUrl: string;
};

type AngularIssue = {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  status: string;
  reporterId: string;
  userIds: string[];
  createdAt: string;
  updatedAt: string;
  listPosition?: number;
};

export type AngularProjectPayload = {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  users: AngularProjectUser[];
  issues: AngularIssue[];
};

export type AngularAuthPayload = {
  id: string;
};

const statusMap: Record<string, IssueStatus> = {
  backlog: 'backlog',
  selected: 'selected',
  inprogress: 'in-progress',
  'in-progress': 'in-progress',
  done: 'done',
};

const priorityMap: Record<string, IssuePriority> = {
  lowest: 'lowest',
  low: 'low',
  medium: 'medium',
  high: 'high',
  highest: 'highest',
};

const typeMap: Record<string, IssueType> = {
  bug: 'bug',
  story: 'story',
  task: 'task',
};

function normalizeStatus(input: string): IssueStatus {
  return statusMap[input.toLowerCase()] ?? 'backlog';
}

function normalizePriority(input: string): IssuePriority {
  return priorityMap[input.toLowerCase()] ?? 'medium';
}

function normalizeType(input: string): IssueType {
  return typeMap[input.toLowerCase()] ?? 'task';
}

function normalizeCategory(input: string): Project['category'] {
  const value = input.toLowerCase();
  if (value === 'business' || value === 'marketing') {
    return value;
  }
  return 'software';
}

export function mapAngularPayloadToDomain(
  projectPayload: AngularProjectPayload,
  authPayload: AngularAuthPayload,
): {
  project: Project;
  users: User[];
  issues: Issue[];
  currentUserId: string;
} {
  const users: User[] = projectPayload.users.map((user) => ({
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl,
  }));

  const fallbackUserId = users[0]?.id ?? '';

  const issues: Issue[] = projectPayload.issues.map((issue, index) => ({
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: normalizeType(issue.type),
    priority: normalizePriority(issue.priority),
    status: normalizeStatus(issue.status),
    reporterId: issue.reporterId || fallbackUserId,
    userIds: issue.userIds?.length ? issue.userIds : [fallbackUserId].filter(Boolean),
    listPosition: issue.listPosition ?? index + 1,
    comments: [],
    createdAt: issue.createdAt,
    updatedAt: issue.updatedAt,
  }));

  return {
    project: {
      id: projectPayload.id,
      name: projectPayload.name,
      url: projectPayload.url,
      description: projectPayload.description,
      category: normalizeCategory(projectPayload.category),
    },
    users,
    issues,
    currentUserId: authPayload.id || fallbackUserId,
  };
}

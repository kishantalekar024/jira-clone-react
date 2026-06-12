import type { Issue, Project, User } from '@/shared/types/domain';

export const mockUsers: User[] = [
  {
    id: 'u-1',
    name: 'Trung Vo',
    avatarUrl:
      'https://res.cloudinary.com/dvujyxh7e/image/upload/v1596561309/default-user-avatar.png',
  },
  {
    id: 'u-2',
    name: 'Chau Tran',
    avatarUrl:
      'https://res.cloudinary.com/dvujyxh7e/image/upload/v1596561309/default-user-avatar.png',
  },
  {
    id: 'u-3',
    name: 'Alex Nguyen',
    avatarUrl:
      'https://res.cloudinary.com/dvujyxh7e/image/upload/v1596561309/default-user-avatar.png',
  },
];

export const mockProject: Project = {
  id: 'p-1',
  name: 'Angular Jira Clone',
  category: 'software',
  description: 'Migration placeholder project',
  url: 'https://jira.trungk18.com',
};

export const mockIssues: Issue[] = [
  {
    id: '101',
    title: 'Implement board filter search input',
    description: 'Enable searching by title and description',
    status: 'backlog',
    priority: 'medium',
    type: 'story',
    reporterId: 'u-1',
    userIds: ['u-1'],
    listPosition: 1,
    comments: [
      {
        id: 'c-101-1',
        userId: 'u-2',
        body: 'We should keep board and drawer search behavior aligned with Angular.',
        createdAt: '2026-06-10T09:30:00.000Z',
      },
    ],
    createdAt: '2026-06-10T09:00:00.000Z',
    updatedAt: '2026-06-10T09:00:00.000Z',
  },
  {
    id: '102',
    title: 'Migrate issue card visuals',
    description: 'Create read-only card with avatar, type and priority',
    status: 'selected',
    priority: 'high',
    type: 'bug',
    reporterId: 'u-2',
    userIds: ['u-2', 'u-3'],
    listPosition: 1,
    comments: [],
    createdAt: '2026-06-10T10:00:00.000Z',
    updatedAt: '2026-06-10T11:00:00.000Z',
  },
  {
    id: '103',
    title: 'Setup project layout shell',
    description: 'Left rail and sidebar foundation',
    status: 'in-progress',
    priority: 'low',
    type: 'task',
    reporterId: 'u-1',
    userIds: ['u-1', 'u-2'],
    listPosition: 1,
    comments: [
      {
        id: 'c-103-1',
        userId: 'u-1',
        body: 'Sidebar skeleton is already in place; we can now wire issue modal behavior.',
        createdAt: '2026-06-11T08:15:00.000Z',
      },
    ],
    createdAt: '2026-06-09T08:00:00.000Z',
    updatedAt: '2026-06-11T08:00:00.000Z',
  },
  {
    id: '104',
    title: 'Wire route redirects',
    description: 'Redirect root to board route',
    status: 'done',
    priority: 'lowest',
    type: 'task',
    reporterId: 'u-3',
    userIds: ['u-3'],
    listPosition: 1,
    comments: [],
    createdAt: '2026-06-08T08:00:00.000Z',
    updatedAt: '2026-06-08T08:00:00.000Z',
  },
];

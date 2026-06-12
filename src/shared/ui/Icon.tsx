import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  Bug,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleDashed,
  CircleHelp,
  ExternalLink,
  Menu,
  Plus,
  Search,
  Settings,
  Trash2,
  X,
} from 'lucide-react';

type IconName =
  | 'search'
  | 'plus'
  | 'times'
  | 'trash'
  | 'question-circle'
  | 'chevron-left'
  | 'chevron-right'
  | 'menu'
  | 'external-link'
  | 'settings'
  | 'bug'
  | 'story'
  | 'task'
  | 'arrow-up'
  | 'arrow-down'
  | 'backlog'
  | 'selected'
  | 'in-progress'
  | 'done';

export type IconProps = {
  name: IconName;
  className?: string;
  size?: number;
  strokeWidth?: number;
} & Omit<LucideProps, 'size' | 'strokeWidth'>;

const iconMap: Record<IconName, ComponentType<LucideProps>> = {
  search: Search,
  plus: Plus,
  times: X,
  trash: Trash2,
  'question-circle': CircleHelp,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  menu: Menu,
  'external-link': ExternalLink,
  settings: Settings,
  bug: Bug,
  story: BookOpen,
  task: Circle,
  'arrow-up': ArrowUp,
  'arrow-down': ArrowDown,
  backlog: CircleDashed,
  selected: Circle,
  'in-progress': Circle,
  done: CheckCircle2,
};

export function Icon({ name, size = 18, strokeWidth = 2, ...props }: IconProps) {
  const Component = iconMap[name] ?? Circle;
  return <Component size={size} strokeWidth={strokeWidth} {...props} />;
}

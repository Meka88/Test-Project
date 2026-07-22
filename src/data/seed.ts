import type { Settings, Task } from "../types";

export const SEED_TASKS: Task[] = [
  {
    id: "TSK-1001",
    title: "Wire up authentication flow",
    description: "Integrate the new SSO provider and update the login screen.",
    status: "in_progress",
    priority: "high",
    assignee: "Ada Lovelace",
    createdAt: "2026-07-14T09:12:00.000Z",
  },
  {
    id: "TSK-1002",
    title: "Fix table sorting on Dashboard",
    description: "Descending sort resets when switching tabs.",
    status: "todo",
    priority: "medium",
    assignee: "Grace Hopper",
    createdAt: "2026-07-15T11:30:00.000Z",
  },
  {
    id: "TSK-1003",
    title: "Add empty state illustrations",
    description: "Design handed off Figma frames for the empty states.",
    status: "todo",
    priority: "low",
    assignee: "Alan Turing",
    createdAt: "2026-07-16T14:05:00.000Z",
  },
  {
    id: "TSK-1004",
    title: "Ship dark mode",
    description: "Roll out the theme toggle across all routes.",
    status: "done",
    priority: "medium",
    assignee: "Ada Lovelace",
    createdAt: "2026-07-10T08:45:00.000Z",
  },
  {
    id: "TSK-1005",
    title: "Reduce bundle size",
    description: "Code-split the reporting module; it is 40% of the bundle.",
    status: "in_progress",
    priority: "high",
    assignee: "Katherine Johnson",
    createdAt: "2026-07-17T16:20:00.000Z",
  },
];

export const DEFAULT_SETTINGS: Settings = {
  displayName: "Sam Rivera",
  email: "sam@flightdeck.dev",
  theme: "light",
  emailNotifications: true,
  itemsPerPage: 10,
};

export const TEAM_MEMBERS = [
  "Ada Lovelace",
  "Grace Hopper",
  "Alan Turing",
  "Katherine Johnson",
  "Sam Rivera",
];

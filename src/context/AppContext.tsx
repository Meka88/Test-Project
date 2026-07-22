import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Settings, Task } from "../types";
import { DEFAULT_SETTINGS, SEED_TASKS } from "../data/seed";
import { load, save, withLatency } from "../lib/storage";

const TASKS_KEY = "flightdeck.tasks";
const SETTINGS_KEY = "flightdeck.settings";

export interface NewTaskInput {
  title: string;
  description: string;
  priority: Task["priority"];
  status: Task["status"];
  assignee: string;
}

interface AppContextValue {
  tasks: Task[];
  settings: Settings;
  loading: boolean;
  addTask: (input: NewTaskInput) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  cycleStatus: (id: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  resetData: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function nextId(tasks: Task[]): string {
  const max = tasks.reduce((acc, t) => {
    const n = Number(t.id.replace("TSK-", ""));
    return Number.isFinite(n) ? Math.max(acc, n) : acc;
  }, 1000);
  return `TSK-${max + 1}`;
}

const STATUS_ORDER: Task["status"][] = ["todo", "in_progress", "done"];

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    withLatency(null).then(() => {
      if (!active) return;
      setTasks(load<Task[]>(TASKS_KEY, SEED_TASKS));
      setSettings(load<Settings>(SETTINGS_KEY, DEFAULT_SETTINGS));
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!loading) save(TASKS_KEY, tasks);
  }, [tasks, loading]);

  useEffect(() => {
    if (!loading) save(SETTINGS_KEY, settings);
  }, [settings, loading]);

  const addTask = useCallback((input: NewTaskInput) => {
    setTasks((prev) => [
      {
        id: nextId(prev),
        title: input.title.trim(),
        description: input.description.trim(),
        status: input.status,
        priority: input.priority,
        assignee: input.assignee,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, []);

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const cycleStatus = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const idx = STATUS_ORDER.indexOf(t.status);
        return { ...t, status: STATUS_ORDER[(idx + 1) % STATUS_ORDER.length] };
      })
    );
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetData = useCallback(() => {
    setTasks(SEED_TASKS);
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      tasks,
      settings,
      loading,
      addTask,
      updateTask,
      deleteTask,
      cycleStatus,
      updateSettings,
      resetData,
    }),
    [
      tasks,
      settings,
      loading,
      addTask,
      updateTask,
      deleteTask,
      cycleStatus,
      updateSettings,
      resetData,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within an AppProvider");
  return ctx;
}

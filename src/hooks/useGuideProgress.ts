import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_PREFIX = "agent-deploy:progress:";

export interface GuideProgress {
  /** Map of task id to completion state. Empty until hydrated. */
  done: Record<string, boolean>;
  hydrated: boolean;
  isDone: (id: string) => boolean;
  toggle: (id: string, value?: boolean) => void;
  reset: () => void;
  completedCount: number;
  total: number;
  percent: number;
  /** Index of the first unfinished task, or -1 when everything is done. */
  currentIndex: number;
  currentId: string | null;
  allDone: boolean;
}

function readStored(key: string): Record<string, boolean> {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    const result: Record<string, boolean> = {};
    for (const [id, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (value === true) result[id] = true;
    }
    return result;
  } catch {
    return {};
  }
}

/**
 * Tracks which tasks of a guide are complete, persisted per stack in the
 * browser. Reads happen after mount so server and client render the same HTML.
 */
export function useGuideProgress(stackId: string, taskIds: string[]): GuideProgress {
  const storageKey = `${STORAGE_PREFIX}${stackId}`;
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setDone(readStored(storageKey));
    setHydrated(true);
  }, [storageKey]);

  const persist = useCallback(
    (next: Record<string, boolean>) => {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // Storage can be unavailable in private mode; progress stays in memory.
      }
    },
    [storageKey],
  );

  const toggle = useCallback(
    (id: string, value?: boolean) => {
      setDone((prev) => {
        const nextValue = value ?? !prev[id];
        const next = { ...prev };
        if (nextValue) {
          next[id] = true;
        } else {
          delete next[id];
        }
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const reset = useCallback(() => {
    setDone({});
    persist({});
  }, [persist]);

  return useMemo(() => {
    const total = taskIds.length;
    const completedCount = taskIds.filter((id) => done[id]).length;
    const currentIndex = taskIds.findIndex((id) => !done[id]);
    return {
      done,
      hydrated,
      isDone: (id: string) => Boolean(done[id]),
      toggle,
      reset,
      completedCount,
      total,
      percent: total === 0 ? 0 : Math.round((completedCount / total) * 100),
      currentIndex,
      currentId: currentIndex === -1 ? null : (taskIds[currentIndex] ?? null),
      allDone: total > 0 && completedCount === total,
    };
  }, [done, hydrated, taskIds, toggle, reset]);
}

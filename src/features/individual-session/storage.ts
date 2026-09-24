import { createFreshIndividualSession, isIndividualSession, type SessionFactoryOptions } from "@/features/individual-session/model";
import type { IndividualSession } from "@/features/individual-session/types";

export const INDIVIDUAL_SESSION_STORAGE_KEY = "reality-pending:individual-session";

export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface SessionLoadResult {
  session: IndividualSession;
  recovered: boolean;
  persisted: boolean;
}

export function saveIndividualSession(storage: StorageAdapter, session: IndividualSession): boolean {
  try {
    storage.setItem(INDIVIDUAL_SESSION_STORAGE_KEY, JSON.stringify(session));
    return true;
  } catch {
    return false;
  }
}

export function clearIndividualSession(storage: StorageAdapter): boolean {
  try {
    storage.removeItem(INDIVIDUAL_SESSION_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function loadIndividualSession(
  storage: StorageAdapter,
  factoryOptions: SessionFactoryOptions = {},
): SessionLoadResult {
  let stored: string | null = null;
  try {
    stored = storage.getItem(INDIVIDUAL_SESSION_STORAGE_KEY);
  } catch {
    const session = createFreshIndividualSession(factoryOptions);
    return { session, recovered: true, persisted: false };
  }

  if (stored !== null) {
    try {
      const parsed: unknown = JSON.parse(stored);
      if (isIndividualSession(parsed)) return { session: parsed, recovered: false, persisted: true };
    } catch {
      // Invalid local data is replaced with a fresh, valid session below.
    }
  }

  const session = createFreshIndividualSession(factoryOptions);
  const persisted = saveIndividualSession(storage, session);
  return { session, recovered: stored !== null, persisted };
}

export function restartIndividualSession(
  storage: StorageAdapter,
  factoryOptions: SessionFactoryOptions = {},
): SessionLoadResult {
  clearIndividualSession(storage);
  const session = createFreshIndividualSession(factoryOptions);
  const persisted = saveIndividualSession(storage, session);
  return { session, recovered: false, persisted };
}

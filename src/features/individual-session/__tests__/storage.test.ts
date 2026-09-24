import { describe, expect, it } from "vitest";
import { createFreshIndividualSession } from "@/features/individual-session/model";
import {
  clearIndividualSession,
  INDIVIDUAL_SESSION_STORAGE_KEY,
  loadIndividualSession,
  restartIndividualSession,
  saveIndividualSession,
  type StorageAdapter,
} from "@/features/individual-session/storage";

class MemoryStorage implements StorageAdapter {
  values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
}

const now = () => "2026-01-01T00:00:00.000Z";

describe("Individual Session persistence", () => {
  it("saves and loads a valid session round trip", () => {
    const storage = new MemoryStorage();
    const session = createFreshIndividualSession({ now, createId: () => "round-trip" });
    expect(saveIndividualSession(storage, session)).toBe(true);
    expect(loadIndividualSession(storage)).toEqual({ session, recovered: false, persisted: true });
  });

  it("creates and persists a fresh session when storage is empty", () => {
    const storage = new MemoryStorage();
    const result = loadIndividualSession(storage, { now, createId: () => "fresh-id" });
    expect(result.session.sessionId).toBe("fresh-id");
    expect(result.recovered).toBe(false);
    expect(storage.values.has(INDIVIDUAL_SESSION_STORAGE_KEY)).toBe(true);
  });

  it("recovers from malformed JSON", () => {
    const storage = new MemoryStorage();
    storage.setItem(INDIVIDUAL_SESSION_STORAGE_KEY, "{broken");
    const result = loadIndividualSession(storage, { now, createId: () => "recovered" });
    expect(result.session.sessionId).toBe("recovered");
    expect(result.recovered).toBe(true);
  });

  it("recovers from unsupported versions", () => {
    const storage = new MemoryStorage();
    storage.setItem(INDIVIDUAL_SESSION_STORAGE_KEY, JSON.stringify({ version: 99 }));
    const result = loadIndividualSession(storage, { now, createId: () => "version-recovery" });
    expect(result.session.version).toBe(1);
    expect(result.session.sessionId).toBe("version-recovery");
    expect(result.recovered).toBe(true);
  });

  it("recovers from unknown experiment ids", () => {
    const storage = new MemoryStorage();
    const session = createFreshIndividualSession({ now, createId: () => "invalid" });
    storage.setItem(INDIVIDUAL_SESSION_STORAGE_KEY, JSON.stringify({
      ...session,
      currentExperiment: "unknown-experiment",
    }));
    const result = loadIndividualSession(storage, { now, createId: () => "known" });
    expect(result.session.sessionId).toBe("known");
    expect(result.recovered).toBe(true);
  });

  it("recovers from structurally inconsistent progress", () => {
    const storage = new MemoryStorage();
    const session = createFreshIndividualSession({ now, createId: () => "inconsistent" });
    storage.setItem(INDIVIDUAL_SESSION_STORAGE_KEY, JSON.stringify({
      ...session,
      completedExperimentIds: ["simulation"],
    }));
    const result = loadIndividualSession(storage, { now, createId: () => "consistent" });
    expect(result.session.sessionId).toBe("consistent");
    expect(result.recovered).toBe(true);
  });

  it("clears persisted state", () => {
    const storage = new MemoryStorage();
    storage.setItem(INDIVIDUAL_SESSION_STORAGE_KEY, "value");
    expect(clearIndividualSession(storage)).toBe(true);
    expect(storage.getItem(INDIVIDUAL_SESSION_STORAGE_KEY)).toBeNull();
  });

  it("restart creates a distinct clean session", () => {
    const storage = new MemoryStorage();
    const original = createFreshIndividualSession({ now, createId: () => "original" });
    saveIndividualSession(storage, original);
    const restarted = restartIndividualSession(storage, { now, createId: () => "replacement" });
    expect(restarted.session.sessionId).toBe("replacement");
    expect(restarted.session.status).toBe("not-started");
    expect(restarted.session.completedExperimentIds).toEqual([]);
  });

  it("continues with in-memory state when browser storage throws", () => {
    const unavailable: StorageAdapter = {
      getItem() { throw new Error("blocked"); },
      setItem() { throw new Error("blocked"); },
      removeItem() { throw new Error("blocked"); },
    };
    const result = loadIndividualSession(unavailable, { now, createId: () => "ephemeral" });
    expect(result.session.sessionId).toBe("ephemeral");
    expect(result.persisted).toBe(false);
  });
});

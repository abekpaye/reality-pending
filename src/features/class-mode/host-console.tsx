"use client";
import { QRCodeSVG } from "qrcode.react";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ApplicationShell } from "@/components/layout/application-shell";
import { Button } from "@/components/ui/button";
import { discussions } from "@/data/discussion";
import { orderedExperiments } from "@/features/individual-session/registry";
import { classModeConfigured } from "./supabase";
import {
  createClassSession,
  getClassSessionByCode,
  getHostSnapshot,
  loadHostCredentials,
  saveHostCredentials,
  subscribeToClassSession,
  updateClassSession,
} from "./service";
import type { ClassSession, HostCredentials, HostSnapshot } from "./types";
import { ClassResults } from "./class-results";
import styles from "./class-mode.module.css";
export function HostConsole() {
  const [credentials, setCredentials] = useState<HostCredentials | null>(null),
    [session, setSession] = useState<ClassSession | null>(null),
    [snapshot, setSnapshot] = useState<HostSnapshot>({
      participantCount: 0,
      responses: [],
    }),
    [error, setError] = useState<string | null>(null),
    [busy, setBusy] = useState(false);
  const configured = classModeConfigured();
  const refresh = useCallback(async (creds: HostCredentials) => {
    try {
      const [s, next] = await Promise.all([
        getClassSessionByCode(creds.roomCode),
        getHostSnapshot(creds),
      ]);
      if (s) setSession(s);
      setSnapshot(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to refresh the room.");
    }
  }, []);
  useEffect(() => {
    const stored = loadHostCredentials();
    if (stored) {
      setCredentials(stored);
      void refresh(stored);
    }
  }, [refresh]);
  useEffect(() => {
    if (!credentials) return;
    const stop = subscribeToClassSession(credentials.roomCode, setSession);
    const timer = window.setInterval(() => void refresh(credentials), 2500);
    return () => {
      stop();
      window.clearInterval(timer);
    };
  }, [credentials, refresh]);
  async function create() {
    setBusy(true);
    setError(null);
    try {
      const creds = await createClassSession();
      saveHostCredentials(creds);
      setCredentials(creds);
      await refresh(creds);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to create the room.");
    } finally {
      setBusy(false);
    }
  }
  async function mutate(
    changes: Partial<
      Pick<
        ClassSession,
        "status" | "activeExperiment" | "resultsRevealed" | "discussionVisible"
      >
    >,
  ) {
    if (!credentials || !session) return;
    setError(null);
    try {
      setSession(
        await updateClassSession(credentials, {
          status: changes.status ?? session.status,
          activeExperiment:
            changes.activeExperiment === undefined
              ? session.activeExperiment
              : changes.activeExperiment,
          resultsRevealed: changes.resultsRevealed ?? session.resultsRevealed,
          discussionVisible:
            changes.discussionVisible ?? session.discussionVisible,
        }),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to update the room.");
    }
  }
  if (!configured)
    return (
      <ApplicationShell mode="immersive">
        <main className={styles.host}>
          <p className={styles.eyebrow}>CLASS MODE</p>
          <h1>SUPABASE SETUP REQUIRED</h1>
          <p>
            The host console is implemented but cannot create a live room
            without public configuration.
          </p>
          <Link className={styles.link} href="/class">
            Return
          </Link>
        </main>
      </ApplicationShell>
    );
  if (!credentials || !session)
    return (
      <ApplicationShell mode="immersive" label="REALITY PENDING / HOST">
        <main className={styles.host}>
          <p className={styles.eyebrow}>HOST A SEMINAR</p>
          <h1>CREATE AN ANONYMOUS ROOM.</h1>
          <p>No student names, email addresses, or accounts are collected.</p>
          {error && <p className={styles.error}>{error}</p>}
          <Button loading={busy} onClick={create}>
            CREATE CLASS SESSION
          </Button>
        </main>
      </ApplicationShell>
    );
  const active = session.activeExperiment ?? "simulation";
  const prompt = discussions.find((item) => item.experimentId === active);
  const joinUrl =
    typeof window === "undefined"
      ? `/class/join?room=${session.roomCode}`
      : `${window.location.origin}/class/join?room=${session.roomCode}`;
  return (
    <ApplicationShell mode="immersive" label="REALITY PENDING / HOST">
      <main className={styles.host}>
        <div className={styles.hostTop}>
          <div>
            <p className={styles.eyebrow}>ROOM CODE</p>
            <div className={styles.roomCode}>{session.roomCode}</div>
            <div className={styles.hostMeta}>
              <span>{snapshot.participantCount} PARTICIPANTS</span>
              <span>{session.status.toUpperCase()}</span>
            </div>
          </div>
          <div className={styles.qr}>
            <QRCodeSVG value={joinUrl} size={150} />
          </div>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.hostGrid}>
          <div>
            <p className={styles.eyebrow}>EXPERIMENT SEQUENCE</p>
            <div className={styles.experimentList}>
              {orderedExperiments.map((exp) => (
                <button
                  key={exp.id}
                  data-active={active === exp.id}
                  onClick={() =>
                    void mutate({
                      activeExperiment: exp.id,
                      resultsRevealed: false,
                      discussionVisible: false,
                      status: "active",
                    })
                  }
                >
                  <span>0{exp.order}</span>
                  <span>{exp.shortTitle}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className={styles.eyebrow}>
              {orderedExperiments.find((e) => e.id === active)?.title}
            </p>
            <div className={styles.hostControls}>
              <button
                onClick={() =>
                  void mutate({
                    status: session.status === "active" ? "waiting" : "active",
                  })
                }
              >
                {session.status === "active" ? "PAUSE" : "START / RESUME"}
              </button>
              <button
                onClick={() =>
                  void mutate({ resultsRevealed: !session.resultsRevealed })
                }
              >
                {session.resultsRevealed ? "HIDE RESULTS" : "REVEAL RESULTS"}
              </button>
              <button
                onClick={() =>
                  void mutate({ discussionVisible: !session.discussionVisible })
                }
              >
                {session.discussionVisible
                  ? "HIDE DISCUSSION"
                  : "SHOW DISCUSSION"}
              </button>
              <button onClick={() => void mutate({ status: "finished" })}>
                FINISH SESSION
              </button>
            </div>
            {session.resultsRevealed && (
              <ClassResults
                experimentId={active}
                responses={snapshot.responses}
              />
            )}{" "}
            {session.discussionVisible && prompt && (
              <div className={styles.prompt}>
                <span>DISCUSSION PROMPT</span>
                <p>{prompt.prompt}</p>
                <small>{prompt.challenge}</small>
              </div>
            )}
          </div>
        </div>
      </main>
    </ApplicationShell>
  );
}

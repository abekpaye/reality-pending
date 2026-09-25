"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ApplicationShell } from "@/components/layout/application-shell";
import { Button } from "@/components/ui/button";
import { getExperiment } from "@/features/individual-session/registry";
import { classModeConfigured } from "./supabase";
import {
  getClassSessionByCode,
  joinClassSession,
  loadParticipantCredentials,
  saveParticipantCredentials,
  submitClassResponse,
  subscribeToClassSession,
} from "./service";
import type { ClassSession, ParticipantCredentials } from "./types";
import type { JsonValue } from "@/features/individual-session/types";
import type { ExperimentId } from "@/types/experiments";
import styles from "./class-mode.module.css";
export function ParticipantRoom() {
  const params = useSearchParams();
  const [code, setCode] = useState(params.get("room") ?? ""),
    [credentials, setCredentials] = useState<ParticipantCredentials | null>(
      null,
    ),
    [session, setSession] = useState<ClassSession | null>(null),
    [error, setError] = useState<string | null>(null),
    [submittedFor, setSubmittedFor] = useState<ExperimentId | null>(null);
  const configured = classModeConfigured();
  useEffect(() => {
    const stored = loadParticipantCredentials();
    if (stored) {
      setCredentials(stored);
      setCode(stored.roomCode);
      void getClassSessionByCode(stored.roomCode)
        .then(setSession)
        .catch(() => setCredentials(null));
    }
  }, []);
  useEffect(() => {
    if (!credentials) return;
    return subscribeToClassSession(credentials.roomCode, (next) => {
      setSession(next);
      setSubmittedFor((current) =>
        current === next.activeExperiment ? current : null,
      );
    });
  }, [credentials]);
  async function join() {
    setError(null);
    try {
      const creds = await joinClassSession(code);
      saveParticipantCredentials(creds);
      setCredentials(creds);
      setSession(await getClassSessionByCode(creds.roomCode));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to join.");
    }
  }
  async function submit(id: ExperimentId, payload: JsonValue) {
    if (!credentials) return;
    try {
      await submitClassResponse(credentials, id, payload);
      setSubmittedFor(id);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Your response could not be sent.",
      );
    }
  }
  if (!configured)
    return (
      <ApplicationShell mode="immersive">
        <main className={styles.participant}>
          <p className={styles.eyebrow}>CLASS MODE</p>
          <h1>CONNECTION REQUIRED</h1>
          <p>This environment has no Supabase project configured.</p>
        </main>
      </ApplicationShell>
    );
  if (!credentials || !session)
    return (
      <ApplicationShell mode="immersive" label="REALITY PENDING / JOIN">
        <main className={styles.participant}>
          <p className={styles.eyebrow}>JOIN ANONYMOUSLY</p>
          <h1>ENTER THE ROOM CODE.</h1>
          <p>No name, email, or account is required.</p>
          <div className={styles.joinForm}>
            <label className="sr-only" htmlFor="room-code">
              Room code
            </label>
            <input
              id="room-code"
              value={code}
              maxLength={6}
              autoCapitalize="characters"
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
            <Button
              disabled={code.replace(/\s/g, "").length !== 6}
              onClick={join}
            >
              JOIN ROOM
            </Button>
          </div>
          {error && <p className={styles.error}>{error}</p>}
        </main>
      </ApplicationShell>
    );
  if (session.status === "finished")
    return (
      <ApplicationShell mode="immersive">
        <main className={styles.participant}>
          <div className={styles.waiting}>
            <span>SESSION COMPLETE</span>
            <h1>RETURN TO THE DISCUSSION.</h1>
          </div>
        </main>
      </ApplicationShell>
    );
  if (session.status !== "active" || !session.activeExperiment)
    return (
      <ApplicationShell mode="immersive">
        <main className={styles.participant}>
          <div className={styles.waiting}>
            <span>ROOM {session.roomCode}</span>
            <h1>WAITING FOR THE HOST.</h1>
            <p>
              {session.status === "waiting"
                ? "The next experiment will appear here."
                : "The session is paused."}
            </p>
          </div>
        </main>
      </ApplicationShell>
    );
  const experiment = getExperiment(session.activeExperiment);
  return (
    <ApplicationShell mode="immersive" label={`ROOM ${session.roomCode}`}>
      <main className={styles.participant}>
        <p className={styles.eyebrow}>
          0{experiment.order} — {experiment.shortTitle}
        </p>
        <h1>{experiment.title}</h1>
        {submittedFor === experiment.id ? (
          <div className={styles.submitted}>
            <strong>RESPONSE RECEIVED</strong>
            <p>
              {session.resultsRevealed
                ? "Results have been revealed on the host screen."
                : "Wait for the host to continue."}
            </p>
          </div>
        ) : (
          <ClassResponsePanel
            id={experiment.id}
            onSubmit={(payload) => void submit(experiment.id, payload)}
          />
        )}{" "}
        {error && <p className={styles.error}>{error}</p>}
      </main>
    </ApplicationShell>
  );
}

function ClassResponsePanel({
  id,
  onSubmit,
}: {
  id: ExperimentId;
  onSubmit(payload: JsonValue): void;
}) {
  const [value, setValue] = useState<string>("");
  const [multi, setMulti] = useState<string[]>([]);
  const [number, setNumber] = useState(50);
  let choices: string[] = [];
  if (id === "simulation")
    choices = ["physical-reality", "experiential-reality", "uncertain"];
  if (id === "brain-vat")
    choices = [
      "sensory-trust",
      "logical-consistency",
      "external-verification",
      "practical-acceptance",
      "certainty-impossible",
    ];
  if (id === "teleporter")
    choices = [
      "yes / earth",
      "yes / both",
      "no / earth",
      "no / neither",
      "unsure / problem",
    ];
  if (id === "replace-world")
    choices = ["threshold", "never-stopped", "origin-not-criterion"];
  if (id === "ai-consciousness")
    choices = [
      "verbal-report",
      "human-behavior",
      "long-memory",
      "pain-reports",
      "self-reflection",
      "brain-like-mechanism",
      "consistent-behavior",
      "nothing",
      "unsure",
    ];
  if (id === "replace-yourself")
    choices = [
      "same through all",
      "changed after physical replacement",
      "changed after psychological replacement",
      "uncertain",
    ];
  const isRange = id === "evidence-chain";
  const isMulti = id === "ai-consciousness";
  function payload(): JsonValue {
    if (isRange) return { confidence: number };
    if (id === "simulation") return { committedPosition: value };
    if (id === "replace-world") return { criterion: value };
    if (id === "brain-vat") return { strategy: value };
    if (id === "teleporter") {
      const [survival, original] = value.split(" / ");
      return { survival, original };
    }
    if (id === "replace-yourself") return { classPattern: value };
    return {
      selectedEvidence: multi,
      limit: multi.includes("nothing")
        ? "nothing"
        : multi.includes("unsure")
          ? "unsure"
          : null,
    };
  }
  return (
    <div className={styles.responsePanel}>
      {isRange ? (
        <>
          <label htmlFor="class-confidence">
            How confident are you now? <strong>{number}%</strong>
          </label>
          <input
            id="class-confidence"
            type="range"
            min="0"
            max="100"
            value={number}
            onChange={(e) => setNumber(Number(e.target.value))}
          />
        </>
      ) : (
        <fieldset>
          <legend>
            {isMulti
              ? "Select every form of evidence that would matter."
              : "Choose the position closest to your response."}
          </legend>
          <div className={styles.responseChoices}>
            {choices.map((choice) => {
              const active = isMulti
                ? multi.includes(choice)
                : value === choice;
              return (
                <button
                  key={choice}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    isMulti
                      ? setMulti((current) =>
                          current.includes(choice)
                            ? current.filter((x) => x !== choice)
                            : [
                                ...current.filter(
                                  (x) => x !== "nothing" && x !== "unsure",
                                ),
                                choice,
                              ],
                        )
                      : setValue(choice)
                  }
                >
                  {choice.replaceAll("-", " ").toUpperCase()}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}
      <Button
        className={styles.submit}
        disabled={!isRange && !value && !multi.length}
        onClick={() => onSubmit(payload())}
      >
        SUBMIT RESPONSE
      </Button>
    </div>
  );
}

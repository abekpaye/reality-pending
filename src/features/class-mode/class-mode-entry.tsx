"use client";
import Link from "next/link";
import { ApplicationShell } from "@/components/layout/application-shell";
import { classModeConfigured } from "./supabase";
import styles from "./class-mode.module.css";
export function ClassModeEntry() {
  const configured = classModeConfigured();
  return (
    <ApplicationShell mode="public" label="REALITY PENDING / CLASS MODE">
      <main className={styles.entry}>
        <p className={styles.eyebrow}>LIVE SEMINAR MODE</p>
        <h1>
          ONE ROOM.
          <br />
          MANY POSITIONS.
        </h1>
        <p>
          Run the experiments together, reveal anonymous patterns, and use
          disagreement as the beginning of discussion.
        </p>
        {configured ? (
          <div className={styles.entryActions}>
            <Link href="/class/host">HOST A SESSION</Link>
            <Link href="/class/join">JOIN A SESSION</Link>
          </div>
        ) : (
          <div className={styles.configuration}>
            <strong>CLASS MODE NEEDS CONNECTION</strong>
            <p>
              The complete Supabase integration is present, but this local
              environment has no public project configuration. Follow{" "}
              <code>SETUP_REQUIRED.md</code> to enable live rooms.
            </p>
          </div>
        )}
        <Link className={styles.back} href="/">
          Return
        </Link>
      </main>
    </ApplicationShell>
  );
}

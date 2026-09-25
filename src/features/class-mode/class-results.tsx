import { aggregateResponses } from "./aggregation";
import type { ClassResponse } from "./types";
import type { ExperimentId } from "@/types/experiments";
import styles from "./class-mode.module.css";
export function ClassResults({
  experimentId,
  responses,
}: {
  experimentId: ExperimentId;
  responses: ClassResponse[];
}) {
  const result = aggregateResponses(experimentId, responses);
  if (result.total === 0)
    return (
      <div className={styles.results}>
        <p>No responses yet.</p>
      </div>
    );
  if (result.kind === "trajectory")
    return (
      <div className={styles.results}>
        <p>AGGREGATE CONFIDENCE TRAJECTORY / {result.total} RESPONSES</p>
        <div
          className={styles.trajectory}
          aria-label={`Average confidence values: ${result.series?.join(", ")}`}
        >
          {result.series?.map((value, index) => (
            <i
              key={index}
              style={{ height: `${value}%` }}
              title={`${value}%`}
            />
          ))}
        </div>
      </div>
    );
  const max = Math.max(...result.data.map((item) => item.value), 1);
  return (
    <div className={styles.results}>
      <p>
        {result.kind.replaceAll("-", " ").toUpperCase()} / {result.total}{" "}
        RESPONSES
      </p>
      {result.kind === "branches" ? (
        <div className={styles.branchGrid}>
          {result.data.map((item) => (
            <div key={item.label}>
              <strong>{item.value}</strong>
              <p>{item.label.replaceAll("-", " ")}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.bars}>
          {result.data.map((item) => (
            <div key={item.label} className={styles.bar}>
              <span>{item.label.replaceAll("-", " ")}</span>
              <i style={{ width: `${(item.value / max) * 100}%` }} />
              <b>{item.value}</b>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

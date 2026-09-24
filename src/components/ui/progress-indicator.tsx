interface ProgressIndicatorProps {
  current: number;
  total?: number;
  label?: string;
  currentComplete?: boolean;
}

export function ProgressIndicator({ current, total = 7, label = "Experiment progress", currentComplete = false }: ProgressIndicatorProps) {
  return (
    <div className="progress-indicator" aria-label={`${label}: ${current} of ${total}`}>
      <div className="progress-indicator__meta">
        <span>{String(current).padStart(2, "0")}</span>
        <span aria-hidden="true">/</span>
        <span>{String(total).padStart(2, "0")}</span>
      </div>
      <ol className="progress-indicator__track" aria-hidden="true">
        {Array.from({ length: total }, (_, index) => (
          <li key={index} data-state={index + 1 < current || (index + 1 === current && currentComplete) ? "complete" : index + 1 === current ? "current" : "upcoming"} />
        ))}
      </ol>
    </div>
  );
}

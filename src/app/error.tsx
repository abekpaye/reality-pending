"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="foundation-page" role="alert">
      <p className="label-text">REALITY PENDING / RECOVERY</p>
      <h1 className="question-text">Something interrupted the experience.</h1>
      <div className="foundation-page__footer">
        <p className="body-secondary">The foundation is still available. Try rendering this view again.</p>
        <button className="retry-button" type="button" onClick={() => reset()}>Try again</button>
      </div>
    </main>
  );
}

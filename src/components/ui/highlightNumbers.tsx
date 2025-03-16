export function HighlightNumbers({ phrase }: { phrase: string }) {
  const parts = phrase.split(/(\d+)/);
  return (
    <div>
      {parts.map((part, idx) =>
        /^\d+$/.test(part) ? (
          <span
            key={idx}
            className="text-highlight"
          >
            {part}
          </span>
        ) : (
          <span key={idx}>{part}</span>
        ),
      )}
    </div>
  );
}

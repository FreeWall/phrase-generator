export function NumbersHighlighter({ phrase }: { phrase: string }) {
  return phrase.split(/(\d+)/).map((part, idx) =>
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
  );
}

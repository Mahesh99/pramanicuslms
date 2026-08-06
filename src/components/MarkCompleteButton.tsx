"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { markComplete } from "@/app/actions/progress";

export function MarkCompleteButton({
  courseId,
  moduleId,
  initiallyComplete,
}: {
  courseId: string;
  moduleId: string;
  initiallyComplete: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [complete, setComplete] = useState(initiallyComplete);
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await markComplete(courseId, moduleId);
      if (result.ok) {
        setComplete(true);
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="mark-complete-wrap" style={{ flexDirection: "column", alignItems: "center", gap: ".5rem" }}>
      <button
        type="button"
        className={`mark-complete-btn${complete ? " is-complete" : ""}`}
        onClick={handleClick}
        disabled={complete || isPending}
      >
        {complete ? "✓ Completed" : isPending ? "Saving…" : "Mark as complete"}
      </button>
      {error && <span style={{ color: "#dc2626", fontSize: ".82rem" }}>{error}</span>}
    </div>
  );
}

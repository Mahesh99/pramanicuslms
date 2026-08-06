"use client";

import { useState } from "react";
import Link from "next/link";
import type { ModuleWithLock } from "@/lib/progress";

export function CourseModuleNav({
  courseId,
  modules,
  currentModuleId,
}: {
  courseId: string;
  modules: ModuleWithLock[];
  currentModuleId: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="course-nav-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>Course modules</span>
        <span>{open ? "▲" : "▼"}</span>
      </button>
      <aside className={`course-nav${open ? " is-open" : ""}`}>
        <div className="course-nav-title">Modules</div>
        <ul>
          {modules.map((mod) => {
            const isCurrent = mod.id === currentModuleId;
            const isComplete = Boolean(mod.completed_at);

            if (mod.locked) {
              return (
                <li key={mod.id}>
                  <span className="is-locked" aria-disabled="true">
                    <span className="course-nav-check">🔒</span>
                    {mod.title}
                  </span>
                </li>
              );
            }

            return (
              <li key={mod.id}>
                <Link
                  href={`/courses/${courseId}/modules/${mod.id}`}
                  className={isCurrent ? "active" : undefined}
                  onClick={() => setOpen(false)}
                >
                  <span className={`course-nav-check${isComplete ? " is-complete" : ""}`}>
                    {isComplete ? "✓" : mod.sort_order}
                  </span>
                  {mod.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
}

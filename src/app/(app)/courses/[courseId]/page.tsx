import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ensureEnrollmentClaimedByCourseId, getSessionUser } from "@/lib/auth";
import { getCourseForUser } from "@/lib/courses";
import { listModulesWithProgress, withLocking } from "@/lib/progress";

export default async function CoursePage({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ locked?: string }>;
}) {
  const { courseId } = await params;
  const { locked: lockedNotice } = await searchParams;

  const { user } = await getSessionUser();
  if (!user) redirect(`/?next=/courses/${courseId}`);

  const { supabase, enrolled } = await ensureEnrollmentClaimedByCourseId(courseId);
  if (!enrolled) redirect("/?denied=1");
  if (!supabase) redirect(`/?next=/courses/${courseId}`);

  const course = await getCourseForUser(supabase, courseId);
  if (!course) notFound();

  const modules = withLocking(await listModulesWithProgress(supabase, courseId, user.id));
  const total = modules.length;
  const done = modules.filter((m) => m.completed_at).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <>
      <header className="site-header">
        <div className="breadcrumb">
          <Link href="/dashboard">Home</Link>
          <span>/</span>
          <span>{course.title}</span>
        </div>
        <h1>{course.title}</h1>
        {course.description && <p className="subtitle">{course.description}</p>}
        {total > 0 && (
          <div className="course-progress-hero">
            <div className="progress-label">
              <span>{done}/{total} modules complete</span>
              <span>{pct}%</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}
      </header>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 1.5rem 4rem" }}>
        {lockedNotice && (
          <div className="empty-state" style={{ marginBottom: "1.5rem" }}>
            <p>🔒 That module is locked — complete the previous module first.</p>
          </div>
        )}
        {modules.length === 0 ? (
          <div className="empty-state">
            <p>No modules have been published for this course yet.</p>
          </div>
        ) : (
          <ul className="module-list">
            {modules.map((mod) => {
              const isComplete = Boolean(mod.completed_at);
              const rowClass = `module-list-row${isComplete ? " is-complete" : ""}${mod.locked ? " is-locked" : ""}`;
              const meta = (
                <span className="module-list-meta">
                  <span className="module-list-num">
                    Module {mod.sort_order}
                    {mod.week ? ` · ${mod.week}` : ""}
                  </span>
                  <span className="module-list-title">{mod.title}</span>
                  {mod.subtitle && <span className="module-list-subtitle">{mod.subtitle}</span>}
                </span>
              );

              if (mod.locked) {
                return (
                  <li key={mod.id}>
                    <span className={rowClass} aria-disabled="true">
                      <span className="module-list-status">🔒</span>
                      {meta}
                      <span className="module-list-arrow">🔒</span>
                    </span>
                  </li>
                );
              }

              return (
                <li key={mod.id}>
                  <Link href={`/courses/${courseId}/modules/${mod.id}`} className={rowClass}>
                    <span className="module-list-status">{isComplete ? "✓" : mod.sort_order}</span>
                    {meta}
                    <span className="module-list-arrow">→</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ModuleMarkdown } from "@/components/ModuleMarkdown";
import { CourseModuleNav } from "@/components/CourseModuleNav";
import { MarkCompleteButton } from "@/components/MarkCompleteButton";
import { ensureEnrollmentClaimedByCourseId } from "@/lib/auth";
import { getCourseForUser } from "@/lib/courses";
import { getModuleDatasets } from "@/lib/module-datasets";
import { getModuleById } from "@/lib/modules";
import { listModulesWithProgress, withLocking } from "@/lib/progress";

export default async function ModuleViewPage({
  params,
}: {
  params: Promise<{ courseId: string; moduleId: string }>;
}) {
  const { courseId, moduleId } = await params;

  const { supabase, user, enrolled } = await ensureEnrollmentClaimedByCourseId(courseId);
  if (!user) redirect(`/?next=/courses/${courseId}/modules/${moduleId}`);
  if (!enrolled) redirect("/?denied=1");
  if (!supabase) redirect(`/?next=/courses/${courseId}/modules/${moduleId}`);

  const [course, mod, progressModules] = await Promise.all([
    getCourseForUser(supabase, courseId),
    getModuleById(supabase, courseId, moduleId),
    listModulesWithProgress(supabase, courseId, user.id),
  ]);

  if (!course || !mod) notFound();

  const allModules = withLocking(progressModules);
  const idx = allModules.findIndex((m) => m.id === moduleId);

  // Sequential locking (Phase 7): bounce back to the course view if this
  // module isn't unlocked yet (e.g. direct link, back button, or race with
  // an in-flight mark-complete on the previous module).
  if (idx >= 0 && allModules[idx].locked) {
    redirect(`/courses/${courseId}?locked=1`);
  }

  const prev = idx > 0 ? allModules[idx - 1] : null;
  const next = idx >= 0 && idx < allModules.length - 1 ? allModules[idx + 1] : null;
  const isComplete = allModules[idx]?.completed_at != null;
  const nextLocked = next?.locked ?? false;

  return (
    <div className="course-shell">
      <CourseModuleNav courseId={courseId} modules={allModules} currentModuleId={moduleId} />
      <div className="course-shell-main">
        <header className="site-header">
          <div className="breadcrumb">
            <Link href="/dashboard">Dashboard</Link>
            <span>/</span>
            <Link href={`/courses/${courseId}`}>{course.title}</Link>
            <span>/</span>
            <span>Module {mod.sort_order}</span>
          </div>
          <h1>
            Module {mod.sort_order}: {mod.title}
          </h1>
          {mod.subtitle && <p className="subtitle">{mod.subtitle}</p>}
          <div className="header-pills">
            {mod.week && <span>📅 {mod.week}</span>}
            {mod.level && <span>🟢 {mod.level}</span>}
          </div>
        </header>

        <ModuleMarkdown
          content={mod.content_md}
          moduleNum={mod.sort_order}
          datasets={getModuleDatasets(course.slug, mod.slug)}
        />

        <MarkCompleteButton courseId={courseId} moduleId={moduleId} initiallyComplete={isComplete} />

        {(prev || next) && (
          <div className="module-nav-wrap">
            <div />
            <div className="module-nav">
              {prev ? (
                <Link className="prev" href={`/courses/${courseId}/modules/${prev.id}`}>
                  <span className="nav-dir">← Previous</span>
                  <span className="nav-title">
                    Module {prev.sort_order}: {prev.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {next && !nextLocked ? (
                <Link className="next" href={`/courses/${courseId}/modules/${next.id}`}>
                  <span className="nav-dir">Next Module →</span>
                  <span className="nav-title">
                    Module {next.sort_order}: {next.title}
                  </span>
                </Link>
              ) : next && nextLocked ? (
                <span className="next is-locked" aria-disabled="true">
                  <span className="nav-dir">🔒 Locked</span>
                  <span className="nav-title">Complete this module to continue</span>
                </span>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

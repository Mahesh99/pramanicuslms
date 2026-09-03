import Link from "next/link";
import { redirect } from "next/navigation";
import { ensureAnyEnrollmentClaimed } from "@/lib/auth";
import { listEnrolledCourses } from "@/lib/courses";
import { getDashboardCourseStats } from "@/lib/progress";

export default async function DashboardPage() {
  const { supabase, user, enrolled } = await ensureAnyEnrollmentClaimed();
  if (!user) redirect("/?next=/dashboard");
  if (!enrolled) redirect("/?denied=1");
  if (!supabase) redirect("/?next=/dashboard");

  const courses = await listEnrolledCourses(supabase, user.id, user.email);
  const courseStats = await getDashboardCourseStats(
    supabase,
    courses.map((c) => c.id),
    user.id,
  );

  return (
    <>
      <header className="site-header">
        <h1>Your courses</h1>
        <p className="subtitle">Continue where you left off</p>
      </header>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
        {courses.length === 0 ? (
          <div className="empty-state">
            <p>You are not enrolled in any courses yet. Contact your instructor if you expected access.</p>
          </div>
        ) : (
          <div className="module-grid">
            {courses.map((course, i) => {
              const stats = courseStats.get(course.id);
              const total = stats?.total ?? 0;
              const done = stats?.done ?? 0;
              const cont = stats?.cont;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              const href = cont
                ? `/courses/${course.id}/modules/${cont.id}`
                : `/courses/${course.id}`;

              return (
                <div key={course.id} className={`mod-card m${(i % 8) + 1}`}>
                  <div className="mod-card-top">
                    <div className="mod-card-icon">{i + 1}</div>
                    <div className="mod-card-meta">
                      <div className="mod-num">{course.slug}</div>
                      <h3>{course.title}</h3>
                    </div>
                  </div>
                  {course.description && (
                    <p style={{ color: "#4b5563", fontSize: ".9rem", margin: "0.75rem 0 1rem" }}>
                      {course.description}
                    </p>
                  )}
                  <div className="mod-card-progress">
                    <div className="progress-label">
                      <span>{done}/{total} modules complete</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="progress-bar-track">
                      <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <Link href={href} className="mod-link">
                    {done > 0 && done === total ? "Review course →" : cont ? "Continue →" : "Start →"}
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

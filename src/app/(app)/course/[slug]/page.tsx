import { notFound, redirect } from "next/navigation";
import { ensureEnrollmentClaimed } from "@/lib/auth";
import { getModuleContent } from "@/lib/modules";

/** Legacy module-slug route — Phase 6 retires this in favor of `/courses/[courseId]/modules/[moduleId]`. */
export default async function LegacyModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { supabase, user, enrolled, courseId } = await ensureEnrollmentClaimed();
  if (!user) redirect(`/?next=/course/${slug}`);
  if (!enrolled) redirect("/?denied=1");
  if (!supabase || !courseId) notFound();

  const mod = await getModuleContent(supabase, courseId, slug);
  if (!mod) notFound();

  redirect(`/courses/${courseId}/modules/${mod.id}`);
}

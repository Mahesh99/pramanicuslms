import type { SupabaseClient } from "@supabase/supabase-js";
import { listModules, type ModuleRow } from "@/lib/modules";

export type ModuleProgressRow = {
  id: string;
  user_id: string;
  module_id: string;
  completed_at: string | null;
};

export type ModuleWithProgress = ModuleRow & {
  completed_at: string | null;
};

export type ModuleWithLock = ModuleWithProgress & {
  locked: boolean;
};

export type ContinueModule = Pick<ModuleRow, "id" | "slug" | "title" | "sort_order">;

export type MarkCompleteResult =
  | { ok: true; completedAt: string }
  | { ok: false; error: string };

export async function listModulesWithProgress(
  supabase: SupabaseClient,
  courseId: string,
  userId: string,
): Promise<ModuleWithProgress[]> {
  const modules = await listModules(supabase, courseId);
  if (modules.length === 0) return [];

  const moduleIds = modules.map((m) => m.id);
  const { data: progressRows, error } = await supabase
    .from("module_progress")
    .select("module_id, completed_at")
    .eq("user_id", userId)
    .in("module_id", moduleIds);

  if (error) throw error;

  const completedAtByModule = new Map(
    (progressRows ?? []).map((row) => [row.module_id as string, row.completed_at as string | null]),
  );

  return modules.map((mod) => ({
    ...mod,
    completed_at: completedAtByModule.get(mod.id) ?? null,
  }));
}

/**
 * Sequential locking (Phase 7): a module is locked until the previous module
 * (by `sort_order`) is marked complete. The first module is always unlocked.
 * Pure/derived from data already fetched — no extra query, no schema change.
 */
export function withLocking(modules: ModuleWithProgress[]): ModuleWithLock[] {
  let previousComplete = true;
  return modules.map((mod) => {
    const locked = !previousComplete;
    previousComplete = Boolean(mod.completed_at);
    return { ...mod, locked };
  });
}

export async function getModuleProgress(
  supabase: SupabaseClient,
  userId: string,
  moduleId: string,
): Promise<ModuleProgressRow | null> {
  const { data, error } = await supabase
    .from("module_progress")
    .select("id, user_id, module_id, completed_at")
    .eq("user_id", userId)
    .eq("module_id", moduleId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function markModuleComplete(
  supabase: SupabaseClient,
  userId: string,
  moduleId: string,
): Promise<MarkCompleteResult> {
  const completedAt = new Date().toISOString();
  const { error } = await supabase.from("module_progress").upsert(
    {
      user_id: userId,
      module_id: moduleId,
      completed_at: completedAt,
    },
    { onConflict: "user_id,module_id" },
  );

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, completedAt };
}

export async function getContinueModule(
  supabase: SupabaseClient,
  courseId: string,
  userId: string,
): Promise<ContinueModule | null> {
  const modules = await listModulesWithProgress(supabase, courseId, userId);
  return pickContinueModule(modules);
}

export function pickContinueModule(modules: ModuleWithProgress[]): ContinueModule | null {
  if (modules.length === 0) return null;

  const incomplete = modules.find((m) => !m.completed_at) ?? modules[0];
  return {
    id: incomplete.id,
    slug: incomplete.slug,
    title: incomplete.title,
    sort_order: incomplete.sort_order,
  };
}

export type DashboardCourseStats = {
  total: number;
  done: number;
  cont: ContinueModule | null;
};

/** Batch-fetch module + progress stats for all courses on the dashboard. */
export async function getDashboardCourseStats(
  supabase: SupabaseClient,
  courseIds: string[],
  userId: string,
): Promise<Map<string, DashboardCourseStats>> {
  const stats = new Map<string, DashboardCourseStats>();
  if (courseIds.length === 0) return stats;

  const { data: modules, error: modulesError } = await supabase
    .from("modules")
    .select("id, course_id, slug, title, sort_order")
    .in("course_id", courseIds)
    .order("sort_order", { ascending: true });

  if (modulesError) throw modulesError;

  const moduleIds = (modules ?? []).map((m) => m.id as string);
  const completedAtByModule = new Map<string, string | null>();

  if (moduleIds.length > 0) {
    const { data: progressRows, error: progressError } = await supabase
      .from("module_progress")
      .select("module_id, completed_at")
      .eq("user_id", userId)
      .in("module_id", moduleIds);

    if (progressError) throw progressError;

    for (const row of progressRows ?? []) {
      completedAtByModule.set(row.module_id as string, row.completed_at as string | null);
    }
  }

  const modulesByCourse = new Map<string, ModuleWithProgress[]>();
  for (const mod of modules ?? []) {
    const courseId = mod.course_id as string;
    const list = modulesByCourse.get(courseId) ?? [];
    list.push({
      id: mod.id as string,
      slug: mod.slug as string,
      title: mod.title as string,
      subtitle: null,
      week: null,
      level: null,
      sort_order: mod.sort_order as number,
      completed_at: completedAtByModule.get(mod.id as string) ?? null,
    });
    modulesByCourse.set(courseId, list);
  }

  for (const courseId of courseIds) {
    const courseModules = modulesByCourse.get(courseId) ?? [];
    const total = courseModules.length;
    const done = courseModules.filter((m) => m.completed_at).length;
    stats.set(courseId, { total, done, cont: pickContinueModule(courseModules) });
  }

  return stats;
}

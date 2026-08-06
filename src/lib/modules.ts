import type { SupabaseClient } from "@supabase/supabase-js";

export type ModuleRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  week: string | null;
  level: string | null;
  sort_order: number;
};

export type ModuleWithContent = ModuleRow & { content_md: string };

export async function listModules(
  supabase: SupabaseClient,
  courseId: string,
): Promise<ModuleRow[]> {
  const { data, error } = await supabase
    .from("modules")
    .select("id, slug, title, subtitle, week, level, sort_order")
    .eq("course_id", courseId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getModuleContent(
  supabase: SupabaseClient,
  courseId: string,
  slug: string,
): Promise<ModuleWithContent | null> {
  const { data, error } = await supabase
    .from("modules")
    .select("id, slug, title, subtitle, week, level, sort_order, content_md")
    .eq("course_id", courseId)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getModuleById(
  supabase: SupabaseClient,
  courseId: string,
  moduleId: string,
): Promise<ModuleWithContent | null> {
  const { data, error } = await supabase
    .from("modules")
    .select("id, slug, title, subtitle, week, level, sort_order, content_md")
    .eq("course_id", courseId)
    .eq("id", moduleId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

"use server";

import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/auth";
import { markModuleComplete, type MarkCompleteResult } from "@/lib/progress";

export async function markComplete(
  courseId: string,
  moduleId: string,
): Promise<MarkCompleteResult> {
  const { supabase, user } = await getSessionUser();
  if (!supabase || !user) {
    return { ok: false, error: "Not signed in." };
  }

  const result = await markModuleComplete(supabase, user.id, moduleId);

  if (result.ok) {
    revalidatePath("/dashboard");
    revalidatePath(`/courses/${courseId}`);
    revalidatePath(`/courses/${courseId}/modules/${moduleId}`);
  }

  return result;
}

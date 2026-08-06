import { redirect } from "next/navigation";

/** Legacy `/course` index — Phase 3 redirects to the dashboard. */
export default function CourseIndexPage() {
  redirect("/dashboard");
}

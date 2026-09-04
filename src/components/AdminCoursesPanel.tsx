"use client";

import { useActionState, useState } from "react";
import {
  archiveCourse,
  createCourse,
  restoreCourse,
  updateCourse,
} from "@/app/actions/invites";
import type { AdminCourseRow } from "@/lib/admin-types";

type ActionResult = { error?: string; success?: boolean };

export function AdminCoursesPanel({ courses }: { courses: AdminCourseRow[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const [createState, createAction, createPending] = useActionState<ActionResult | null, FormData>(
    async (_prev, formData) => {
      const result = await createCourse(formData);
      if ("error" in result && result.error) return { error: result.error };
      if ("success" in result && result.success) return { success: true };
      return null;
    },
    null,
  );

  const [updateState, updateAction, updatePending] = useActionState<ActionResult | null, FormData>(
    async (_prev, formData) => {
      const result = await updateCourse(formData);
      if ("error" in result && result.error) return { error: result.error };
      if ("success" in result && result.success) {
        setEditingId(null);
        return { success: true };
      }
      return null;
    },
    null,
  );

  return (
    <div>
      <section style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Create course</h2>
        <p style={{ color: "#4b5563", marginBottom: "1rem", fontSize: "0.95rem" }}>
          Slug is generated automatically from the title.
        </p>
        <form action={createAction} className="auth-form">
          <label>
            Title
            <input type="text" name="title" required placeholder="Oracle SQL Advanced" />
          </label>
          <label>
            Description
            <input type="text" name="description" placeholder="Optional short description" />
          </label>
          {createState?.error && <p className="auth-error">{createState.error}</p>}
          {createState?.success && <p className="auth-success">Course created.</p>}
          <button type="submit" className="btn-primary" disabled={createPending}>
            {createPending ? "Creating…" : "Create course"}
          </button>
        </form>
      </section>

      <section>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>All courses</h2>
        {courses.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No courses yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {courses.map((course) => {
              const archived = Boolean(course.archivedAt);
              const editing = editingId === course.id;
              return (
                <li
                  key={course.id}
                  style={{
                    padding: "1rem 0",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {editing ? (
                    <form action={updateAction} className="auth-form">
                      <input type="hidden" name="id" value={course.id} />
                      <label>
                        Title
                        <input type="text" name="title" required defaultValue={course.title} />
                      </label>
                      <label>
                        Description
                        <input
                          type="text"
                          name="description"
                          defaultValue={course.description ?? ""}
                        />
                      </label>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "#9ca3af" }}>
                        Slug: <code>{course.slug}</code> (not editable)
                      </p>
                      {updateState?.error && <p className="auth-error">{updateState.error}</p>}
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button type="submit" className="btn-primary" disabled={updatePending}>
                          {updatePending ? "Saving…" : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          style={{
                            border: "1px solid #d1d5db",
                            background: "#fff",
                            borderRadius: 6,
                            padding: "0.45rem 0.85rem",
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.5rem",
                          alignItems: "baseline",
                        }}
                      >
                        <strong>{course.title}</strong>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            padding: "0.15rem 0.45rem",
                            borderRadius: 4,
                            background: archived ? "#f3f4f6" : "#ecfdf5",
                            color: archived ? "#6b7280" : "#047857",
                          }}
                        >
                          {archived ? "Archived" : "Active"}
                        </span>
                        <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                          <code>{course.slug}</code>
                        </span>
                      </div>
                      {course.description && (
                        <p style={{ margin: "0.4rem 0 0.75rem", color: "#4b5563", fontSize: "0.9rem" }}>
                          {course.description}
                        </p>
                      )}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                        <button
                          type="button"
                          onClick={() => setEditingId(course.id)}
                          style={{
                            border: "1px solid #d1d5db",
                            background: "#fff",
                            borderRadius: 6,
                            padding: "0.35rem 0.7rem",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                          }}
                        >
                          Edit
                        </button>
                        {archived ? (
                          <form
                            action={async (fd) => {
                              await restoreCourse(fd);
                            }}
                          >
                            <input type="hidden" name="id" value={course.id} />
                            <button
                              type="submit"
                              style={{
                                border: "1px solid #a7f3d0",
                                background: "#ecfdf5",
                                color: "#047857",
                                borderRadius: 6,
                                padding: "0.35rem 0.7rem",
                                cursor: "pointer",
                                fontSize: "0.8rem",
                              }}
                            >
                              Restore
                            </button>
                          </form>
                        ) : (
                          <form
                            action={async (fd) => {
                              await archiveCourse(fd);
                            }}
                          >
                            <input type="hidden" name="id" value={course.id} />
                            <button
                              type="submit"
                              style={{
                                border: "1px solid #e5e7eb",
                                background: "#f9fafb",
                                color: "#4b5563",
                                borderRadius: 6,
                                padding: "0.35rem 0.7rem",
                                cursor: "pointer",
                                fontSize: "0.8rem",
                              }}
                            >
                              Archive
                            </button>
                          </form>
                        )}
                      </div>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

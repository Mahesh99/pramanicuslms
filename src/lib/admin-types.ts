export type CourseOption = {
  id: string;
  title: string;
};

export type EnrollmentRow = {
  id: string;
  courseId: string;
  courseTitle: string;
  invitedAt: string;
  joinedAt: string | null;
};

export type AdminUserRow = {
  email: string;
  userId: string | null;
  enrollments: EnrollmentRow[];
};

export type AdminCourseRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  archivedAt: string | null;
};

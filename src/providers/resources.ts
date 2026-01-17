import { ResourceProps } from "@refinedev/core";

export const resources: ResourceProps[] = [
  {
    name: "users",
    list: "/users",
    create: "/users/create",
    edit: "/users/edit/:id",
    show: "/users/show/:id",
    meta: {
      label: "Users",
      icon: "users",
    },
  },
  {
    name: "courses",
    list: "/courses",
    create: "/courses/create",
    edit: "/courses/edit/:id",
    show: "/courses/show/:id",
    meta: {
      label: "Courses",
      icon: "book-open",
    },
  },
  {
    name: "course_phases",
    list: "/courses/:courseId/phases",
    create: "/courses/:courseId/phases/create",
    edit: "/courses/:courseId/phases/edit/:id",
    meta: {
      label: "Course Phases",
      parent: "courses",
    },
  },
  {
    name: "enrollments",
    list: "/enrollments",
    create: "/enrollments/create",
    edit: "/enrollments/edit/:id",
    show: "/enrollments/show/:id",
    meta: {
      label: "Enrollments",
      icon: "clipboard-list",
    },
  },
  {
    name: "payments",
    list: "/payments",
    show: "/payments/show/:id",
    meta: {
      label: "Payments",
      icon: "credit-card",
    },
  },
];

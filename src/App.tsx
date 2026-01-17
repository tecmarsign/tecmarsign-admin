import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Refine, Authenticated } from "@refinedev/core";
import routerProvider from "@refinedev/react-router";
import { dataProvider } from "@/providers/dataProvider";
import { authProvider } from "@/providers/authProvider";
import { resources } from "@/providers/resources";
import { AdminLayout } from "@/components/layout/AdminLayout";
import Login from "./pages/Login";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AccessDenied from "./pages/AccessDenied";
import Dashboard from "./pages/Dashboard";
import UsersPage from "./pages/users/UsersPage";
import CreateUserPage from "./pages/users/CreateUserPage";
import EditUserPage from "./pages/users/EditUserPage";
import CoursesPage from "./pages/courses/CoursesPage";
import CreateCoursePage from "./pages/courses/CreateCoursePage";
import EditCoursePage from "./pages/courses/EditCoursePage";
import CourseShowPage from "./pages/courses/CourseShowPage";
import EnrollmentsPage from "./pages/enrollments/EnrollmentsPage";
import PaymentsPage from "./pages/payments/PaymentsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Refine
          dataProvider={dataProvider}
          authProvider={authProvider}
          routerProvider={routerProvider}
          resources={resources}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
          }}
        >
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/access-denied" element={<AccessDenied />} />
            
            {/* Protected routes wrapped in Authenticated */}
            <Route
              element={
                <Authenticated key="protected-routes" redirectOnFail="/login">
                  <AdminLayout />
                </Authenticated>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/users/create" element={<CreateUserPage />} />
              <Route path="/users/edit/:id" element={<EditUserPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/create" element={<CreateCoursePage />} />
              <Route path="/courses/edit/:id" element={<EditCoursePage />} />
              <Route path="/courses/show/:id" element={<CourseShowPage />} />
              <Route path="/enrollments" element={<EnrollmentsPage />} />
              <Route path="/payments" element={<PaymentsPage />} />
            </Route>
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Refine>
        <Toaster />
        <Sonner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
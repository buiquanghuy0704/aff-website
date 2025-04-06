import { Suspense, lazy } from "react";
import { RouteObject } from "react-router-dom";

const HomePage = lazy(() => import("../pages/Home"));
const DashboardPage = lazy(() => import("../pages/Dashboard"));

export const routes = {
  home: {
    path: "/",
    label: "Trang chủ",
  },
  dashboard: {
    path: "/dashboard",
    label: "Trang chủ",
  },
};

export const PublicRoutes: RouteObject[] = [
  {
    path: routes.home.path,
    element: (
      <Suspense fallback={<div className="animate-spin" />}>
        <HomePage />
      </Suspense>
    ),
  },
  {
    path: routes.dashboard.path,
    element: (
      <Suspense fallback={<div className="animate-spin" />}>
        <DashboardPage />
      </Suspense>
    ),
  },
];

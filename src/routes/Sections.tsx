import React, { Suspense, lazy } from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";
import { Error, Loading, ScrollToTop } from "@/components";
import DashboardLayout from "@/layout";
import { useAnimation } from "@/hooks/useAnimation";
import AuthenPage from "@/pages/AuthenPage";
import useAuth from "@/hooks/useAuth";

export const ChartPage = lazy(() => import("@/pages/ChartPage"));
export const CityManagementPage = lazy(
  () => import("@/pages/CityManagementPage"),
);
export const UserManagementPage = lazy(
  () => import("@/pages/UserManagementPage"),
);
export const CompanyManagementPage = lazy(
  () => import("@/pages/CompanyManagementPage"),
);
export const ServiceManagementPage = lazy(
  () => import("@/pages/ServiceManagementPage"),
);
export const RouteManagementPage = lazy(
  () => import("@/pages/RouteManagementPage"),
);

const Router: React.FC = () => {
  useAnimation();
  const isAuthenticated = useAuth((state) => state.isAuthenticated);

  const routes = useRoutes([
    {
      path: "/",
      element: isAuthenticated ? <Navigate to="/chart" /> : <AuthenPage />,
    },
    {
      element: isAuthenticated ? (
        <DashboardLayout>
          <ScrollToTop>
            <Suspense fallback={<Loading />}>
              <Outlet />
            </Suspense>
          </ScrollToTop>
        </DashboardLayout>
      ) : (
        <Navigate to="/" />
      ),
      children: [
        {
          element: <ChartPage />,
          path: "/chart",
        },
        {
          element: <CityManagementPage />,
          path: "/city",
        },
        {
          element: <UserManagementPage />,
          path: "/user",
        },
        {
          element: <CompanyManagementPage />,
          path: "/company",
        },
        {
          element: <ServiceManagementPage />,
          path: "/service",
        },
        {
          element: <RouteManagementPage />,
          path: "/route",
        },

        { element: <Error />, path: "*" },
      ],
    },
  ]);

  return routes;
};

export default Router;

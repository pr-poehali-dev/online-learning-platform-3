import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import AuthPage from "./AuthPage";
import CatalogPage from "./CatalogPage";
import MyApplicationsPage from "./MyApplicationsPage";
import AdminPage from "./AdminPage";
import AppNavigation from "@/components/AppNavigation";

export type AppPage = "catalog" | "my-applications" | "admin";

export default function Index() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState<AppPage>("catalog");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <AuthPage />;

  return (
    <div className="min-h-screen bg-background font-golos">
      <AppNavigation page={page} setPage={setPage} />
      <main className="pt-16">
        {page === "catalog" && <CatalogPage />}
        {page === "my-applications" && user.role !== "admin" && <MyApplicationsPage />}
        {page === "admin" && user.role === "admin" && <AdminPage />}
        {page === "my-applications" && user.role === "admin" && <AdminPage />}
      </main>
    </div>
  );
}

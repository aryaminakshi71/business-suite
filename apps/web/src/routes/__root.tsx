import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import { Navigation } from "@/components/navigation";

export const Route = createRootRoute({
  component: () => (
    <PostHogProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Outlet />
        </main>
        {import.meta.env.DEV && <TanStackRouterDevtools />}
      </div>
    </PostHogProvider>
  ),
});

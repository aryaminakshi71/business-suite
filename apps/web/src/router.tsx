import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
        },
    },
});

export function createRouter() {
    return createTanStackRouter({
        routeTree,
        scrollRestoration: true,
        context: {
            queryClient,
        },
    });
}

// TanStack Start expects getRouter export
export function getRouter() {
    return createRouter();
}

declare module "@tanstack/react-router" {
    interface Register {
        router: ReturnType<typeof createRouter>;
    }
}

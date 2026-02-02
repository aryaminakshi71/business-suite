import handler from "@tanstack/react-start/server-entry";
import api from "@suite/api";
import { getRouter } from "./router";

export interface CloudflareRequestContext {
    cloudflare: {
        env: any;
        ctx: any;
    };
}

declare module "@tanstack/react-start" {
    interface Register {
        ssr: true;
        router: ReturnType<typeof getRouter>;
        server: {
            requestContext: CloudflareRequestContext;
        };
    }
}

export default {
    async fetch(
        request: Request,
        env: any,
        ctx: any
    ): Promise<Response> {
        const url = new URL(request.url);

        if (url.pathname.startsWith("/api")) {
            return api.fetch(request, env, ctx);
        }
        return handler.fetch(request, {
            context: {
                cloudflare: { env, ctx },
            },
        } as Parameters<typeof handler.fetch>[1]);
    },
};

import { createRootRoute, Outlet, HeadContent } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import { Navigation } from "@/components/navigation";
import { ErrorPage, NotFoundPage } from "@/components/error";
import { generateOrganizationSchema, generateWebSiteSchema, getBusinessSuiteOrganizationSchema } from "@/lib/structured-data";
import { registerServiceWorker } from "@/lib/service-worker";
import { addSkipLink } from "@/lib/accessibility";
import { useEffect } from "react";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Business Suite - Integrated Business Management Platform" },
      { name: "description", content: "Comprehensive business suite integrating CRM, invoicing, projects, helpdesk, and queue management. All your business tools in one platform." },
      { name: "keywords", content: "business suite, business management, integrated CRM, business software, all-in-one business platform" },
      { property: "og:title", content: "Business Suite - Integrated Business Platform" },
      { property: "og:description", content: "All your business management tools in one integrated platform." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "index, follow" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://api.your-domain.com" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  component: () => {
    useEffect(() => {
      registerServiceWorker();
      // Add skip link for accessibility
      addSkipLink("main-content", "Skip to main content");
    }, []);

    const organizationSchema = generateOrganizationSchema(getBusinessSuiteOrganizationSchema())
    const websiteSchema = generateWebSiteSchema({
      name: 'Business Suite',
      url: import.meta.env.VITE_PUBLIC_SITE_URL || 'https://business-suite.your-domain.com',
      description: 'Integrated business management platform combining CRM, invoicing, projects, helpdesk, and queue management.',
    })

    return (
      <html lang="en">
        <head>
          <HeadContent />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationSchema),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(websiteSchema),
            }}
          />
        </head>
        <body>
          <PostHogProvider>
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              <main id="main-content" className="container mx-auto px-4 py-8" tabIndex={-1}>
                <Outlet />
              </main>
              {import.meta.env.DEV && <TanStackRouterDevtools />}
            </div>
          </PostHogProvider>
        </body>
      </html>
    )
  },
  errorComponent: ({ error }) => <ErrorPage error={error} />,
  notFoundComponent: () => <NotFoundPage />,
});

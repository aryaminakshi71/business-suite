import { Link, useLocation } from "@tanstack/react-router";
import type { ModuleName } from "@suite/shared";

const modules: Array<{
  name: ModuleName;
  displayName: string;
  path: string;
  icon: string;
}> = [
    { name: "projects", displayName: "Projects", path: "/projects", icon: "📁" },
    { name: "crm", displayName: "CRM", path: "/crm", icon: "👥" },
    { name: "invoicing", displayName: "Invoicing", path: "/invoicing", icon: "💰" },
    { name: "helpdesk", displayName: "Helpdesk", path: "/helpdesk", icon: "🎫" },
    { name: "queue", displayName: "Queue", path: "/queue", icon: "🎟️" },
  ];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-gray-900">
              Business Suite
            </Link>
            <div className="flex space-x-1">
              {modules.map((module) => (
                <Link
                  key={module.name}
                  to={module.path}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname.startsWith(module.path)
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <span className="mr-2">{module.icon}</span>
                  {module.displayName}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
              Sign In
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

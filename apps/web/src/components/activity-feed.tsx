import { useQuery } from "@tanstack/react-query";
import { formatRelativeTime } from "@suite/shared";
import type { UnifiedActivity } from "@suite/shared";

async function fetchActivity(limit: number = 20): Promise<UnifiedActivity[]> {
  const response = await fetch(`/api/unified/activity?limit=${limit}`);
  if (!response.ok) {
    throw new Error("Failed to fetch activity");
  }
  const data = (await response.json()) as { activities?: UnifiedActivity[] };
  return data.activities || [];
}

export function ActivityFeed() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["activity"],
    queryFn: () => fetchActivity(20),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-gray-500">Loading activity...</div>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No recent activity
      </div>
    );
  }

  const moduleIcons: Record<string, string> = {
    projects: "📁",
    crm: "👥",
    invoicing: "💰",
    helpdesk: "🎫",
    queue: "🎟️",
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="text-2xl">{moduleIcons[activity.module] || "📌"}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  {activity.title}
                </p>
                <span className="text-xs text-gray-500 ml-2">
                  {formatRelativeTime(activity.timestamp)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {activity.description}
              </p>
              {activity.userName && (
                <p className="text-xs text-gray-500 mt-1">
                  by {activity.userName}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

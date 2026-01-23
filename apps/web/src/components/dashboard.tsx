import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@suite/shared";
import type { SuiteStats } from "@suite/shared";
import { ActivityFeed } from "./activity-feed";

async function fetchDashboardStats(): Promise<SuiteStats> {
  const response = await fetch("/api/unified/dashboard/stats");
  if (!response.ok) {
    throw new Error("Failed to fetch dashboard stats");
  }
  return response.json();
}

export function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: fetchDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Failed to load dashboard</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Overview of all your business modules
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Projects Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">📁 Projects</h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total</span>
              <span className="font-semibold">{stats.projects.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active</span>
              <span className="text-blue-600">{stats.projects.active}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Completed</span>
              <span className="text-green-600">{stats.projects.completed}</span>
            </div>
          </div>
        </div>

        {/* CRM Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">👥 CRM</h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Contacts</span>
              <span className="font-semibold">{stats.crm.contacts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Deals</span>
              <span className="text-blue-600">{stats.crm.deals}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Revenue</span>
              <span className="text-green-600">
                {formatCurrency(stats.crm.revenue)}
              </span>
            </div>
          </div>
        </div>

        {/* Invoicing Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">💰 Invoicing</h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Invoices</span>
              <span className="font-semibold">{stats.invoicing.invoices}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Paid</span>
              <span className="text-green-600">{stats.invoicing.paid}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending</span>
              <span className="text-yellow-600">{stats.invoicing.pending}</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="text-gray-900 font-semibold">Revenue</span>
              <span className="text-green-600 font-bold">
                {formatCurrency(stats.invoicing.revenue)}
              </span>
            </div>
          </div>
        </div>

        {/* Helpdesk Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">🎫 Helpdesk</h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Tickets</span>
              <span className="font-semibold">{stats.helpdesk.tickets}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Open</span>
              <span className="text-red-600">{stats.helpdesk.open}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Resolved</span>
              <span className="text-green-600">{stats.helpdesk.resolved}</span>
            </div>
          </div>
        </div>

        {/* Queue Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">🎟️ Queue</h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Tokens</span>
              <span className="font-semibold">{stats.queue.tokens}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active</span>
              <span className="text-blue-600">{stats.queue.active}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Completed</span>
              <span className="text-green-600">{stats.queue.completed}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="mt-8">
        <ActivityFeed />
      </div>
    </div>
  );
}

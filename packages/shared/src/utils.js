/**
 * Shared utilities
 */
/**
 * Get module display name
 */
export function getModuleDisplayName(module) {
    const names = {
        projects: "Projects",
        crm: "CRM",
        invoicing: "Invoicing",
        helpdesk: "Helpdesk",
        queue: "Queue",
    };
    return names[module] || module;
}
/**
 * Format currency
 */
export function formatCurrency(amount, currency = "USD") {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
    }).format(amount);
}
/**
 * Format date
 */
export function formatDate(date) {
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(d);
}
/**
 * Format relative time
 */
export function formatRelativeTime(date) {
    const d = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1)
        return "just now";
    if (diffMins < 60)
        return `${diffMins} min ago`;
    if (diffHours < 24)
        return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7)
        return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return formatDate(d);
}

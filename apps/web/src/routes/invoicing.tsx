import { createFileRoute } from "@tanstack/react-router";
import { ModuleEmbed } from "@/components/module-embed";

export const Route = createFileRoute("/invoicing")({
  component: () => (
    <div className="h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Invoicing</h1>
        <p className="text-gray-600 text-sm mt-1">
          Create invoices, track payments, and manage billing
        </p>
      </div>
      <ModuleEmbed module="invoicing" mode="iframe" height="calc(100vh - 200px)" />
    </div>
  ),
});

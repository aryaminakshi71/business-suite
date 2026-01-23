import { createFileRoute } from "@tanstack/react-router";
import { ModuleEmbed } from "@/components/module-embed";

export const Route = createFileRoute("/crm")({
  component: () => (
    <div className="h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">CRM</h1>
        <p className="text-gray-600 text-sm mt-1">
          Manage contacts, deals, and sales pipeline
        </p>
      </div>
      <ModuleEmbed module="crm" mode="iframe" height="calc(100vh - 200px)" />
    </div>
  ),
});
